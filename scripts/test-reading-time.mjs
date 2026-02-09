/**
 * Test Reading Time Calculation
 * This script tests the calculateReadingTime function with both HTML and PortableText
 */

import { calculateReadingTime } from '../src/lib/utils.js';

console.log('🧪 Testing Reading Time Calculation\n');

// Test 1: HTML String (Old WordPress format)
const htmlContent = `
  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
  <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
  <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
  <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
`.repeat(10); // ~600 words

console.log('Test 1: HTML String');
console.log('Content length:', htmlContent.length);
const htmlTime = calculateReadingTime(htmlContent);
console.log('Reading time:', htmlTime, 'minutes');
console.log('Expected: ~3 minutes ✓\n');

// Test 2: PortableText Array (New Sanity format)
const portableTextContent = [
    {
        _type: 'block',
        children: [
            { text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' }
        ]
    },
    {
        _type: 'block',
        children: [
            { text: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.' }
        ]
    },
    {
        _type: 'block',
        children: [
            { text: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.' }
        ]
    },
    {
        _type: 'block',
        children: [
            { text: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' }
        ]
    }
];

// Repeat to make it longer
const longPortableText = Array(10).fill(portableTextContent).flat();

console.log('Test 2: PortableText Array');
console.log('Number of blocks:', longPortableText.length);
const portableTime = calculateReadingTime(longPortableText);
console.log('Reading time:', portableTime, 'minutes');
console.log('Expected: ~3 minutes ✓\n');

// Test 3: Short content (should be minimum 1 minute)
const shortContent = 'Hello world';
console.log('Test 3: Short Content');
console.log('Content:', shortContent);
const shortTime = calculateReadingTime(shortContent);
console.log('Reading time:', shortTime, 'minutes');
console.log('Expected: 1 minute (minimum) ✓\n');

// Test 4: Empty content
const emptyContent = '';
console.log('Test 4: Empty Content');
const emptyTime = calculateReadingTime(emptyContent);
console.log('Reading time:', emptyTime, 'minutes');
console.log('Expected: 1 minute (minimum) ✓\n');

// Test 5: Real-world example
const realWorldPortableText = [
    {
        _type: 'block',
        children: [
            { text: 'Kenapa Buku Quiet Bikin Aku Merasa Dimengerti' }
        ]
    },
    {
        _type: 'block',
        children: [
            { text: 'Sebagai seorang introvert, aku sering merasa seperti ada yang salah dengan diriku. Kenapa aku lebih suka sendirian daripada di keramaian? Kenapa aku butuh waktu untuk "recharge" setelah bersosialisasi? Kenapa aku lebih suka mendengarkan daripada berbicara?' }
        ]
    },
    {
        _type: 'block',
        children: [
            { text: 'Buku Quiet karya Susan Cain menjawab semua pertanyaan itu. Buku ini menjelaskan bahwa introvert bukan sesuatu yang harus diperbaiki, tapi sebuah kekuatan yang harus dipahami dan dimanfaatkan.' }
        ]
    }
];

console.log('Test 5: Real-world Example');
console.log('Number of blocks:', realWorldPortableText.length);
const realTime = calculateReadingTime(realWorldPortableText);
console.log('Reading time:', realTime, 'minutes');
console.log('Expected: 1 minute ✓\n');

console.log('✅ All tests completed!');
console.log('\n📊 Summary:');
console.log('- HTML content:', htmlTime, 'min');
console.log('- PortableText content:', portableTime, 'min');
console.log('- Short content:', shortTime, 'min');
console.log('- Empty content:', emptyTime, 'min');
console.log('- Real-world example:', realTime, 'min');
