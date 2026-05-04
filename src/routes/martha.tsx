import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { Reveal } from "@/components/Reveal";
import marthaImg from "@/assets/martha.jpg";
import mapImg from "@/assets/map.jpg";
import meetingImg from "@/assets/meeting-1817.jpg";
import marthaHorseImg from "@/assets/martha-horse.jpg";
import marthaBattleImg from "@/assets/martha-battle.jpg";

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

type Panel = { t: string; date?: string; d: string; img?: string; alt?: string };

const panels: Panel[] = [
  {
    t: "Masa Kecil di Nusalaut",
    date: "1800 — 1815",
    d: "Martha Christina Tiahahu lahir 4 Januari 1800 di desa Abubu, Pulau Nusalaut. Ibunya wafat saat Martha masih kecil, sehingga ia tumbuh sangat dekat dengan ayahnya, Kapitan Paulus Tiahahu. Sejak kecil ia ikut ayahnya dalam pertemuan adat dan rapat strategi para kapitan. Ia tidak suka memakai pakaian wanita biasa — lebih sering mengenakan pakaian seperti laki-laki dan ikat kepala merah khas pejuang Maluku.",
    img: marthaImg,
    alt: "Potret Martha Christina Tiahahu",
  },
  {
    t: "Tumbuh Bersama Semangat Perlawanan",
    date: "1815 — 1817",
    d: "Sejak remaja, Martha sudah ahli memainkan tombak dan parang. Ia mengikuti kursus perang dari para kapitan tua, menguasai taktik bertahan di medan berbukit, dan memahami pentingnya pela-gandong sebagai kekuatan pemersatu antarkampung di Maluku.",
  },
  {
    t: "Awal Perjuangan",
    date: "Mei 1817",
    d: "Ketika perlawanan rakyat Saparua meletus Mei 1817, Martha yang baru berusia 17 tahun langsung bergabung dengan pasukan Pattimura. Ia ikut menyebarkan kabar penyerbuan ke seluruh Nusalaut, dan menjadi salah satu sosok perempuan pertama yang berdiri di garis depan pertempuran melawan tentara kolonial.",
    img: meetingImg,
    alt: "Pertemuan rahasia para kapitan Maluku 1817",
  },
  {
    t: "Martha Bertempur",
    date: "Agustus 1817",
    d: "Martha memimpin perempuan-perempuan Nusalaut mengangkut amunisi, batu panas, dan air mendidih ke atas benteng. Tak hanya itu, ia juga ikut menyerbu benteng Belanda di Beverwijk dengan tombak di tangan. Keberaniannya membuat pasukan Belanda terpaksa mengakui bahwa ada 'gadis pemberontak' yang sebanding dengan para kapitan dewasa.",
    img: marthaBattleImg,
    alt: "Martha memimpin pertempuran di Nusalaut",
  },
  {
    t: "Tertangkap Bersama Sang Ayah",
    date: "Oktober 1817",
    d: "Setelah perlawanan mulai melemah karena bantuan Belanda yang besar dari Ambon dan Jawa, ayahnya, Kapitan Paulus Tiahahu, ditangkap dan dijatuhi hukuman mati di benteng Beverwijk pada Oktober 1817. Martha menyaksikan eksekusi sang ayah dengan tegar — kemudian ia sendiri ditangkap bersama 39 pejuang lain.",
  },
  {
    t: "Penangkapan",
    date: "Desember 1817",
    d: "Karena masih di bawah umur, Martha tidak dijatuhi hukuman mati. Sebagai gantinya, ia akan dibuang ke Pulau Jawa dan dipekerjakan paksa di perkebunan kopi milik Belanda. Ia dinaikkan ke kapal perang Eversten bersama tahanan-tahanan lain pada penghujung Desember 1817.",
  },
  {
    t: "Mogok Makan & Wafat",
    date: "2 Januari 1818",
    d: "Di atas kapal Eversten, Martha menolak makan, menolak obat, dan menolak semua bentuk kerjasama dengan Belanda. Tubuhnya semakin lemah, namun semangatnya tak pernah pudar. Pada 2 Januari 1818, dua hari sebelum ulang tahunnya yang ke-18, Martha wafat di Laut Banda. Jenazahnya dilarung ke laut dengan upacara militer — laut Banda menjadi makam abadinya.",
  },
  {
    t: "Warisan & Pengakuan",
    date: "1969 — Kini",
    d: "Pemerintah Indonesia menganugerahkan gelar Pahlawan Nasional kepada Martha Christina Tiahahu pada 20 Mei 1969. Tanggal kematiannya, 2 Januari, diperingati sebagai Hari Martha Christina Tiahahu di Maluku. Patungnya berdiri tegak di Karang Panjang, Ambon — sosok gadis muda mengangkat tombak, menatap ke arah Laut Banda.",
  },
];

function GoldStar({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <defs>
        <radialGradient id="gs2" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="oklch(0.92 0.12 80)" />
          <stop offset="55%" stopColor="oklch(0.78 0.14 75)" />
          <stop offset="100%" stopColor="oklch(0.45 0.12 55)" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="28" fill="oklch(0.22 0.05 40)" stroke="url(#gs2)" strokeWidth="1.5" />
      <path
        d="M32 10l5.6 13.6L52 25l-10.5 9.6L44.6 49 32 41.6 19.4 49l3.1-14.4L12 25l14.4-1.4z"
        fill="url(#gs2)"
        stroke="oklch(0.35 0.1 55)"
        strokeWidth="0.6"
      />
    </svg>
  );
}

