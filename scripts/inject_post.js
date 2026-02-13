const { createClient } = require('@sanity/client');
const { v4: uuidv4 } = require('uuid');

const client = createClient({
    projectId: '0fd6j2sl',
    dataset: 'production',
    useCdn: false,
    apiVersion: '2024-01-01',
    token: 'skXkOr4kLRbYWKul1XUEl1WnCjPiGmy9X79QiTdKYMOuiAsOAxC7uim03UPQbJlQtKGyomiEzQpyQ2BfEfEmEvUtZkuIP0hE1oBQ5d9eKBQ6tOCBrADPWriNbTYH5fuInQF7MNUAf1dHhObD2zGRY0uihoSW9fH6ZZpkqxQGqYtaOCOW7BZ3'
});

const postData = {
    _type: 'post',
    title: 'Kenapa Aku Suka Menunggu Padahal Tahu Itu Nggak Produktif?',
    slug: {
        _type: 'slug',
        current: 'kenapa-aku-suka-menunggu-padahal-tahu-itu-nggak-produktif'
    },
    excerpt: 'Sebuah refleksi jujur tentang kebiasaan menunggu inisiatif, rasa takut terhadap penolakan, dan upaya belajar memberikan self-compassion untuk berani melangkah lebih dulu.',
    publishedAt: new Date().toISOString(),
    author: {
        _type: 'reference',
        _ref: 'author-2' // Wruhantojati
    },
    categories: [
        {
            _key: uuidv4(),
            _type: 'reference',
            _ref: 'category-7' // Blog
        }
    ],
    body: [
        {
            _key: uuidv4(),
            _type: 'block',
            children: [{ _key: uuidv4(), _type: 'span', text: 'Aku ingat dulu sering banget ngecek ponsel setiap 10 menit, nungguin notifikasi chat dari seseorang yang sebenernya juga kupikirin terus. Logikanya konyol: kalau dia memang mikirin aku, pasti dia yang ngechat duluan kan? Jadi aku wait. And wait. Sampai akhirnya hubungan itu memudar bukan karena ada masalah besar, tapi karena keduanya saling nunggu sinyal yang nggak pernah datang.' }],
            markDefs: [],
            style: 'normal'
        },
        {
            _key: uuidv4(),
            _type: 'block',
            children: [{ _key: uuidv4(), _type: 'span', text: 'Baru belakangan aku sadar pola nunggu dipilih ini ternyata jejak dari attachment style yang dulu kupunya. Anxious tapi ekspresinya malah jadi avoidant. Takut ditolak, jadi mending nggak mengemis. Padahal yang kulakukan bukan boundary, tapi surrender. Menyerah pada kemungkinan koneksi cuma gara-gara ego yang rapuh.' }],
            markDefs: [],
            style: 'normal'
        },
        {
            _key: uuidv4(),
            _type: 'block',
            children: [{ _key: uuidv4(), _type: 'span', text: 'Kemarin baca mantra ini dari Jesse:' }],
            markDefs: [],
            style: 'normal'
        },
        {
            _key: uuidv4(),
            _type: 'block',
            children: [{ _key: uuidv4(), _type: 'span', text: 'Be the one who reaches out. Text first. Call first. Plan first. Initiate first. Most people wait to be chosen, be the chooser. Connection requires initiative. Friendship requires effort. Love requires action. Stop waiting to be picked. Initiative is attractive.\n\n— upwithjesse' }],
            markDefs: [],
            style: 'blockquote'
        },
        {
            _key: uuidv4(),
            _type: 'block',
            children: [{ _key: uuidv4(), _type: 'span', text: 'Dan itu ngena karena dia membalik narasi. Kita nggak harus jadi produk yang nunggu dibeli, tapi bisa jadi yang memilih. Initiative bukan tanda keputusasaan, justru tanda keberanian. Orang yang kirim pesan pertama, yang ajak ngopi tanpa ditanya, yang bilang aku kangen duluan, mereka bukan yang lemah. Mereka kuat karena berani tanggung risiko kecil demi sesuatu yang berpotensi besar.' }],
            markDefs: [],
            style: 'normal'
        },
        {
            _key: uuidv4(),
            _type: 'block',
            children: [{ _key: uuidv4(), _type: 'span', text: 'Tapi jujur aku punya pola, aku suka menunggu. Dan tidak keberatan menunggu. Mungkin karena menunggu itu tindakan pasif, aman, tanpa risiko, nggak perlu bear the weight of rejection. Dulu pernah ada yang bilang aku nggak pernah inisiatif duluan. Dan dia bener. Pola chat aku di awal engaged, tanya jawab dua arah. Lama-lama cuma jawab aja, nggak tanya balik. Aku punya keyakinan yang sekarang kubilang excuse bahwa kalau udah cukup kenal ngobrol bisa santai tanpa tanya balik. Kalau dia mau cerita ya cerita aja. Aku akan dengar.' }],
            markDefs: [],
            style: 'normal'
        },
        {
            _key: uuidv4(),
            _type: 'block',
            children: [{ _key: uuidv4(), _type: 'span', text: 'Yang lebih parah, aku sebenernya punya kemampuan notice orang lain. Aku bisa lihat kalau seseorang lagi butuh diajak ngobrol atau lagi nggak baik baik aja. Tapi aku nggak act. Informasi itu cuma tersimpan di kepala, jadi data pasif. Aku tahu tapi diam. Mungkin takut salah baca atau takut dibilang sok care. Tapi ternyata buat orang yang anxious silence itu dibaca sebagai udah nggak tertarik. Beberapa kali malah di read terus ghosting. Dan aku? Aku nggak ngejar. Karena menunggu lebih mudah daripada move.' }],
            markDefs: [],
            style: 'normal'
        },
        {
            _key: uuidv4(),
            _type: 'block',
            children: [{ _key: uuidv4(), _type: 'span', text: 'Sekarang aku lagi belajar jadi orang yang reach out duluan. Masih susah, ada voice di kepala yang bilang kamu ngeganggu atau dia pasti sibuk. Tapi aku coba cari cara biar lebih bertanggung jawab sama apa yang aku notice. Ngomong langsung aja pas di momen itu, nggak nunggu besok atau lusa. Kasih tahu diri sendiri kalau aku punya batasan juga, jadi nggak overwhelm tapi tetap bisa present buat orang lain. Dan yang paling penting, nggak nge-judge diri sendiri kalau ternyata salah baca atau ditolak.' }],
            markDefs: [],
            style: 'normal'
        },
        {
            _key: uuidv4(),
            _type: 'block',
            children: [{ _key: uuidv4(), _type: 'span', text: 'Kadang aku bergumam sendiri, kenapa sih susah banget ngomong duluan. Padahal cuma bilang gimana kabarmu atau aku kangen ngobrolin ini sama kamu. Kenapa harus nunggu sampai momen hilang atau orang itu udah nggak ada.' }],
            markDefs: [],
            style: 'normal'
        },
        {
            _key: uuidv4(),
            _type: 'block',
            children: [
                { _key: uuidv4(), _type: 'span', text: 'Gabor Maté bilang gini: ' },
                { _key: 'link-1', _type: 'span', text: '[goodreads]', marks: ['mark-link-1'] }
            ],
            markDefs: [
                { _key: 'mark-link-1', _type: 'link', href: 'https://www.goodreads.com/author/quotes/4068613.Gabor_Mat_' }
            ],
            style: 'normal'
        },
        {
            _key: uuidv4(),
            _type: 'block',
            children: [{ _key: uuidv4(), _type: 'span', text: 'Being cut off from our own natural self-compassion is one of the greatest impairments we can suffer.' }],
            markDefs: [],
            style: 'blockquote'
        },
        {
            _key: uuidv4(),
            _type: 'block',
            children: [
                { _key: uuidv4(), _type: 'span', text: 'Dan dia juga bilang kalau kamu punya empathy ke diri sendiri, kamu akan punya boundaries. Kalau kamu nggak punya boundaries, berarti kamu nggak punya empathy ke diri sendiri. Ini ngena banget karena selama ini aku pikir aku nggak inisiatif karena nggak peduli. Ternyata aku nggak inisiatif karena takut, dan aku takut karena aku nggak kasih compassion ke diriku sendiri untuk tanggung risiko rejection. ' },
                { _key: 'link-2', _type: 'span', text: '[youtube]', marks: ['mark-link-2'] }
            ],
            markDefs: [
                { _key: 'mark-link-2', _type: 'link', href: 'https://www.youtube.com/watch?v=ZxnMksY9o2M' }
            ],
            style: 'normal'
        },
        {
            _key: uuidv4(),
            _type: 'block',
            children: [{ _key: uuidv4(), _type: 'span', text: 'Kemarin aku coba chat temen lama cuma buat nanya kabar. Ternyata dia lagi butuh orang curhat. Dan dia bilang makasih udah inget aku. Mungkin memang sebagian besar orang juga lagi nunggu ada yang ambil langkah pertama. Mereka juga takut. Bedanya ada yang tetap diam, ada yang akhirnya move. Rejection itu cuma data. Regret yang berat.' }],
            markDefs: [],
            style: 'normal'
        },
        {
            _key: uuidv4(),
            _type: 'block',
            children: [{ _key: uuidv4(), _type: 'span', text: 'Jadi kenapa aku suka menunggu padahal tahu itu nggak produktif? Karena aku takut. Dan karena aku belum belajar kasih compassion ke diriku sendiri untuk berani ambil risiko. Tapi aku lagi belajar sekarang. Pelan pelan.' }],
            markDefs: [],
            style: 'normal'
        }
    ]
};

async function inject() {
    try {
        console.log('Injecting post to Sanity...');
        const result = await client.create(postData);
        console.log('Post injected successfully! ID:', result._id);
    } catch (error) {
        console.error('Failed to inject post:', error);
    }
}

inject();
