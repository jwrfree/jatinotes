const fs = require('fs');
const { JSDOM } = require('jsdom');
const { window } = new JSDOM('');
global.DOMParser = window.DOMParser;
global.Node = window.Node;

// --- Configuration ---
const WORDPRESS_API_URL = 'https://jatinotes.com/graphql';

// --- Custom HTML to Portable Text Parser ---
function parseHtmlToBlocks(html) {
    if (!html) return [];

    // Clean HTML specific for WP
    html = html.replace(/&nbsp;/g, ' ');

    const dom = new JSDOM(html);
    const doc = dom.window.document;
    const body = doc.body;
    const blocks = [];

    function generateKey() {
        return Math.random().toString(36).substring(2, 12); // Simple random key
    }

    function processChildren(node, marks = []) {
        let spans = [];

        node.childNodes.forEach(child => {
            if (child.nodeType === 3) { // Text Node
                const text = child.textContent;
                if (text) {
                    spans.push({
                        _type: 'span',
                        _key: generateKey(),
                        marks: [...marks],
                        text: text
                    });
                }
            } else if (child.nodeType === 1) { // Element
                const tag = child.tagName.toLowerCase();
                if (tag === 'br') {
                    spans.push({ _type: 'span', _key: generateKey(), marks: [], text: '\n' });
                } else if (tag === 'strong' || tag === 'b') {
                    spans.push(...processChildren(child, [...marks, 'strong']));
                } else if (tag === 'em' || tag === 'i') {
                    spans.push(...processChildren(child, [...marks, 'em']));
                } else if (tag === 'u') {
                    spans.push(...processChildren(child, [...marks, 'underline']));
                } else if (tag === 'code') {
                    spans.push(...processChildren(child, [...marks, 'code']));
                } else if (tag === 'a') {
                    const href = child.getAttribute('href');
                    const markKey = generateKey();
                    spans.push(...processChildren(child, [...marks, markKey]));
                    // We need to store the mark definition somewhere, typically on the block.
                    // But for this simple parser, we'll attach it to the block later or return it?
                    // Portable Text defines markDefs on the block.
                    // We'll handle this by returning spans AND markDefs.
                    // For simplicity, we'll use a hack or just mutate a passed context.
                } else if (tag === 'img') {
                    // Inline image? Not standard in Portable Text usually handled as block.
                    // Ignore for now in span context.
                } else {
                    spans.push(...processChildren(child, marks));
                }
            }
        });
        return spans;
    }

    // Since we need to collect markDefs, we'll simplify: 
    // We will do a second pass or handle link marks by adding them to the block.
    // Let's refine the child processor to return { children, markDefs }

    function processBlockChildren(node) {
        let spans = [];
        let markDefs = [];

        function traverse(n, currentMarks) {
            n.childNodes.forEach(child => {
                if (child.nodeType === 3) {
                    spans.push({
                        _type: 'span',
                        _key: generateKey(),
                        marks: [...currentMarks],
                        text: child.textContent
                    });
                } else if (child.nodeType === 1) {
                    const tag = child.tagName.toLowerCase();
                    if (tag === 'br') {
                        spans.push({ _type: 'span', _key: generateKey(), marks: [], text: '\n' });
                    } else if (['strong', 'b'].includes(tag)) {
                        traverse(child, [...currentMarks, 'strong']);
                    } else if (['em', 'i'].includes(tag)) {
                        traverse(child, [...currentMarks, 'em']);
                    } else if (tag === 'a') {
                        const href = child.getAttribute('href');
                        const key = generateKey();
                        markDefs.push({
                            _type: 'link',
                            _key: key,
                            href: href
                        });
                        traverse(child, [...currentMarks, key]);
                    } else {
                        traverse(child, currentMarks);
                    }
                }
            });
        }
        traverse(node, []);
        // Merge adjacent spans with same marks? Not strictly required by Sanity but good.
        return { children: spans, markDefs };
    }

    body.childNodes.forEach(node => {
        if (node.nodeType !== 1) return; // Skip non-elements at root for now
        const tag = node.tagName.toLowerCase();

        if (['p', 'div'].includes(tag)) {
            const { children, markDefs } = processBlockChildren(node);
            if (children.length > 0) {
                blocks.push({
                    _type: 'block',
                    _key: generateKey(),
                    style: 'normal',
                    markDefs,
                    children
                });
            }
        } else if (tag.match(/^h[1-6]$/)) {
            const { children, markDefs } = processBlockChildren(node);
            blocks.push({
                _type: 'block',
                _key: generateKey(),
                style: tag, // h1, h2...
                markDefs,
                children
            });
        } else if (tag === 'blockquote') {
            const { children, markDefs } = processBlockChildren(node);
            blocks.push({
                _type: 'block',
                _key: generateKey(),
                style: 'blockquote',
                markDefs,
                children
            });
        } else if (tag === 'ul' || tag === 'ol') {
            const level = 1;
            const listItem = tag === 'ul' ? 'bullet' : 'number';
            node.childNodes.forEach(li => {
                if (li.nodeName.toLowerCase() === 'li') {
                    const { children, markDefs } = processBlockChildren(li);
                    blocks.push({
                        _type: 'block',
                        _key: generateKey(),
                        style: 'normal',
                        listItem,
                        level,
                        markDefs,
                        children
                    });
                }
            });
        } else if (tag === 'img' || (tag === 'figure' && node.querySelector('img'))) {
            const img = tag === 'img' ? node : node.querySelector('img');
            if (img) {
                blocks.push({
                    _type: 'image',
                    _key: generateKey(),
                    _sanityAsset: `image@${img.getAttribute('src')}`,
                    alt: img.getAttribute('alt') || '',
                    caption: node.querySelector('figcaption')?.textContent || ''
                });
            }
        } else {
            // Fallback for unknown blocks, treat as paragraph
            const { children, markDefs } = processBlockChildren(node);
            if (children.length > 0) {
                blocks.push({
                    _type: 'block',
                    _key: generateKey(),
                    style: 'normal',
                    markDefs,
                    children
                });
            }
        }
    });

    return blocks;
}

