import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Jati Notes',
    short_name: 'JatiNotes',
    description: 'Blog modern menggunakan Next.js dan Headless WordPress',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#d2490a',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  }
}
