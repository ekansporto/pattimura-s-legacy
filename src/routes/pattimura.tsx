import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { Reveal } from "@/components/Reveal";
import pattimuraImg from "@/assets/pattimura.jpg";
import battleImg from "@/assets/battle.jpg";

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

const events = [
  {
    t: "Latar Belakang",
    d: "Thomas Matulessy lahir 8 Juni 1783 di desa Haria, Saparua, dari keluarga Matulessia (Matulessy). Ia tumbuh dalam tradisi pela-gandong yang menanamkan nilai persaudaraan antar kampung. Sebelum memimpin perlawanan, Thomas sempat menjadi sersan dalam dinas militer Inggris di Ambon — pengalaman yang membentuknya menjadi taktikus berdisiplin tinggi dan memahami sistem persenjataan Eropa.",
  },
  {
    t: "Penyebab Perlawanan",
    d: "Pada 1817, Belanda kembali berkuasa di Maluku setelah masa Inggris. Mereka memberlakukan pajak berat, monopoli cengkeh dan pala, kerja paksa di hutan, kewajiban menyerahkan ikan asin, serta pengurangan jumlah pendeta pribumi. Penindasan ini memuncak hingga rakyat Saparua bersepakat: cukup sudah tunduk pada penjajah.",
  },
  {
    t: "Diangkat Jadi Kapitan Besar",
    d: "Pada 14 Mei 1817 dalam pertemuan rahasia di hutan Pelawi, rakyat Saparua bersepakat mengangkat Thomas Matulessy sebagai Kapitan Besar. Para kapitan dari berbagai negeri bersumpah setia. Dua hari kemudian, Proklamasi Haria dibacakan — sebuah daftar 14 keluhan rakyat sekaligus pernyataan perlawanan terhadap kekuasaan kolonial.",
  },
  {
    t: "Penyerbuan Benteng Duurstede",
    d: "16 Mei 1817 — fajar belum sepenuhnya terang ketika pasukan Pattimura yang dipersenjatai parang Salawaku menyerbu Benteng Duurstede. Setelah pertempuran sengit, benteng kolonial itu jatuh. Residen Van den Berg beserta keluarganya tewas, kecuali putra bungsunya yang diselamatkan. Kemenangan ini membakar semangat perlawanan di Haruku, Nusalaut, hingga Seram.",
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

function PattimuraPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url(${battleImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-maroon-deep/80 via-background/90 to-background" />
        <div className="relative max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-[260px_1fr] gap-10 items-center">
          <Reveal direction="left">
            <div className="relative w-60 h-60 mx-auto">
              <div className="absolute inset-0 rounded-full bg-gradient-maroon blur-2xl opacity-70" />
              <img
                src={pattimuraImg}
                alt="Kapitan Pattimura"
                className="relative w-60 h-60 rounded-full object-cover border-4 border-gold/80 shadow-classic"
              />
            </div>
          </Reveal>
          <Reveal direction="right">
            <div>
              <p className="text-gold tracking-[0.3em] text-xs mb-3">— KAPITAN BESAR —</p>
              <h1 className="font-serif-display text-5xl sm:text-6xl text-beige leading-tight">
                Thomas <span className="text-gold">Matulessy</span>
              </h1>
              <p className="mt-4 text-beige/80 text-lg leading-relaxed max-w-xl">
                Pahlawan Nasional dari Saparua. Pemimpin pemberontakan rakyat Maluku 1817 yang mengguncang kekuasaan kolonial Belanda.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FACTS */}
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

      {/* STORY */}
      <section className="py-16 px-6 bg-brown-deep/40">
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <div className="text-center mb-12">
              <p className="text-gold tracking-[0.3em] text-xs mb-3">— KISAH PERJUANGAN —</p>
              <h2 className="font-serif-display text-4xl text-beige">Sang Kapitan Saparua</h2>
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

      {/* QUOTE */}
      <section className="py-20 px-6 bg-maroon-deep border-y border-border">
        <Reveal>
          <blockquote className="max-w-3xl mx-auto text-center">
            <p className="font-serif-display text-2xl sm:text-3xl text-beige italic leading-relaxed">
              “Pattimura-pattimura tua boleh dihancurkan, tapi Pattimura-pattimura muda akan bangkit.”
            </p>
            <footer className="mt-5 text-gold tracking-widest text-xs">— KAPITAN PATTIMURA</footer>
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

      <footer className="py-10 border-t border-border text-center text-muted-foreground text-sm">
        © {new Date().getFullYear()} Pahlawan Maluku
      </footer>
    </div>
  );
}