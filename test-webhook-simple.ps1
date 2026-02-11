
# Test webhook dengan PowerShell
Write-Host "🚀 Testing webhook dengan PowerShell..." -ForegroundColor Green

$WEBHOOK_URL = "http://localhost:3000/api/webhooks/comment-notification"

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
    $response = Invoke-RestMethod -Uri $WEBHOOK_URL -Method POST -ContentType "application/json" -Headers @{"x-sanity-signature" = "test-signature"} -Body $PAYLOAD
    
    Write-Host "✅ Webhook berhasil!" -ForegroundColor Green
    Write-Host "📋 Response: $($response | ConvertTo-Json)" -ForegroundColor Cyan
}
catch {
    Write-Host "❌ Webhook gagal!" -ForegroundColor Red
    Write-Host "📋 Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        Write-Host "📋 Status Code: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "✅ Test selesai!" -ForegroundColor Green
