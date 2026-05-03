import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { Reveal } from "@/components/Reveal";
import heroBg from "@/assets/hero-bg.jpg";
import pattimuraImg from "@/assets/pattimura.jpg";
import marthaImg from "@/assets/martha.jpg";
import mapImg from "@/assets/map.jpg";
import battleImg from "@/assets/battle.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pahlawan Maluku — Pattimura & Martha Christina Tiahahu" },
      {
        name: "description",
        content:
          "Biografi, timeline perjuangan, dan galeri Kapitan Pattimura serta Martha Christina Tiahahu, pahlawan dari tanah Maluku.",
      },
      { property: "og:title", content: "Pahlawan Maluku — Pattimura & Martha" },
      { property: "og:description", content: "Kisah perjuangan pahlawan Maluku 1817." },
      { property: "og:image", content: heroBg },
      { name: "twitter:image", content: heroBg },
    ],
  }),
  component: Index,
});

const heroes = [
  {
    name: "Thomas Matulessy",
    title: "Kapitan Pattimura",
    born: "1783, Haria, Saparua",
    img: pattimuraImg,
    bio: "Lahir di desa Haria, Pulau Saparua, dengan nama Thomas Matulessy. Sebelum menjadi pemimpin perlawanan, ia bertugas sebagai sersan dalam dinas militer Inggris di Ambon. Ketika Belanda kembali berkuasa pada 1817 dengan kebijakan pajak berat, kerja paksa, dan monopoli rempah, Thomas dipilih rakyat Saparua sebagai Kapitan Besar. Ia memimpin penyerbuan Benteng Duurstede, memenangkan beberapa pertempuran besar, dan menolak tegas semua tawaran pengampunan dari Belanda. Gugur di tiang gantungan pada 16 Desember 1817 dengan kepala tetap tegak.",
  },
  {
    name: "Martha Christina Tiahahu",
    title: "Srikandi Maluku",
    born: "4 Januari 1800, Nusalaut",
    img: marthaImg,
    bio: "Lahir di desa Abubu, Pulau Nusalaut, sebagai putri Kapitan Paulus Tiahahu. Sejak kecil ia ikut ayahnya dalam rapat-rapat strategi adat. Pada usia 17 tahun, ia memakai ikat kepala merah, mengangkat tombak, dan memimpin perempuan-perempuan Nusalaut bertempur bersama pasukan Pattimura — termasuk dalam penyerbuan benteng Beverwijk. Setelah ayahnya dihukum mati, Martha ditangkap dan dibuang ke Jawa. Di atas kapal Eversten ia memilih mogok makan, menolak obat, dan wafat di Laut Banda pada 2 Januari 1818 dalam usia 18 tahun.",
  },
];

const timeline = [
  { year: "Mei 1817", title: "Perlawanan Dimulai", desc: "Rakyat Saparua mengangkat Thomas Matulessy sebagai Kapitan Besar." },
  { year: "16 Mei 1817", title: "Benteng Duurstede Direbut", desc: "Pasukan Pattimura menyerbu dan menguasai benteng kolonial Belanda." },
  { year: "Agustus 1817", title: "Martha Bertempur", desc: "Martha Christina Tiahahu, 17 tahun, memimpin pertempuran di Nusalaut." },
  { year: "11 November 1817", title: "Pattimura Ditangkap", desc: "Pengkhianatan membuat Pattimura tertangkap pasukan Belanda." },
  { year: "16 Desember 1817", title: "Pattimura Dihukum Gantung", desc: "Di depan Benteng Victoria, Ambon — gugur sebagai pahlawan." },
  { year: "2 Januari 1818", title: "Martha Wafat di Laut", desc: "Setelah mogok makan, ia wafat di Laut Banda, jenazahnya dilarung." },
];

const gallery = [
  { src: battleImg, caption: "Penyerbuan Benteng Duurstede, 1817" },
  { src: mapImg, caption: "Peta Kepulauan Maluku" },
  { src: heroBg, caption: "Senja di Tanah Maluku" },
];

