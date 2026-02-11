import { Suspense } from 'react'
import { client } from '@/sanity/lib/client'
import { COMMENTS_QUERY } from '@/sanity/lib/queries'
import Link from 'next/link'

// Metadata untuk SEO
export const metadata = {
  title: 'Dashboard Admin - Komentar',
  robots: 'noindex, nofollow', // Jangan index halaman admin
}

async function CommentsList() {
  const comments = await client.fetch(COMMENTS_QUERY)

  if (!comments.length) {
    return (
      <div className="text-center py-8 text-zinc-500">
        Belum ada komentar
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {comments.map((comment: any) => (
        <div key={comment._id} className="bg-white/50 dark:bg-zinc-800/50 rounded-lg p-4 border border-zinc-200 dark:border-zinc-700">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                {comment.name}
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {comment.email}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {new Date(comment._createdAt).toLocaleString('id-ID')}
              </p>
              {comment.post && (
                <Link 
                  href={`/blog/${comment.post.slug?.current}`}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                  target="_blank"
                >
                  Lihat Post →
                </Link>
              )}
            </div>
          </div>
          <p className="text-zinc-700 dark:text-zinc-300 mb-3">
            {comment.content}
          </p>
          <div className="flex gap-2">
            <Link
              href={`https://jatinotes.com/studio/desk/comment;${comment._id}`}
              className="text-xs bg-zinc-100 dark:bg-zinc-700 px-2 py-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-600 transition-colors"
              target="_blank"
            >
              Buka di Studio
            </Link>
            {comment.status === 'pending' && (
              <span className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded">
                Menunggu Moderasi
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
            Dashboard Admin
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Kelola komentar dan monitor aktivitas website
          </p>
        </div>

        <div className="bg-white/60 dark:bg-zinc-800/60 backdrop-blur-sm rounded-xl border border-zinc-200 dark:border-zinc-700 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              Komentar Terbaru
            </h2>
            <div className="flex gap-2">
              <Link
                href="/studio"
                className="text-sm bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                target="_blank"
              >
                Buka Studio
              </Link>
              <Link
                href="/admin/dashboard"
                className="text-sm bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 px-3 py-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-600 transition-colors"
              >
                Refresh
              </Link>
            </div>
          </div>

          <Suspense fallback={
            <div className="text-center py-8">
              <div className="animate-pulse space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-zinc-100 dark:bg-zinc-800 rounded-lg p-4 h-24"></div>
                ))}
              </div>
            </div>
          }>
            <CommentsList />
          </Suspense>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <QuickLinkCard
            title="📊 Statistik"
            description="Lihat statistik website di Sanity Studio"
            href="/studio/desk"
          />
          <QuickLinkCard
            title="📝 Postingan"
            description="Kelola postingan blog"
            href="/studio/desk/post"
          />
        </div>
      </div>
    </div>
  )
}

function QuickLinkCard({ title, description, href }: { title: string; description: string; href: string }) {
  return (
    <Link href={href} target="_blank" className="block">
      <div className="bg-white/60 dark:bg-zinc-800/60 backdrop-blur-sm rounded-xl border border-zinc-200 dark:border-zinc-700 p-4 hover:bg-white/80 dark:hover:bg-zinc-800/80 transition-colors">
        <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">{title}</h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">{description}</p>
      </div>
    </Link>
  )
}