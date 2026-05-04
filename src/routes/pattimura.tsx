import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { Reveal } from "@/components/Reveal";
import pattimuraImg from "@/assets/pattimura.jpg";
import battleImg from "@/assets/battle.jpg";
import mapImg from "@/assets/map.jpg";
import spiceImg from "@/assets/spice-warehouse.jpg";
import chargeImg from "@/assets/pattimura-charge.jpg";

export const Route = createFileRoute("/pattimura")({
  head: () => ({
    meta: [
      { title: "Kapitan Pattimura — Thomas Matulessy | Pahlawan Maluku" },
      {
        name: "description",
        content:
          "Biografi lengkap Kapitan Pattimura (Thomas Matulessy), pemimpin perlawanan rakyat Maluku tahun 1817 melawan kolonial Belanda.",
      },
      { property: "og:title", content: "Kapitan Pattimura — Thomas Matulessy" },
      { property: "og:description", content: "Pemimpin besar perlawanan rakyat Maluku 1817." },
      { property: "og:image", content: pattimuraImg },
      { name: "twitter:image", content: pattimuraImg },
    ],
  }),
  component: PattimuraPage,
});

const facts = [
  { label: "Nama Asli", value: "Thomas Matulessy" },
  { label: "Lahir", value: "8 Juni 1783, Haria, Saparua" },
  { label: "Wafat", value: "16 Desember 1817, Ambon" },
  { label: "Gelar", value: "Kapitan Besar" },
  { label: "Senjata", value: "Parang Salawaku" },
  { label: "Pertempuran", value: "Penyerbuan Benteng Duurstede" },
];

type Panel = { t: string; d: string; img?: string; alt?: string };

const panels: Panel[] = [
  {
    t: "Latar Belakang",
    d: "Thomas Matulessy lahir 8 Juni 1783 di desa Haria, Saparua, dari keluarga Matulessia (Matulessy). Ia tumbuh dalam tradisi pela-gandong yang menanamkan nilai persaudaraan antar kampung. Sebelum memimpin perlawanan, Thomas sempat menjadi sersan dalam dinas militer Inggris di Ambon — pengalaman yang membentuknya menjadi taktikus berdisiplin tinggi dan memahami sistem persenjataan Eropa.",
    img: pattimuraImg,
    alt: "Potret Kapitan Pattimura dengan peta Saparua",
  },
  {
    t: "Penyebab Perlawanan",
    d: "Pada 1817, Belanda kembali berkuasa di Maluku setelah masa Inggris. Mereka memberlakukan pajak berat, monopoli cengkeh dan pala, kerja paksa di hutan, kewajiban menyerahkan ikan asin, serta pengurangan jumlah pendeta pribumi. Penindasan ini memuncak hingga rakyat Saparua bersepakat: cukup sudah tunduk pada penjajah.",
    img: spiceImg,
    alt: "Gudang rempah dijaga tentara Belanda 1817",
  },
  {
    t: "Diangkat Jadi Kapitan Besar",
    d: "Pada 14 Mei 1817 dalam pertemuan rahasia di hutan Pelawi, rakyat Saparua bersepakat mengangkat Thomas Matulessy sebagai Kapitan Besar. Para kapitan dari berbagai negeri bersumpah setia. Dua hari kemudian, Proklamasi Haria dibacakan — sebuah daftar 14 keluhan rakyat sekaligus pernyataan perlawanan terhadap kekuasaan kolonial.",
  },
  {
    t: "Penyerbuan Benteng Duurstede",
    d: "16 Mei 1817 — fajar belum sepenuhnya terang ketika pasukan Pattimura yang dipersenjatai parang Salawaku menyerbu Benteng Duurstede. Setelah pertempuran sengit, benteng kolonial itu jatuh. Residen Van den Berg beserta keluarganya tewas, kecuali putra bungsunya yang diselamatkan. Kemenangan ini membakar semangat perlawanan di Haruku, Nusalaut, hingga Seram.",
    img: battleImg,
    alt: "Penyerbuan Benteng Duurstede",
  },
  {
    t: "Pertempuran Lanjutan",
    d: "Pasukan Pattimura beberapa kali memukul mundur ekspedisi Belanda yang dikirim dari Ambon. Pertempuran besar di Waisisil dan penyergapan di hutan-hutan Saparua menunjukkan kelihaian taktik gerilyanya. Belanda terpaksa mendatangkan bala bantuan dari Jawa dan menggunakan pengkhianat lokal untuk membongkar persembunyiannya.",
  },
  {
    t: "Pengkhianatan & Penangkapan",
    d: "Setelah enam bulan perlawanan tanpa henti, Pattimura akhirnya tertangkap pada 11 November 1817 di sebuah rumah di Siri Sori akibat pengkhianatan Raja Booi. Belanda berkali-kali menawarkan pengampunan, jabatan, dan kekayaan asalkan ia mau bekerjasama — semua ditolaknya tegas. 'Pekerjaanku sudah selesai,' katanya kepada para penangkapnya.",
  },
  {
    t: "Hukuman Gantung",
    d: "Pada 16 Desember 1817, Pattimura dihukum gantung di depan Benteng Victoria, Ambon. Sebelum wafat ia berkata: 'Pattimura-pattimura tua boleh dihancurkan, tapi Pattimura-pattimura muda akan bangkit.'",
  },
  {
    t: "Warisan",
    d: "Pemerintah Republik Indonesia menetapkan Pattimura sebagai Pahlawan Nasional pada 6 November 1973. Wajahnya diabadikan pada uang kertas pecahan Rp1.000, namanya digunakan untuk universitas, bandara, jalan, dan kapal perang TNI. Setiap 15 Mei diperingati sebagai Hari Pattimura di Maluku.",
  },
];

