import { Post } from "./types";

/**
 * Mendapatkan judul buku yang bersih
 * Prioritas: bookTitle field > mapping > clean title dari post title
 */
export function getBookTitle(post: Post): string {
    // 1. Gunakan bookTitle field dari Sanity jika ada
    if (post.bookTitle) return post.bookTitle;

    // 2. Fallback ke mapping lama (untuk backward compatibility dengan post lama)
    const bookTitles: Record<string, string> = {
        "kenapa-buku-quiet-bikin-aku-merasa-dimengerti": "Quiet",
        "why-we-sleep": "Why We Sleep",
        "sapiens-riwayat-singkat-umat-manusia": "Sapiens",
        "review-buku-filosofi-teras-panduan-praktis-hidup-tenang-gen-z-milenial": "Filosofi Teras",
        "review-buku-the-danish-way-of-parenting": "The Danish Way of Parenting",
        "rich-dad-poor-dad-cara-mengelola-uang-yang-diajarkan-orang-kaya-ulasan-lengkap-buku-robert-kiyosaki": "Rich Dad Poor Dad",
        "strawberry-generation-generasi-rapuh-atau-adaptif": "Strawberry Generation",
        "atomic-habits-james-clear": "Atomic Habits",
        "mantappu-jiwa": "Mantappu Jiwa",
        "filosofi-teras": "Filosofi Teras",
        "atomic-habits": "Atomic Habits",
        "ikigai": "Ikigai",
        "sapiens": "Sapiens",
        "the-psychology-of-money": "The Psychology of Money",
        "the-art-of-thinking-clearly": "The Art of Thinking Clearly",
        "man-search-for-meaning": "Man's Search for Meaning",
        "show-your-work": "Show Your Work!",
        "steal-like-an-artist": "Steal Like an Artist",
        "keep-going": "Keep Going",
        "deep-work": "Deep Work",
        "digital-minimalism": "Digital Minimalism",
        "the-alchemist": "The Alchemist",
        "dune": "Dune",
        "so-good-they-cant-ignore-you": "So Good They Can't Ignore You",
        "grit": "Grit",
        "ego-is-the-enemy": "Ego is the Enemy",
        "the-daily-stoic": "The Daily Stoic",
        "stillness-is-the-key": "Stillness is the Key",
        "the-subtle-art-of-not-giving-a-fck": "The Subtle Art of Not Giving a F*ck",
        "everything-is-fcked": "Everything is F*cked",
        "start-with-why": "Start with Why",
        "leaders-eat-last": "Leaders Eat Last",
        "think-again": "Think Again",
        "zero-to-one": "Zero to One",
        "the-lean-startup": "The Lean Startup",
        "good-to-great": "Good to Great",
        "filosofi-teras-henry-manampiring": "Filosofi Teras",
    };

    if (bookTitles[post.slug]) return bookTitles[post.slug];

    // 3. Clean title dari post title (regex magic)
    return post.title
        .replace(/Review Buku\s*:/i, '')
        .replace(/Review Buku\s*/i, '')
        .replace(/Review\s*:/i, '')
        .replace(/Buku\s*:/i, '')
        .replace(/^Kenapa Buku\s+/i, '')
        .replace(/\s+Bikin Aku.*$/i, '')
        .trim();
}

/**
 * Mendapatkan nama pengarang buku
 * Prioritas: bookAuthor field > mapping > tags > placeholder
 */
export function getBookAuthor(post: Post): string {
    // 1. Gunakan bookAuthor field dari Sanity jika ada
    if (post.bookAuthor) return post.bookAuthor;

    // 2. Fallback ke mapping lama
    const bookAuthors: Record<string, string> = {
        "kenapa-buku-quiet-bikin-aku-merasa-dimengerti": "Susan Cain",
        "why-we-sleep": "Matthew Walker",
        "sapiens-riwayat-singkat-umat-manusia": "Yuval Noah Harari",
        "review-buku-filosofi-teras-panduan-praktis-hidup-tenang-gen-z-milenial": "Henry Manampiring",
        "review-buku-the-danish-way-of-parenting": "Jessica Joelle Alexander & Iben Sandahl",
        "rich-dad-poor-dad-cara-mengelola-uang-yang-diajarkan-orang-kaya-ulasan-lengkap-buku-robert-kiyosaki": "Robert Kiyosaki",
        "strawberry-generation-generasi-rapuh-atau-adaptif": "Rhenald Kasali",
        "atomic-habits-james-clear": "James Clear",
        "mantappu-jiwa": "Jerome Polin",
        "filosofi-teras": "Henry Manampiring",
        "atomic-habits": "James Clear",
        "ikigai": "Héctor García & Francesc Miralles",
        "sapiens": "Yuval Noah Harari",
        "the-psychology-of-money": "Morgan Housel",
        "the-art-of-thinking-clearly": "Rolf Dobelli",
        "man-search-for-meaning": "Viktor E. Frankl",
        "show-your-work": "Austin Kleon",
        "steal-like-an-artist": "Austin Kleon",
        "keep-going": "Austin Kleon",
        "deep-work": "Cal Newport",
        "digital-minimalism": "Cal Newport",
        "the-alchemist": "Paulo Coelho",
        "dune": "Frank Herbert",
        "so-good-they-cant-ignore-you": "Cal Newport",
        "grit": "Angela Duckworth",
        "ego-is-the-enemy": "Ryan Holiday",
        "the-daily-stoic": "Ryan Holiday",
        "stillness-is-the-key": "Stillness is the Key",
        "the-subtle-art-of-not-giving-a-fck": "Mark Manson",
        "everything-is-fcked": "Mark Manson",
        "start-with-why": "Simon Sinek",
        "leaders-eat-last": "Simon Sinek",
        "think-again": "Adam Grant",
        "zero-to-one": "Peter Thiel",
        "the-lean-startup": "Eric Ries",
        "good-to-great": "Jim Collins",
        "filosofi-teras-henry-manampiring": "Henry Manampiring",
    };

    if (bookAuthors[post.slug]) return bookAuthors[post.slug];

    // 3. Fallback ke tags atau default text
    return post.tags?.nodes.length ? post.tags.nodes[0].name : '';
}
