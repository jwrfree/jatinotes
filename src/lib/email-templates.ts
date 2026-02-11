
/**
 * Generate email HTML template for new comment notifications
 */
export function generateCommentEmailTemplate(comment: {
  id: string
  author: string
  email: string
  content: string
  post?: string
  createdAt: string
}) {
  const postTitle = comment.post || 'Tidak diketahui'
  const formattedDate = new Date(comment.createdAt).toLocaleString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  // Get initials for avatar fallback
  const initials = comment.author
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Komentar Baru</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        
        body {
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background-color: #f9fafb; /* zinc-50 */
          color: #18181b; /* zinc-900 */
          margin: 0;
          padding: 40px 20px;
          -webkit-font-smoothing: antialiased;
        }
        
        .container {
          max-width: 480px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid #e4e4e7; /* zinc-200 */
          overflow: hidden;
        }
        
        .header {
          padding: 32px 32px 24px;
          border-bottom: 1px solid #f4f4f5;
        }
        
        .brand {
          font-size: 13px;
          font-weight: 600;
          color: #d97706; /* amber-600 */
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 8px;
          display: block;
        }
        
        h1 {
          font-size: 24px;
          font-weight: 700;
          margin: 0;
          color: #18181b;
          line-height: 1.2;
        }

        .content {
          padding: 32px;
        }
        
        .author-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }
        
        .avatar {
          width: 40px;
          height: 40px;
          background-color: #fef3c7; /* amber-100 */
          color: #d97706; /* amber-600 */
          border-radius: 999px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 14px;
        }
        
        .author-meta {
          display: flex;
          flex-direction: column;
        }
        
        .author-name {
          font-weight: 600;
          font-size: 15px;
          color: #18181b;
        }
        
        .comment-date {
          font-size: 13px;
          color: #71717a; /* zinc-500 */
        }
        
        .comment-text {
          font-size: 16px;
          line-height: 1.6;
          color: #3f3f46; /* zinc-700 */
          margin-bottom: 24px;
        }
        
        .post-ref {
          font-size: 13px;
          color: #71717a;
          padding-top: 24px;
          border-top: 1px solid #f4f4f5;
          margin-bottom: 32px;
        }
        
        .post-link {
          color: #18181b;
          font-weight: 500;
          text-decoration: none;
        }
        
        .btn {
          display: block;
          width: 100%;
          text-align: center;
          background-color: #18181b; /* zinc-900 */
          color: #ffffff;
          font-weight: 500;
          font-size: 14px;
          padding: 14px;
          border-radius: 10px;
          text-decoration: none;
          transition: background-color 0.2s;
        }
        
        .btn:hover {
          background-color: #27272a;
        }
        
        .secondary-actions {
          margin-top: 16px;
          text-align: center;
        }
        
        .link-subtle {
          font-size: 13px;
          color: #71717a;
          text-decoration: none;
        }
        
        .link-subtle:hover {
          color: #18181b;
          text-decoration: underline;
        }
        
        .footer {
          text-align: center;
          padding: 24px;
          font-size: 12px;
          color: #a1a1aa;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <span class="brand">JatiNotes</span>
          <h1>Komentar Baru</h1>
        </div>
        
        <div class="content">
          <div class="author-row">
            <div class="avatar">${initials}</div>
            <div class="author-meta">
              <span class="author-name">${comment.author}</span>
              <span class="comment-date">${formattedDate}</span>
            </div>
          </div>
          
          <div class="comment-text">
            "${comment.content}"
          </div>
          
          <div class="post-ref">
            Mengomentari postingan <br>
            <span class="post-link">${postTitle}</span>
          </div>
          
          <a href="https://jatinotes.com/admin/dashboard" class="btn">
            Review Komentar
          </a>
          
          <div class="secondary-actions">
            <a href="https://jatinotes.com/studio/desk/comment;${comment.id}" class="link-subtle">
              Buka di Sanity Studio &rarr;
            </a>
          </div>
        </div>
      </div>
      
      <div class="footer">
        Email notifikasi untuk ${comment.email}
      </div>
    </body>
    </html>
  `
}