function Index() {
  const [scrollY, setScrollY] = useState(0);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [timelineProgress, setTimelineProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      setScrollY(window.scrollY);
      const el = timelineRef.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        const wh = window.innerHeight;
        const total = rect.height + wh * 0.6;
        const scrolled = wh - rect.top;
        const p = Math.max(0, Math.min(100, (scrolled / total) * 130));
        setTimelineProgress(p);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      {/* HERO */}
      <section className="relative h-[92vh] overflow-hidden flex items-center justify-center">
        <div
          className="absolute inset-0 will-change-transform"
          style={{
            transform: `translateY(${scrollY * 0.4}px) scale(1.1)`,
            backgroundImage: `url(${heroBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-maroon-deep/60 via-background/70 to-background" />
        <div className="absolute inset-0 paper-texture opacity-60" />

        <div className="relative z-10 text-center px-6 max-w-5xl">
          <p className="animate-hero-fade text-gold tracking-[0.4em] text-xs sm:text-sm mb-6 font-medium">
            ★ SEJARAH NUSANTARA ★
          </p>
          <h1
            className="animate-hero-fade font-serif-display text-5xl sm:text-7xl md:text-8xl font-bold text-beige leading-[1.05] drop-shadow-2xl"
            style={{ animationDelay: "0.2s" }}
          >
            Pahlawan <span className="text-gold">Maluku</span>
          </h1>
          <p
            className="animate-hero-fade mt-6 text-lg sm:text-2xl text-beige/85 font-light max-w-3xl mx-auto"
            style={{ animationDelay: "0.5s" }}
          >
            Perjuangan Pattimura & Martha Christina Tiahahu melawan kolonialisme di tanah Maluku, 1817.
          </p>
          <div
            className="animate-hero-fade mt-10 flex items-center justify-center gap-4 flex-wrap"
            style={{ animationDelay: "0.8s" }}
          >
            <a
              href="#biografi"
              className="px-7 py-3.5 rounded-full bg-gradient-maroon text-beige font-medium shadow-glow hover:scale-105 transition-transform"
            >
              Jelajahi Kisahnya
            </a>
            <Link
              to="/kuis"
              className="px-7 py-3.5 rounded-full border border-gold/60 text-gold font-medium hover:bg-gold/10 transition-colors"
            >
              Uji Pengetahuan →
            </Link>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-beige/60 text-xs tracking-widest animate-ember">
          ▼ SCROLL
        </div>
      </section>

      {/* QUOTE */}
      <section className="py-20 px-6 bg-maroon-deep border-y border-border">
        <Reveal>
          <blockquote className="max-w-4xl mx-auto text-center">
            <p className="font-serif-display text-2xl sm:text-4xl text-beige italic leading-relaxed">
              “Lebih baik mati berkalang tanah daripada hidup dijajah.”
            </p>
            <footer className="mt-6 text-gold tracking-widest text-sm">— SEMANGAT PERJUANGAN MALUKU</footer>
          </blockquote>
        </Reveal>
      </section>

      {/* BIOGRAFI */}
      <section id="biografi" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <p className="text-gold tracking-[0.3em] text-xs mb-3">— BIOGRAFI —</p>
              <h2 className="font-serif-display text-4xl sm:text-5xl text-beige">Dua Pahlawan, Satu Tekad</h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-8">
            {heroes.map((h, i) => (
              <Reveal key={h.name} direction={i === 0 ? "left" : "right"} delay={i * 150}>
                <article className="group bg-card rounded-2xl p-8 border border-border shadow-classic hover:border-gold/50 transition-all hover:-translate-y-1 duration-500">
                  <div className="relative w-40 h-40 mx-auto mb-6">
                    <div className="absolute inset-0 rounded-full bg-gradient-maroon blur-xl opacity-60 group-hover:opacity-100 transition-opacity" />
                    <img
                      src={h.img}
                      alt={h.name}
                      width={768}
                      height={768}
                      loading="lazy"
                      className="relative w-40 h-40 rounded-full object-cover border-4 border-gold/70 shadow-classic group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="font-serif-display text-2xl text-beige text-center">{h.name}</h3>
                  <p className="text-gold text-center text-sm tracking-wider mt-1">{h.title}</p>
                  <p className="text-muted-foreground text-center text-sm mt-2">Lahir: {h.born}</p>
                  <p className="mt-5 text-beige/80 leading-relaxed text-center">{h.bio}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="py-24 px-6 bg-brown-deep/40">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="text-center mb-20">
              <p className="text-gold tracking-[0.3em] text-xs mb-3">— TIMELINE —</p>
              <h2 className="font-serif-display text-4xl sm:text-5xl text-beige">Perjalanan Perjuangan</h2>
              <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
                Tahun 1817 — ketika api perlawanan menyala di tanah Maluku.
              </p>
            </div>
          </Reveal>

          <div className="relative" ref={timelineRef}>
            {/* Track */}
            <div className="absolute left-1/2 top-0 bottom-0 w-[3px] -translate-x-1/2 bg-gold/15 rounded-full" />
            {/* Animated fill */}
            <div
              className="absolute left-1/2 top-0 w-[3px] -translate-x-1/2 rounded-full overflow-visible"
              style={{
                height: `${timelineProgress}%`,
                background: "linear-gradient(to bottom, transparent, oklch(0.78 0.14 75) 10%, oklch(0.88 0.16 80) 50%, oklch(0.78 0.14 75) 90%, transparent)",
                transition: "height 0.4s cubic-bezier(0.25,0.46,0.45,0.94)",
                boxShadow: "0 0 20px oklch(0.78 0.14 75 / 0.6)",
              }}
            >
              {/* Glow at tip */}
              <div
                className="absolute -left-2 -bottom-6 w-[18px] h-[40px] rounded-full pointer-events-none animate-pulse"
                style={{
                  background: "radial-gradient(ellipse at center, oklch(0.92 0.16 80 / 0.9) 0%, oklch(0.78 0.14 75 / 0.4) 40%, transparent 70%)",
                  filter: "blur(2px)",
                }}
              />
            </div>
            <div className="space-y-16">
              {timeline.map((t, i) => {
                const left = i % 2 === 0;
                return (
                  <Reveal key={i} direction={left ? "left" : "right"}>
                    <div className={`relative flex items-center ${left ? "justify-start" : "justify-end"}`}>
                      <div className={`w-full md:w-[45%] ${left ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
                        <div className="bg-card border border-border rounded-xl p-6 shadow-classic hover:border-gold/60 hover:shadow-glow transition-all duration-500">
                          <p className="text-gold font-serif-display text-xl">{t.year}</p>
                          <h3 className="text-beige text-lg font-semibold mt-1">{t.title}</h3>
                          <p className="text-muted-foreground text-sm mt-2 leading-relaxed">{t.desc}</p>
                        </div>
                      </div>
                      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-gradient-gold border-4 border-background shadow-glow z-10 animate-pulse" />
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="text-center mb-14">
              <p className="text-gold tracking-[0.3em] text-xs mb-3">— GALERI —</p>
              <h2 className="font-serif-display text-4xl sm:text-5xl text-beige">Jejak Sejarah</h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6">
            {gallery.map((g, i) => (
              <Reveal key={i} delay={i * 120}>
                <figure className="group relative overflow-hidden rounded-2xl border border-border shadow-classic aspect-[4/5]">
                  <img
                    src={g.src}
                    alt={g.caption}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-maroon-deep via-maroon-deep/30 to-transparent opacity-80" />
                  <figcaption className="absolute bottom-0 left-0 right-0 p-5 text-beige font-serif-display text-lg translate-y-2 group-hover:translate-y-0 transition-transform">
                    {g.caption}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FUN FACT */}
      <section className="py-24 px-6 bg-maroon-deep">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          {[
            { n: "1817", l: "Tahun perlawanan Maluku" },
            { n: "17", l: "Usia Martha saat bertempur" },
            { n: "∞", l: "Warisan semangat juang" },
          ].map((s, i) => (
            <Reveal key={i} delay={i * 100}>
              <div className="p-8 rounded-2xl bg-card/40 border border-gold/20 backdrop-blur">
                <p className="font-serif-display text-5xl text-gold">{s.n}</p>
                <p className="text-beige/80 mt-3 text-sm tracking-wider">{s.l}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center">
        <Reveal>
          <h2 className="font-serif-display text-3xl sm:text-5xl text-beige max-w-3xl mx-auto">
            Sudah siap menguji pengetahuanmu?
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            Mainkan kuis interaktif tentang sejarah perjuangan pahlawan Maluku.
          </p>
          <Link
            to="/kuis"
            className="inline-block mt-8 px-10 py-4 rounded-full bg-gradient-gold text-maroon-deep font-bold tracking-wide shadow-glow hover:scale-105 transition-transform"
          >
            Mulai Kuis →
          </Link>
        </Reveal>
      </section>

      <footer className="py-10 border-t border-border text-center text-muted-foreground text-sm">
        © {new Date().getFullYear()} Pahlawan Maluku · Untuk mengenang jasa para pejuang.
      </footer>
    </div>
  );
}
