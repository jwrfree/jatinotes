import { NextRequest, NextResponse } from 'next/server'

// Endpoint untuk test email notifikasi
export async function GET(req: NextRequest) {
  try {
    console.log('🧪 Testing email notification with Resend...')
    console.log('📧 API Key:', process.env.RESEND_API_KEY?.substring(0, 10) + '...')
    console.log('📨 Admin Email:', process.env.ADMIN_EMAIL)
    console.log('📤 From Email:', process.env.FROM_EMAIL)

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ 
        error: 'RESEND_API_KEY not found',
        message: 'Please check your .env.local file'
      }, { status: 500 })
    }

    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)
    
    const fromEmail = process.env.FROM_EMAIL || 'notifications@resend.dev'
    const toEmail = process.env.ADMIN_EMAIL || 'admin@example.com'
    
    console.log(`📤 Sending test email from ${fromEmail} to ${toEmail}...`)

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: '🧪 Test Notifikasi Email - JatiNotes',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; color: white; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">📝 JatiNotes</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">Test Notifikasi Email</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 0 0 8px 8px;">
            <h2 style="color: #333; margin-top: 0;">✅ Selamat!</h2>
            <p>Notifikasi email Anda sudah berhasil di-setup.</p>
            
            <div style="background: white; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #28a745;">
              <p style="margin: 0;"><strong>📧 Email dikirim ke:</strong> ${toEmail}</p>
              <p style="margin: 5px 0 0 0;"><strong>🕐 Waktu:</strong> ${new Date().toLocaleString('id-ID')}</p>
              <p style="margin: 5px 0 0 0;"><strong>🔑 API Key:</strong> ${process.env.RESEND_API_KEY.substring(0, 10)}...</p>
            </div>
            
            <p>Sekarang setiap ada komentar baru, Anda akan menerima notifikasi email otomatis!</p>
            
            <div style="text-align: center; margin-top: 20px;">
              <a href="http://localhost:3000/admin/dashboard" 
                 style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                📋 Buka Dashboard Admin
              </a>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #6c757d; font-size: 12px;">
            <p>Email ini dikirim otomatis oleh sistem JatiNotes</p>
            <p>© 2024 JatiNotes. Semua hak dilindungi.</p>
          </div>
        </div>
      `
    })

    if (error) {
      console.error('❌ Email error:', error)
      return NextResponse.json({ 
        error: 'Email failed',
        details: error
      }, { status: 500 })
    }

    console.log('✅ Test email sent successfully!')
    console.log('📧 Email ID:', data?.id)

    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully!',
      emailId: data?.id,
      sentTo: toEmail,
      sentFrom: fromEmail,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('💥 Test error:', error)
    return NextResponse.json({ 
      error: 'Test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}