
$WEBHOOK_URL = "http://localhost:3000/api/webhooks/comment-notification"
$PAYLOAD = @{
    operation = "create"
    document = @{
        _id = "test-comment-123"
        _type = "comment"
        _createdAt = "2024-02-12T10:00:00Z"
        name = "Pengunjung Test"
        email = "pengunjung@test.com"
        content = "Ini adalah komentar test."
        post = @{ _ref = "some-post-id" }
    }
} | ConvertTo-Json -Depth 10

Write-Host "Sending payload..."
try {
    $response = Invoke-RestMethod -Uri $WEBHOOK_URL -Method POST -ContentType "application/json" -Headers @{"x-sanity-signature" = "test-signature"} -Body $PAYLOAD
    Write-Host "Success:"
    $response
} catch {
    Write-Host "Error:"
    $_.Exception.Message
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $reader.ReadToEnd()
    }
}
