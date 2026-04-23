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
    d: "Lahir di desa Abubu, Pulau Nusalaut. Sejak kecil ia ikut ayahnya, Kapitan Paulus Tiahahu, dalam berbagai pertemuan adat dan rapat-rapat strategi.",
  },
  {
    t: "Bergabung dengan Pattimura",
    d: "Saat berusia 17 tahun, Martha bergabung dengan pasukan Pattimura. Ia memakai ikat kepala merah, membawa tombak, dan ikut bertempur layaknya pejuang dewasa.",
  },
  {
    t: "Pertempuran di Nusalaut",
    d: "Memimpin perempuan-perempuan Nusalaut untuk membantu pasukan dengan mengangkut amunisi, batu, dan air panas. Ia juga ikut maju di garis depan menyerang benteng Belanda di Beverwijk.",
  },
  {
    t: "Penangkapan",
    d: "Setelah ayahnya, Kapitan Paulus, dijatuhi hukuman mati, Martha ditahan dan dibawa ke Pulau Jawa untuk dijadikan kerja paksa di perkebunan kopi.",
  },
  {
    t: "Mogok Makan & Wafat",
    d: "Di atas kapal Eversten yang membawanya ke Jawa, Martha menolak makan, menolak obat, dan menolak segala bentuk kerjasama dengan Belanda. Ia wafat 2 Januari 1818 di Laut Banda. Jenazahnya dilarung ke laut dengan upacara militer.",
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