function GoldStar({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <defs>
        <radialGradient id="gs" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="oklch(0.92 0.12 80)" />
          <stop offset="55%" stopColor="oklch(0.78 0.14 75)" />
          <stop offset="100%" stopColor="oklch(0.45 0.12 55)" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="28" fill="oklch(0.22 0.05 40)" stroke="url(#gs)" strokeWidth="1.5" />
      <path
        d="M32 10l5.6 13.6L52 25l-10.5 9.6L44.6 49 32 41.6 19.4 49l3.1-14.4L12 25l14.4-1.4z"
        fill="url(#gs)"
        stroke="oklch(0.35 0.1 55)"
        strokeWidth="0.6"
      />
    </svg>
  );
}

function SectionHeader({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="text-center mb-14">
      <div className="flex justify-center mb-4">
        <GoldStar className="w-14 h-14 drop-shadow-[0_0_20px_oklch(0.78_0.14_75/0.5)]" />
      </div>
      <p className="text-gold tracking-[0.45em] text-[10px] sm:text-xs mb-3">— {kicker} —</p>
      <h2 className="font-serif-display text-4xl sm:text-5xl gold-text-glow">{title}</h2>
      <div className="gold-divider w-40 mx-auto mt-6" />
    </div>
  );
}

function PattimuraPage() {
  return (
    <div className="min-h-screen bg-historical text-foreground">
      <SiteHeader />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(${battleImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-maroon-deep/85 via-background/85 to-background" />
        <div className="relative max-w-6xl mx-auto px-6 pt-14 pb-20 text-center">
          <Reveal>
            <div className="flex justify-center mb-4">
              <GoldStar className="w-16 h-16 drop-shadow-[0_0_30px_oklch(0.78_0.14_75/0.6)]" />
            </div>
            <p className="text-gold tracking-[0.5em] text-[11px] mb-4">— KISAH PERJUANGAN —</p>
            <h1 className="font-serif-display text-5xl sm:text-7xl gold-text-glow leading-tight">
              Sang Kapitan Saparua
            </h1>
            <div className="gold-divider w-56 mx-auto mt-6" />
            <p className="mt-6 max-w-2xl mx-auto text-beige/80 text-base sm:text-lg leading-relaxed">
              Thomas Matulessy — Pahlawan Nasional dari Saparua, pemimpin pemberontakan rakyat Maluku 1817 yang mengguncang kekuasaan kolonial Belanda.
            </p>
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

      {/* MUSEUM PANELS */}
      <section className="py-16 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <SectionHeader kicker="PAMERAN MUSEUM DIGITAL" title="Sang Kapitan Saparua" />

          <div className="relative">
            {/* center timeline rail (desktop) */}
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
                        {/* corner ornaments */}
                        <span className="absolute -top-2 -left-2 w-3 h-3 border-t border-l border-gold/70" />
                        <span className="absolute -top-2 -right-2 w-3 h-3 border-t border-r border-gold/70" />
                        <span className="absolute -bottom-2 -left-2 w-3 h-3 border-b border-l border-gold/70" />
                        <span className="absolute -bottom-2 -right-2 w-3 h-3 border-b border-r border-gold/70" />

                        <p className="text-gold/80 text-[10px] tracking-[0.4em] mb-2">
                          BAB {String(i + 1).padStart(2, "0")}
                        </p>
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

      {/* DRAMATIC PAINTING CARD */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="parchment-panel p-4 sm:p-6">
              <div className="relative overflow-hidden rounded-md">
                <img
                  src={chargeImg}
                  alt="Pattimura memimpin penyerbuan benteng Belanda"
                  loading="lazy"
                  className="w-full h-72 sm:h-[420px] object-cover sepia-[0.1] contrast-[1.05]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
                  <p className="text-gold tracking-[0.4em] text-[10px] mb-2">— LUKISAN HEROIK —</p>
                  <h3 className="font-serif-display text-3xl sm:text-4xl gold-text-glow">
                    Penyerbuan Benteng Duurstede
                  </h3>
                  <p className="mt-3 text-beige/85 max-w-2xl text-sm sm:text-base">
                    16 Mei 1817. Parang salawaku terangkat, panji-panji merah berkibar — fajar Saparua menjadi saksi runtuhnya kekuasaan kolonial.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* QUOTE */}
      <section className="py-20 px-6 bg-maroon-deep/60 border-y border-gold/30 relative">
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: `url(${mapImg})`, backgroundSize: "cover" }}
        />
        <Reveal>
          <blockquote className="relative max-w-3xl mx-auto text-center">
            <GoldStar className="w-10 h-10 mx-auto mb-5 opacity-90" />
            <p className="font-serif-display text-2xl sm:text-3xl gold-text-glow italic leading-relaxed">
              “Pattimura-pattimura tua boleh dihancurkan, tapi Pattimura-pattimura muda akan bangkit.”
            </p>
            <footer className="mt-5 text-beige/80 tracking-[0.4em] text-xs">— KAPITAN PATTIMURA</footer>
          </blockquote>
        </Reveal>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 text-center">
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link
            to="/martha"
            className="px-7 py-3 rounded-full border border-gold/60 text-gold font-medium hover:bg-gold/10 transition-colors"
          >
            Kenal Martha Christina →
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