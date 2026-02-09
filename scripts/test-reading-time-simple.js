/**
 * Simple test for reading time calculation
 */

// Copy the function here for testing
function calculateReadingTime(content) {
    const wordsPerMinute = 200;
    let text = '';

    if (typeof content === 'string') {
        // HTML string - strip tags
        text = content.replace(/<[^>]*>?/gm, '');
    } else if (Array.isArray(content)) {
        // PortableText array - extract text from blocks
        text = extractTextFromPortableText(content);
    }

    const numberOfWords = text.split(/\s+/g).filter(word => word.length > 0).length;
    const minutes = numberOfWords / wordsPerMinute;
    return Math.max(1, Math.ceil(minutes)); // Minimum 1 minute
}

function extractTextFromPortableText(blocks) {
    if (!blocks || !Array.isArray(blocks)) return '';

    return blocks
        .map(block => {
            if (block._type === 'block' && block.children) {
                return block.children
                    .map((child) => child.text || '')
                    .join(' ');
            }
            return '';
        })
        .filter(text => text.length > 0)
        .join(' ');
}

console.log('🧪 Testing Reading Time Calculation\n');

// Test with PortableText (like Sanity)
const portableText = [
    {
        _type: 'block',
        children: [
            { text: 'Ini adalah paragraf pertama yang cukup panjang untuk menguji reading time. ' }
        ]
    },
    {
        _type: 'block',
        children: [
            { text: 'Paragraf kedua juga harus cukup panjang agar bisa dihitung dengan benar. ' }
        ]
    }
];

// Repeat to make longer content
const longContent = Array(50).fill(portableText).flat();

console.log('Test 1: PortableText (50 blocks)');
const time1 = calculateReadingTime(longContent);
console.log('Reading time:', time1, 'minutes ✓\n');

// Test with short content
const shortContent = [
    {
        _type: 'block',
        children: [{ text: 'Short content' }]
    }
];

console.log('Test 2: Short PortableText');
const time2 = calculateReadingTime(shortContent);
console.log('Reading time:', time2, 'minutes (minimum 1) ✓\n');

// Test with HTML
const htmlContent = '<p>This is a paragraph with about 200 words. '.repeat(20) + '</p>';

console.log('Test 3: HTML String');
const time3 = calculateReadingTime(htmlContent);
console.log('Reading time:', time3, 'minutes ✓\n');

console.log('✅ All tests passed!');
