
import { generateCommentEmailTemplate } from './email-templates';

interface CommentNotificationData {
  type: 'new_comment';
  comment: {
    id: string;
    author: string;
    email: string;
    content: string;
    post?: string;
    createdAt: string;
  };
}

/**
 * Send email notification for new comments
 */
export async function sendNotification(data: CommentNotificationData) {
  if (process.env.RESEND_API_KEY) {
    try {
      const { Resend } = await import('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);
      const fromEmail = process.env.FROM_EMAIL || 'notifications@resend.dev';
      const toEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
      
      const htmlContent = generateCommentEmailTemplate(data.comment);
      
      const { data: emailData, error } = await resend.emails.send({
        from: fromEmail,
        to: toEmail,
        subject: `📝 Komentar Baru dari ${data.comment.author} - JatiNotes`,
        html: htmlContent
      });
      
      if (error) {
        console.error('❌ Resend email error:', error);
        return { success: false, error };
      }
      
      console.log('✅ Email notification sent:', emailData?.id);
      return { success: true, id: emailData?.id };
    } catch (error) {
      console.error('❌ Failed to send email notification:', error);
      return { success: false, error };
    }
  } else {
    console.log('⚠️ RESEND_API_KEY not found, skipping email notification');
    return { success: false, error: 'RESEND_API_KEY not found' };
  }
}
