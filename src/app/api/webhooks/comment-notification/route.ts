
import { NextRequest, NextResponse } from 'next/server'
import { sendNotification } from '@/lib/notifications'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    console.log('📩 Webhook received:', body)

    if (body?.operation === 'create' && body?.document?._type === 'comment') {
      const comment = body.document
      console.log('💬 New comment detected:', { 
        author: comment.name, 
        email: comment.email, 
        content: comment.content 
      })

      await sendNotification({ 
        type: 'new_comment', 
        comment: { 
          id: comment._id, 
          author: comment.name, 
          email: comment.email, 
          content: comment.content, 
          post: comment.post?._ref, 
          createdAt: comment._createdAt 
        } 
      })
    }

    return NextResponse.json({ success: true, message: 'Webhook processed' })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}
