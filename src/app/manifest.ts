import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Jati Notes',
    short_name: 'JatiNotes',
    description: 'Catatan digital Wruhantojati tentang buku, desain, dan perjalanan merapikan isi kepala.',
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
