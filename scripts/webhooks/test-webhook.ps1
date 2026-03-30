# Test webhook dengan PowerShell
Write-Host "🚀 Testing webhook with PowerShell..." -ForegroundColor Green

$WEBHOOK_URL = "http://localhost:3000/api/webhooks/comment-notification"
$WEBHOOK_SECRET = "sk_comment_webhook_2024_jatinotes_secure"

# Payload test
$PAYLOAD = @{
    operation = "create"
    document = @{
        _id = "test-comment-123"
        _type = "comment"
        _createdAt = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
        name = "Pengunjung Test"
        email = "pengunjung@test.com"
        content = "Ini adalah komentar test untuk webhook notifikasi email. Semoga berhasil!"
        post = @{ _ref = "some-post-id" }
        approved = $false
    }
} | ConvertTo-Json -Depth 10

Write-Host "📧 Payload: $PAYLOAD" -ForegroundColor Yellow
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri $WEBHOOK_URL -Method POST `
        -ContentType "application/json" `
        -Headers @{"x-sanity-signature" = "test-signature"} `
        -Body $PAYLOAD
    
    Write-Host "✅ Webhook berhasil!" -ForegroundColor Green
    Write-Host "📋 Response: $($response | ConvertTo-Json)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Webhook gagal!" -ForegroundColor Red
    Write-Host "📋 Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $reader.BaseStream.Position = 0
        $reader.DiscardBufferedData()
        $responseBody = $reader.ReadToEnd()
        Write-Host "📋 Response: $responseBody" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "✅ Test selesai!" -ForegroundColor Green