function MarthaPage() {
  return (
    <div className="min-h-screen bg-historical text-foreground">
      <SiteHeader />

      {/* HERO — central horse painting */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `url(${mapImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-maroon-deep/85 via-background/85 to-background" />
        <div className="relative max-w-6xl mx-auto px-6 pt-12 pb-16 text-center">
          <Reveal>
            <div className="flex justify-center mb-4">
              <GoldStar className="w-16 h-16 drop-shadow-[0_0_30px_oklch(0.78_0.14_75/0.6)]" />
            </div>
            <p className="text-gold tracking-[0.5em] text-[11px] mb-4">— SRIKANDI NUSALAUT —</p>
            <h1 className="font-serif-display text-4xl sm:text-6xl gold-text-glow leading-tight">
              Jejak Langkah Srikandi Nusalaut
            </h1>
            <p className="font-serif-display text-2xl sm:text-3xl text-beige/90 mt-3">
              Martha Christina Tiahahu
            </p>
            <div className="gold-divider w-56 mx-auto mt-6" />
          </Reveal>

          {/* central pop-out painting */}
          <Reveal delay={150}>
            <div className="mt-10 relative max-w-md mx-auto">
              <div className="absolute -inset-6 bg-gradient-gold blur-3xl opacity-25" />
              <div className="parchment-panel p-3">
                <img
                  src={marthaHorseImg}
                  alt="Martha Christina Tiahahu menunggang kuda dengan tombak"
                  className="w-full rounded-md sepia-[0.1]"
                  width={900}
                  height={1100}
                />
              </div>
              <p className="mt-4 text-gold/90 tracking-[0.3em] text-[10px]">
                — ADULT MARTHA CHRISTINA TIAHAHU —
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FACTS */}
      <section className="py-14 px-6">
        <div className="max-w-5xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {facts.map((f, i) => (
            <Reveal key={f.label} delay={i * 80}>
              <div className="parchment-panel p-5 hover:translate-y-[-2px] transition-transform">
                <p className="text-gold/90 text-[10px] tracking-[0.3em]">{f.label.toUpperCase()}</p>
                <p className="text-beige font-serif-display text-lg mt-1">{f.value}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* TIMELINE PANELS */}
      <section className="py-16 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="flex justify-center mb-4">
              <GoldStar className="w-14 h-14 drop-shadow-[0_0_20px_oklch(0.78_0.14_75/0.5)]" />
            </div>
            <p className="text-gold tracking-[0.45em] text-[10px] sm:text-xs mb-3">— PERJALANAN HIDUP —</p>
            <h2 className="font-serif-display text-4xl sm:text-5xl gold-text-glow">
              Gadis Pemberani dari Nusalaut
            </h2>
            <div className="gold-divider w-40 mx-auto mt-6" />
          </div>

          <div className="relative">
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px timeline-rail -translate-x-1/2" />
            <div className="space-y-10 md:space-y-16">
              {panels.map((p, i) => {
                const flip = i % 2 === 1;
                return (
                  <Reveal key={p.t} direction={flip ? "right" : "left"} delay={i * 60}>
                    <article
                      className={`md:grid md:grid-cols-2 md:gap-10 items-center ${
                        flip ? "md:[&>*:first-child]:order-2" : ""
                      }`}
                    >
                      {p.img ? (
                        <div className="parchment-panel p-3 mb-5 md:mb-0">
                          <img
                            src={p.img}
                            alt={p.alt ?? p.t}
                            loading="lazy"
                            className="w-full h-64 object-cover rounded-md sepia-[0.15] contrast-[1.05]"
                          />
                        </div>
                      ) : (
                        <div className="hidden md:flex items-center justify-center">
                          <div className="w-32 h-32 rounded-full border border-gold/40 flex items-center justify-center">
                            <GoldStar className="w-16 h-16 opacity-80" />
                          </div>
                        </div>
                      )}
                      <div className="parchment-panel p-7 relative">
                        <span className="absolute -top-2 -left-2 w-3 h-3 border-t border-l border-gold/70" />
                        <span className="absolute -top-2 -right-2 w-3 h-3 border-t border-r border-gold/70" />
                        <span className="absolute -bottom-2 -left-2 w-3 h-3 border-b border-l border-gold/70" />
                        <span className="absolute -bottom-2 -right-2 w-3 h-3 border-b border-r border-gold/70" />
                        {p.date && (
                          <p className="text-gold/90 text-[10px] tracking-[0.4em] mb-1">{p.date}</p>
                        )}
                        <h3 className="font-serif-display text-2xl gold-text-glow">{p.t}</h3>
                        <div className="gold-divider w-20 my-4" />
                        <p className="text-beige/85 leading-relaxed text-[15px]">{p.d}</p>
                      </div>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-maroon-deep/60 border-y border-gold/30 relative">
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: `url(${mapImg})`, backgroundSize: "cover" }}
        />
        <Reveal>
          <blockquote className="relative max-w-3xl mx-auto text-center">
            <GoldStar className="w-10 h-10 mx-auto mb-5 opacity-90" />
            <p className="font-serif-display text-2xl sm:text-3xl gold-text-glow italic leading-relaxed">
              “Lebih baik mati di laut daripada tunduk pada penjajah.”
            </p>
            <footer className="mt-5 text-beige/80 tracking-[0.4em] text-xs">— SEMANGAT MARTHA</footer>
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

      <footer className="py-10 border-t border-gold/20 text-center text-muted-foreground text-sm">
        © {new Date().getFullYear()} Pahlawan Maluku
      </footer>
    </div>
  );
}