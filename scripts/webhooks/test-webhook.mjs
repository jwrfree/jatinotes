// Test script untuk webhook Sanity - komentar baru (ESM)
// Cara pakai: node scripts/webhooks/test-webhook.mjs

import crypto from 'crypto';

// Konfigurasi
const WEBHOOK_URL = 'http://localhost:3000/api/webhooks/comment-notification';
const WEBHOOK_SECRET = 'sk_comment_webhook_2024_jatinotes_secure';

// Data test komentar baru
const testPayload = {
  operation: 'create',
  document: {
    _id: 'test-comment-123',
    _type: 'comment',
    _createdAt: new Date().toISOString(),
    name: 'Pengunjung Test',
    email: 'pengunjung@test.com',
    content: 'Ini adalah komentar test untuk webhook notifikasi email. Semoga berhasil!',
    post: {
      _ref: 'some-post-id'
    },
    approved: false
  }
};

// Buat signature
const payloadString = JSON.stringify(testPayload);
const signature = crypto
  .createHmac('sha256', WEBHOOK_SECRET)
  .update(payloadString)
  .digest('hex');

// Kirim webhook
async function sendTestWebhook() {
  try {
    console.log('🚀 Mengirim test webhook...');
    console.log('📧 Data komentar:', testPayload);
    
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-sanity-signature': signature
      },
      body: payloadString
    });

    const responseText = await response.text();
    
    if (response.ok) {
      console.log('✅ Webhook berhasil! Status:', response.status);
      console.log('📨 Notifikasi email sedang dikirim...');
      console.log('📋 Response:', responseText);
    } else {
      console.log('❌ Webhook gagal! Status:', response.status);
      console.log('📋 Response:', responseText);
    }
  } catch (error) {
    console.error('💥 Error:', error instanceof Error ? error.message : String(error));
  }
}

// Jalankan test
sendTestWebhook();
