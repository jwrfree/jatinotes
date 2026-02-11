#!/bin/bash

# Test webhook dengan curl - lebih reliable

echo "🚀 Testing webhook with curl..."

WEBHOOK_URL="http://localhost:3000/api/webhooks/comment-notification"
WEBHOOK_SECRET="sk_comment_webhook_2024_jatinotes_secure"

# Payload test
PAYLOAD='{
  "operation": "create",
  "document": {
    "_id": "test-comment-123",
    "_type": "comment",
    "_createdAt": "'$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)'",
    "name": "Pengunjung Test",
    "email": "pengunjung@test.com",
    "content": "Ini adalah komentar test untuk webhook notifikasi email. Semoga berhasil!",
    "post": { "_ref": "some-post-id" },
    "approved": false
  }
}'

echo "📧 Payload: $PAYLOAD"
echo ""

# Kirim dengan curl
curl -X POST $WEBHOOK_URL \
  -H "Content-Type: application/json" \
  -H "x-sanity-signature: test-signature" \
  -d "$PAYLOAD" \
  -v

echo ""
echo "✅ Test selesai!"