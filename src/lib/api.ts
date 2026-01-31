const API_URL = process.env.WORDPRESS_API_URL;

async function fetchAPI(query: string, { variables }: { variables?: any } = {}) {
  const headers = { 'Content-Type': 'application/json' };

  if (!API_URL) {
    throw new Error('WORDPRESS_API_URL is not defined in .env.local');
  }

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query,
        variables,
      }),
      next: { revalidate: 60 }, // Cache for 60 seconds
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`API Response Error (${res.status}):`, errorText);
      throw new Error(`API returned status ${res.status}`);
    }

    const json = await res.json();
    if (json.errors) {
      console.error('GraphQL Errors:', JSON.stringify(json.errors, null, 2));
      throw new Error('Failed to fetch API: GraphQL Errors');
    }
    return json.data;
  } catch (error: any) {
    console.error('--- Fetch API Error Details ---');
    console.error('URL:', API_URL);
    console.error('Error Message:', error.message);
    if (error.cause) {
      console.error('Error Cause:', error.cause);
    }
    console.error('--------------------------------');
    
    // Provide a more user-friendly error message for SSL issues
    if (error.message.includes('SSL') || (error.cause && error.cause.message && error.cause.message.includes('SSL'))) {
      throw new Error(`SSL Handshake Failed: Gagal terhubung ke ${API_URL} karena masalah SSL. Pastikan server WordPress Anda mengizinkan koneksi TLS yang kompatibel.`);
    }

    throw new Error(`Failed to fetch API from ${API_URL}. ${error.message}`);
  }
}

export async function getAllPosts() {
  const data = await fetchAPI(
    `
    query AllPosts {
      posts(first: 20, where: { orderby: { field: DATE, order: DESC } }) {
        nodes {
          id
          title
          excerpt
          content
          slug
          date
          featuredImage {
            node {
              sourceUrl
            }
          }
          author {
            node {
              name
            }
          }
        }
      }
    }
  `
  );
  return data?.posts?.nodes;
}

export async function getPostBySlug(slug: string) {
  const data = await fetchAPI(
    `
    query PostBySlug($id: ID!, $idType: PostIdType!) {
      post(id: $id, idType: $idType) {
        id
        databaseId
        title
        excerpt
        content
        date
        commentCount
        comments(first: 100, where: { orderby: COMMENT_DATE, order: ASC }) {
          nodes {
            id
            databaseId
            content
            date
            parentDatabaseId
            author {
              node {
                name
                avatar {
                  url
                }
              }
            }
          }
        }
        featuredImage {
          node {
            sourceUrl
          }
        }
        author {
          node {
            name
          }
        }
      }
    }
  `,
    {
      variables: {
        id: slug,
        idType: 'SLUG',
      },
    }
  );
  return data?.post;
}

export async function createComment(input: {
  content: string;
  author: string;
  authorEmail: string;
  postId: number;
}) {
  const data = await fetchAPI(
    `
    mutation CreateComment($input: CreateCommentInput!) {
      createComment(input: $input) {
        success
        comment {
          id
          content
          author {
            node {
              name
            }
          }
        }
      }
    }
  `,
    {
      variables: {
        input: {
          content: input.content,
          author: input.author,
          authorEmail: input.authorEmail,
          commentOn: input.postId,
        },
      },
    }
  );
  return data?.createComment;
}

export async function getPageBySlug(slug: string) {
  const data = await fetchAPI(
    `
    query PageBySlug($id: ID!, $idType: PageIdType!) {
      page(id: $id, idType: $idType) {
        id
        title
        content
        date
        featuredImage {
          node {
            sourceUrl
          }
        }
      }
    }
  `,
    {
      variables: {
        id: slug,
        idType: 'URI',
      },
    }
  );
  return data?.page;
}

export async function getPostsByCategory(slug: string) {
  const data = await fetchAPI(
    `
    query PostsByCategory($id: ID!, $idType: CategoryIdType!) {
      category(id: $id, idType: $idType) {
        id
        name
        slug
        description
        children(where: { hideEmpty: true }) {
          nodes {
            id
            name
            slug
            count
          }
        }
        posts(first: 20, where: { orderby: { field: DATE, order: DESC } }) {
          nodes {
            id
            title
            excerpt
            slug
            date
            featuredImage {
              node {
                sourceUrl
              }
            }
          }
        }
      }
    }
  `,
    {
      variables: {
        id: slug,
        idType: 'SLUG',
      },
    }
  );
  return data?.category;
}

export async function searchPosts(searchTerm: string) {
  const data = await fetchAPI(
    `
    query SearchPosts($search: String!) {
      posts(first: 20, where: { search: $search }) {
        nodes {
          id
          title
          slug
          date
          excerpt
        }
      }
    }
  `,
    {
      variables: {
        search: searchTerm,
      },
    }
  );
  return data?.posts?.nodes;
}

export async function getAllCategories() {
  const data = await fetchAPI(
    `
    query AllCategories {
      categories(first: 10, where: { hideEmpty: true }) {
        nodes {
          id
          name
          slug
          count
        }
      }
    }
  `
  );
  return data?.categories?.nodes;
}
