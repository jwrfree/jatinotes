import { getPageBySlug } from "@/lib/api";
import { constructMetadata } from "@/lib/metadata";
import { MotionDiv, staggerContainer } from "@/components/Animations";
import PageHeader from "@/components/PageHeader";
import ContentCard from "@/components/ContentCard";
import BackgroundOrnaments from "@/components/BackgroundOrnaments";
import Tooltip from "@/components/Tooltip";
import CommentSection from "@/components/CommentSection";
import { Metadata } from "next";

export const metadata: Metadata = constructMetadata({
  title: "Meet Jati - Cerita & Perjalanan",
  description: "Kenali lebih jauh tentang Wruhantojati. Tempat berbagi tulisan pribadi, review buku, ulasan teknologi, dan catatan perjalanan.",
  url: "/meet-jati",
});

export default async function MeetJatiPage() {
  const page = await getPageBySlug("meet-jati");

  const displayTitle = page?.title || "Meet Jati";

  return (
    <div className="relative overflow-hidden min-h-screen">
      <BackgroundOrnaments variant="warm" />

      <ContentCard maxWidth="max-w-6xl">
        <MotionDiv
          initial="initial"
          animate="animate"
          variants={staggerContainer}
          className="max-w-3xl mx-auto"
        >
          {/* Header & Title */}
          <div>
            <PageHeader
              title={displayTitle}
              useDecryptedText={true}
              titleClassName="text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-7xl leading-[1.1]"
              className="mb-12"
              topContent={
                <div className="flex items-center gap-3">
                  <span className="h-px w-8 bg-amber-500" />
                  <span className="text-sm font-bold text-amber-500 uppercase tracking-widest">
                    Penulis & Penjelajah
                  </span>
                </div>
              }
              accent={<div className="h-1.5 w-24 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full mb-12" />}
            />

            <div className="prose prose-zinc dark:prose-invert max-w-none prose-lg md:prose-xl">
              <p>Hai, aku Jati.<br />
              Sehari‑hari aku kerja sebagai <Tooltip text="mid‑level product designer" content="Desainer produk digital dengan fokus pada UX & Problem Solving" /> yang ngemix antara ngulik masalah orang, mikirin alur produk, dan berantem manis sama constraint dunia nyata.</p>

              <p>Aku suka jalan pelan, tapi isi kepalaku sering lari kenceng. Menulis di sini adalah cara paling masuk akal yang kutemukan untuk merapikan isi kepala, berhenti sebentar, dan belajar hadir. Kadang berupa cerita receh, kadang berupa pertanyaan yang nggak ketemu jawabannya, kadang cuma pengen bilang “aku masih di sini kok”.</p>

              <hr className="my-12 border-zinc-200 dark:border-zinc-800" />

              <h2 className="text-3xl font-bold mb-6">Kenapa aku nulis</h2>
              <p>Aku dulu cukup akrab dengan rasa stuck dan mati rasa. Kalau disuruh nyebutin kegagalan, aku bisa bikin museum sendiri, mungkin namanya <strong>museum of failure</strong>. Tapi pelan‑pelan aku sadar kalau yang sebenarnya bikin hidup terasa hidup itu bukan hilangnya kegagalan, melainkan kemampuan buat ngerasain semua emosi yang datang.</p>

              <p>Jadi, aku nulis untuk:</p>
              <ul className="list-disc pl-6 space-y-2 mb-12">
                <li>Merapikan apa yang kusimpan terlalu lama di kepala</li>
                <li>Latihan jujur sama diri sendiri, bahkan untuk hal yang nggak nyaman</li>
                <li>Ngingetin bahwa aku pernah lewat di titik ini, dan ternyata aku masih bertahan</li>
              </ul>

              <hr className="my-12 border-zinc-200 dark:border-zinc-800" />

              <h2 className="text-3xl font-bold mb-6">Hal yang lagi kupelajari</h2>
              <p>Belakangan ini aku lagi tertarik sama beberapa hal:</p>
              <ul className="list-disc pl-6 space-y-4 mb-12">
                <li>Pulih dari trauma dan pola lama — Belajar mengenali bagaimana masa lalu main belakang dan nongol di hubungan hari ini, lalu pelan‑pelan memilih respon yang beda.</li>
                <li>Hubungan yang lebih hangat dengan keluarga dan teman — Especially soal berani ngomong kebutuhan sendiri, berdamai dengan luka lama, dan belajar bahwa kedekatan itu bisa dibangun ulang, pelan tapi mungkin.</li>
                <li>Buku, film, dan hal‑hal kecil yang bikin hati lembut — Dari cerita perjalanan kecil sampai buku yang kelihatannya sederhana tapi nusuk pelan.</li>
              </ul>

              <hr className="my-12 border-zinc-200 dark:border-zinc-800" />

              <h2 className="text-3xl font-bold mb-6">Beberapa hal yang lagi sering nongol di hari‑hariku:</h2>
              <ul className="list-disc pl-6 space-y-4 mb-12">
                <li>Lagi suka sepedaan keliling kota pelan‑pelan. Kadang cuma muter deket rumah sambil dengerin suara sekitar, kadang ambil rute yang agak jauh dikit biar badan kerja juga, bukan cuma kepala. Bonusnya: sepedaan rutin bantu nurunin stres dan baik buat jantung.</li>
                <li>Bikin kopi pakai <Tooltip text="mokapot" content="Alat seduh kopi manual klasik dari Italia" />. Ada sesuatu yang menenangkan dari ngeliatin air pelan‑pelan naik, denger suara “mendesis” kecil, dan nunggu momen pas buat nuang ke cangkir. Kecil, tapi jadi ritual pagi yang bikin badan sadar, kepala pelan‑pelan nyala. Kamu tahu cara membuat agar cremanya banyak? Kasih tahu dong resepnya!</li>
                <li>Baca buku dengan target imbang: satu fiksi, satu nonfiksi. Fiksi buat ngelembutin hati dan ngingetin kalau dunia orang lain luas, nonfiksi buat ngasih bahasa dan struktur ke hal‑hal yang tadinya cuma “rasa doang”. Penelitian juga nunjukin baca fiksi bisa ningkatin empati dan well‑being, sementara baca secara umum bantu turunin stres.</li>
                <li>Belajar ngulik <Tooltip text="komponen PC" content="Eksplorasi hardware seperti CPU, GPU, dan airflow management" />: dari spek prosesor, RAM, sampai urusan airflow casing. Sebagian karena penasaran teknis, sebagian lagi karena seru aja ngerakit sesuatu yang nanti dipakai kerja dan main.</li>
                <li>Jangan salah, aku juga suka ngulik pergerakan <Tooltip text="saham US" content="Investasi di pasar modal Amerika (NASDAQ, NYSE)" />. Bukan trader super serius yang tiap detik lihat chart, tapi cukup buat ngerti pola, baca laporan, dan ngetes seberapa sabar aku sama fluktuasi harga. Semacam latihan kecil soal risiko, ekspektasi, dan menerima hal yang di luar kendali.</li>
              </ul>

              <hr className="my-12 border-zinc-200 dark:border-zinc-800" />

              <h2 className="text-3xl font-bold mb-6">Kalau kamu nyasar ke sini</h2>
              <p>Kalau kamu lagi merasa:</p>
              <ul className="list-disc pl-6 space-y-2 mb-12">
                <li>Sedikit bingung dengan arah hidup,</li>
                <li>Sedikit lelah jadi “orang dewasa yang harusnya udah paham semuanya”,</li>
                <li>Atau cuma butuh teman baca yang juga sedang berkelana pelan‑pelan,</li>
              </ul>

              <p>Mungkin kamu bakal nemu sesuatu di sini. Entah itu kalimat yang bikin kamu ngerasa “loh, kok sama ya”, atau sekadar rasa lega karena ternyata kamu nggak sendirian.</p>

              <p>Selamat datang di catatan‑catatan kecilku.<br />
              Kalau suatu saat nanti kita ketemu, online atau offline, semoga kita bisa saling bilang: “oh, ternyata kita sama‑sama masih belajar hidup.”</p>

              <p className="text-xl font-medium text-amber-600 dark:text-amber-500 italic mt-8">
                Terima kasih sudah mampir. Selamat membaca, selamat merasa.
              </p>
            </div>

            {page?.id && (
              <div className="mt-16 border-t border-zinc-200 dark:border-zinc-800 pt-16">
                 <CommentSection 
                   comments={page.comments?.nodes || []}
                   postId={page.id}
                   commentCount={page.commentCount || 0}
                   postAuthorName="Jati"
                 />
              </div>
            )}
          </div>
        </MotionDiv>
      </ContentCard>
    </div>
  );
}