// --- GraphQL Query ---
const DATA_QUERY = `
  query GetData($first: Int, $after: String) {
    posts(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        databaseId
        title
        slug
        date
        excerpt
        content
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        categories {
          nodes {
            databaseId
            name
            slug
            description
          }
        }
        author {
          node {
            databaseId
            name
            slug
            avatar {
              url
            }
            description
          }
        }
      }
    }
  }
`;

async function fetchGraphQL(query, variables = {}) {
    const res = await fetch(WORDPRESS_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables }),
    });

    if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
    const json = await res.json();
    if (json.errors) throw new Error(JSON.stringify(json.errors, null, 2));
    return json.data;
}

async function main() {
    const ndjson = [];
    let hasNextPage = true;
    let after = null;
    const addedAuthors = new Set();
    const addedCategories = new Set();

    while (hasNextPage) {
        console.log(`Fetching posts after cursor: ${after}`);
        const data = await fetchGraphQL(DATA_QUERY, { first: 50, after });
        const { posts } = data;

        for (const post of posts.nodes) {
            // Transform Body with Custom Parser
            const bodyBlocks = parseHtmlToBlocks(post.content);

            // Check if body is empty and warn
            if (!bodyBlocks || bodyBlocks.length === 0) {
                console.warn(`Warning: Empty body for post "${post.title}"`);
            }

            // Categories
            const categoryRefs = [];
            if (post.categories?.nodes) {
                for (const cat of post.categories.nodes) {
                    const catId = `category-${cat.databaseId}`;
                    if (!addedCategories.has(catId)) {
                        ndjson.push(JSON.stringify({
                            _type: 'category',
                            _id: catId,
                            title: cat.name,
                            slug: { _type: 'slug', current: cat.slug },
                            description: cat.description
                        }));
                        addedCategories.add(catId);
                    }
                    categoryRefs.push({ _type: 'reference', _ref: catId });
                }
            }

            // Author
            let authorRef = undefined;
            if (post.author?.node) {
                const authId = `author-${post.author.node.databaseId}`;
                if (!addedAuthors.has(authId)) {
                    ndjson.push(JSON.stringify({
                        _type: 'author',
                        _id: authId,
                        name: post.author.node.name,
                        slug: { _type: 'slug', current: post.author.node.slug },
                        image: post.author.node.avatar?.url ? {
                            _type: 'image',
                            _sanityAsset: `image@${post.author.node.avatar.url}`
                        } : undefined,
                        bio: parseHtmlToBlocks(post.author.node.description) // Parse bio too
                    }));
                    addedAuthors.add(authId);
                }
                authorRef = { _type: 'reference', _ref: authId };
            }

            // Post
            const doc = {
                _type: 'post',
                _id: `post-${post.databaseId}`,
                title: post.title,
                slug: { _type: 'slug', current: post.slug },
                publishedAt: post.date,
                excerpt: post.excerpt ? post.excerpt.replace(/<[^>]+>/g, '') : '',
                author: authorRef,
                mainImage: post.featuredImage?.node?.sourceUrl ? {
                    _type: 'image',
                    _sanityAsset: `image@${post.featuredImage.node.sourceUrl}`,
                    alt: post.featuredImage.node.altText || post.title
                } : undefined,
                categories: categoryRefs,
                body: bodyBlocks
            };
            ndjson.push(JSON.stringify(doc));
        }

        hasNextPage = posts.pageInfo.hasNextPage;
        after = posts.pageInfo.endCursor;
    }

    fs.writeFileSync('migration.ndjson', ndjson.join('\n'));
    console.log(`Successfully generated migration.ndjson with ${ndjson.length} items.`);
}

main().catch(console.error);
