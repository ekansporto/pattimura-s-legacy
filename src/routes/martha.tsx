import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { Reveal } from "@/components/Reveal";
import marthaImg from "@/assets/martha.jpg";
import mapImg from "@/assets/map.jpg";

export const Route = createFileRoute("/martha")({
  head: () => ({
    meta: [
      { title: "Martha Christina Tiahahu — Srikandi Maluku" },
      {
        name: "description",
        content:
          "Biografi Martha Christina Tiahahu, pejuang perempuan muda dari Nusalaut yang gugur dalam usia 18 tahun melawan kolonial Belanda.",
      },
      { property: "og:title", content: "Martha Christina Tiahahu" },
      { property: "og:description", content: "Srikandi Maluku, pejuang perempuan termuda 1817." },
      { property: "og:image", content: marthaImg },
      { name: "twitter:image", content: marthaImg },
    ],
  }),
  component: MarthaPage,
});

const facts = [
  { label: "Nama Lengkap", value: "Martha Christina Tiahahu" },
  { label: "Lahir", value: "4 Januari 1800, Nusalaut" },
  { label: "Wafat", value: "2 Januari 1818, Laut Banda" },
  { label: "Usia Wafat", value: "18 tahun" },
  { label: "Ayah", value: "Kapitan Paulus Tiahahu" },
  { label: "Gelar", value: "Pahlawan Nasional (1969)" },
];

const events = [
  {
    t: "Masa Kecil di Nusalaut",
    d: "Martha Christina Tiahahu lahir 4 Januari 1800 di desa Abubu, Pulau Nusalaut. Ibunya wafat saat Martha masih kecil, sehingga ia tumbuh sangat dekat dengan ayahnya, Kapitan Paulus Tiahahu. Sejak kecil ia ikut ayahnya dalam pertemuan adat dan rapat strategi para kapitan. Ia tidak suka memakai pakaian wanita biasa — lebih sering mengenakan pakaian seperti laki-laki dan ikat kepala merah khas pejuang Maluku.",
  },
  {
    t: "Tumbuh Bersama Semangat Perlawanan",
    d: "Sejak remaja, Martha sudah ahli memainkan tombak dan parang. Ia mengikuti kursus perang dari para kapitan tua, menguasai taktik bertahan di medan berbukit, dan memahami pentingnya pela-gandong sebagai kekuatan pemersatu antarkampung di Maluku.",
  },
  {
    t: "Bergabung dengan Pattimura",
    d: "Ketika perlawanan rakyat Saparua meletus Mei 1817, Martha yang baru berusia 17 tahun langsung bergabung dengan pasukan Pattimura. Ia ikut menyebarkan kabar penyerbuan ke seluruh Nusalaut, dan menjadi salah satu sosok perempuan pertama yang berdiri di garis depan pertempuran melawan tentara kolonial.",
  },
  {
    t: "Pertempuran di Nusalaut",
    d: "Martha memimpin perempuan-perempuan Nusalaut mengangkut amunisi, batu panas, dan air mendidih ke atas benteng. Tak hanya itu, ia juga ikut menyerbu benteng Belanda di Beverwijk dengan tombak di tangan. Keberaniannya membuat pasukan Belanda terpaksa mengakui bahwa ada 'gadis pemberontak' yang sebanding dengan para kapitan dewasa.",
  },
  {
    t: "Tertangkap Bersama Sang Ayah",
    d: "Setelah perlawanan mulai melemah karena bantuan Belanda yang besar dari Ambon dan Jawa, ayahnya, Kapitan Paulus Tiahahu, ditangkap dan dijatuhi hukuman mati di benteng Beverwijk pada Oktober 1817. Martha menyaksikan eksekusi sang ayah dengan tegar — kemudian ia sendiri ditangkap bersama 39 pejuang lain.",
  },
  {
    t: "Penangkapan",
    d: "Karena masih di bawah umur, Martha tidak dijatuhi hukuman mati. Sebagai gantinya, ia akan dibuang ke Pulau Jawa dan dipekerjakan paksa di perkebunan kopi milik Belanda. Ia dinaikkan ke kapal perang Eversten bersama tahanan-tahanan lain pada penghujung Desember 1817.",
  },
  {
    t: "Mogok Makan & Wafat",
    d: "Di atas kapal Eversten, Martha menolak makan, menolak obat, dan menolak semua bentuk kerjasama dengan Belanda. Tubuhnya semakin lemah, namun semangatnya tak pernah pudar. Pada 2 Januari 1818, dua hari sebelum ulang tahunnya yang ke-18, Martha wafat di Laut Banda. Jenazahnya dilarung ke laut dengan upacara militer — laut Banda menjadi makam abadinya.",
  },
  {
    t: "Warisan & Pengakuan",
    d: "Pemerintah Indonesia menganugerahkan gelar Pahlawan Nasional kepada Martha Christina Tiahahu pada 20 Mei 1969. Tanggal kematiannya, 2 Januari, diperingati sebagai Hari Martha Christina Tiahahu di Maluku. Patungnya berdiri tegak di Karang Panjang, Ambon — sosok gadis muda mengangkat tombak, menatap ke arah Laut Banda.",
  },
];

function MarthaPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage: `url(${mapImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-maroon-deep/80 via-background/90 to-background" />
        <div className="relative max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-[260px_1fr] gap-10 items-center">
          <Reveal direction="left">
            <div className="relative w-60 h-60 mx-auto">
              <div className="absolute inset-0 rounded-full bg-gradient-gold blur-2xl opacity-50" />
              <img
                src={marthaImg}
                alt="Martha Christina Tiahahu"
                className="relative w-60 h-60 rounded-full object-cover border-4 border-gold/80 shadow-classic"
              />
            </div>
          </Reveal>
          <Reveal direction="right">
            <div>
              <p className="text-gold tracking-[0.3em] text-xs mb-3">— SRIKANDI MALUKU —</p>
              <h1 className="font-serif-display text-5xl sm:text-6xl text-beige leading-tight">
                Martha <span className="text-gold">Christina</span> Tiahahu
              </h1>
              <p className="mt-4 text-beige/80 text-lg leading-relaxed max-w-xl">
                Pejuang perempuan termuda dalam sejarah perlawanan Maluku. Gugur di laut Banda pada usia 18 tahun, jadi simbol keberanian tanpa batas usia.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {facts.map((f, i) => (
            <Reveal key={f.label} delay={i * 80}>
              <div className="bg-card border border-border rounded-2xl p-5 hover:border-gold/50 transition-colors">
                <p className="text-gold text-xs tracking-widest">{f.label.toUpperCase()}</p>
                <p className="text-beige font-serif-display text-lg mt-1">{f.value}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="py-16 px-6 bg-brown-deep/40">
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <div className="text-center mb-12">
              <p className="text-gold tracking-[0.3em] text-xs mb-3">— PERJALANAN HIDUP —</p>
              <h2 className="font-serif-display text-4xl text-beige">Gadis Pemberani dari Nusalaut</h2>
            </div>
          </Reveal>

          <div className="space-y-6">
            {events.map((e, i) => (
              <Reveal key={i} delay={i * 100}>
                <article className="bg-card border-l-4 border-gold rounded-r-2xl p-6 shadow-classic hover:translate-x-1 transition-transform">
                  <h3 className="font-serif-display text-xl text-beige">{e.t}</h3>
                  <p className="mt-2 text-beige/80 leading-relaxed">{e.d}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-maroon-deep border-y border-border">
        <Reveal>
          <blockquote className="max-w-3xl mx-auto text-center">
            <p className="font-serif-display text-2xl sm:text-3xl text-beige italic leading-relaxed">
              “Lebih baik mati di laut daripada tunduk pada penjajah.”
            </p>
            <footer className="mt-5 text-gold tracking-widest text-xs">— SEMANGAT MARTHA</footer>
          </blockquote>
        </Reveal>
      </section>

      <section className="py-16 px-6 text-center">
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link
            to="/pattimura"
            className="px-7 py-3 rounded-full border border-gold/60 text-gold font-medium hover:bg-gold/10 transition-colors"
          >
            ← Kenal Pattimura
          </Link>
          <Link
            to="/kuis"
            className="px-7 py-3 rounded-full bg-gradient-maroon text-beige font-medium shadow-glow hover:scale-105 transition-transform"
          >
            ⚔ Mulai Pertempuran
          </Link>
        </div>
      </section>

      <footer className="py-10 border-t border-border text-center text-muted-foreground text-sm">
        © {new Date().getFullYear()} Pahlawan Maluku
      </footer>
    </div>
  );
}