import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import heroBg from "@/assets/hero-bg.jpg";

export const Route = createFileRoute("/kuis")({
  head: () => ({
    meta: [
      { title: "Kuis Pahlawan Maluku — Uji Pengetahuan Sejarahmu" },
      {
        name: "description",
        content:
          "Kuis pilihan ganda interaktif tentang Pattimura, Martha Christina Tiahahu, dan perjuangan rakyat Maluku tahun 1817.",
      },
      { property: "og:title", content: "Kuis Pahlawan Maluku" },
      { property: "og:description", content: "Mainkan kuis sejarah Maluku 1817 dan uji pengetahuanmu." },
      { property: "og:image", content: heroBg },
      { name: "twitter:image", content: heroBg },
    ],
  }),
  component: KuisPage,
});

type Q = { q: string; opts: string[]; a: number; explain: string };

const questions: Q[] = [
  {
    q: "Siapa nama asli Kapitan Pattimura?",
    opts: ["Thomas Matulessy", "Paulus Tiahahu", "Sultan Nuku", "Antonie Rhebok"],
    a: 0,
    explain: "Pattimura adalah gelar untuk Thomas Matulessy.",
  },
  {
    q: "Pada tahun berapa perlawanan besar rakyat Maluku terjadi?",
    opts: ["1815", "1817", "1825", "1908"],
    a: 1,
    explain: "Perlawanan dimulai pada Mei 1817 di Saparua.",
  },
  {
    q: "Siapa pahlawan perempuan muda dari Maluku?",
    opts: ["Cut Nyak Dien", "R.A. Kartini", "Martha Christina Tiahahu", "Dewi Sartika"],
    a: 2,
    explain: "Martha Christina Tiahahu, srikandi Maluku dari Nusalaut.",
  },
  {
    q: "Benteng kolonial mana yang direbut oleh pasukan Pattimura?",
    opts: ["Benteng Victoria", "Benteng Duurstede", "Benteng Rotterdam", "Benteng Vredeburg"],
    a: 1,
    explain: "Benteng Duurstede di Saparua direbut pada 16 Mei 1817.",
  },
  {
    q: "Di usia berapa Martha Christina Tiahahu wafat?",
    opts: ["15 tahun", "18 tahun", "21 tahun", "25 tahun"],
    a: 1,
    explain: "Ia wafat di Laut Banda pada 2 Januari 1818, usia 18 tahun.",
  },
  {
    q: "Bagaimana Pattimura gugur?",
    opts: [
      "Tewas dalam pertempuran",
      "Dihukum gantung Belanda",
      "Tenggelam di laut",
      "Sakit di pengasingan",
    ],
    a: 1,
    explain: "Pattimura dihukum gantung 16 Desember 1817 di depan Benteng Victoria, Ambon.",
  },
];

const KEY = "kuis-maluku-best";

function KuisPage() {
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [shake, setShake] = useState(false);
  const [done, setDone] = useState(false);
  const [best, setBest] = useState(0);

  useEffect(() => {
    const v = Number(localStorage.getItem(KEY) || "0");
    setBest(v);
  }, []);

  const total = questions.length;
  const cur = questions[idx];

  const choose = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    if (i === cur.a) {
      setScore((s) => s + 1);
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 450);
    }
  };

  const next = () => {
    if (idx + 1 >= total) {
      setDone(true);
      const finalScore = score;
      if (finalScore > best) {
        localStorage.setItem(KEY, String(finalScore));
        setBest(finalScore);
      }
    } else {
      setIdx((i) => i + 1);
      setPicked(null);
    }
  };

  const reset = () => {
    setIdx(0);
    setScore(0);
    setPicked(null);
    setDone(false);
  };

  const progress = ((idx + (picked !== null ? 1 : 0)) / total) * 100;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <div className="relative">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(${heroBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />

        <div className="relative max-w-3xl mx-auto px-6 py-16">
          <div className="text-center mb-10">
            <p className="text-gold tracking-[0.3em] text-xs mb-3">— KUIS INTERAKTIF —</p>
            <h1 className="font-serif-display text-4xl sm:text-5xl text-beige">Uji Pengetahuanmu</h1>
            <p className="text-muted-foreground mt-3">
              Skor terbaikmu: <span className="text-gold font-semibold">{best}</span> / {total}
            </p>
          </div>

          {!done ? (
            <div
              className={`bg-card border border-border rounded-3xl p-8 sm:p-10 shadow-classic ${
                shake ? "animate-shake" : ""
              }`}
            >
              {/* Progress */}
              <div className="mb-8">
                <div className="flex items-center justify-between text-xs text-muted-foreground tracking-wider mb-2">
                  <span>
                    SOAL {idx + 1} / {total}
                  </span>
                  <span>SKOR: {score}</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-gold transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <h2 className="font-serif-display text-2xl sm:text-3xl text-beige leading-snug mb-8">
                {cur.q}
              </h2>

              <div className="grid sm:grid-cols-2 gap-3">
                {cur.opts.map((opt, i) => {
                  const isAns = i === cur.a;
                  const isPicked = picked === i;
                  let cls =
                    "border-border bg-background/50 hover:border-gold/60 hover:bg-card";
                  if (picked !== null) {
                    if (isAns) cls = "border-emerald-500/70 bg-emerald-500/10 text-beige";
                    else if (isPicked) cls = "border-destructive bg-destructive/15 text-beige";
                    else cls = "border-border bg-background/30 opacity-60";
                  }
                  return (
                    <button
                      key={i}
                      onClick={() => choose(i)}
                      disabled={picked !== null}
                      className={`text-left px-5 py-4 rounded-xl border-2 transition-all font-medium ${cls}`}
                    >
                      <span className="text-gold mr-2 font-serif-display">
                        {String.fromCharCode(65 + i)}.
                      </span>
                      {opt}
                    </button>
                  );
                })}
              </div>

              {picked !== null && (
                <div className="mt-6 p-4 rounded-xl bg-maroon-deep/60 border border-gold/30 text-beige/90 text-sm">
                  <span className="text-gold font-semibold">
                    {picked === cur.a ? "Tepat sekali! " : "Belum tepat. "}
                  </span>
                  {cur.explain}
                </div>
              )}

              <div className="mt-8 flex justify-end">
                <button
                  onClick={next}
                  disabled={picked === null}
                  className="px-7 py-3 rounded-full bg-gradient-maroon text-beige font-medium shadow-glow disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 transition-transform"
                >
                  {idx + 1 >= total ? "Lihat Hasil" : "Soal Berikutnya →"}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-card border border-gold/40 rounded-3xl p-10 text-center shadow-glow">
              <p className="text-gold tracking-[0.3em] text-xs">— HASIL —</p>
              <h2 className="font-serif-display text-5xl text-beige mt-4">
                {score} / {total}
              </h2>
              <p className="mt-4 text-beige/85 text-lg">
                {score === total
                  ? "Sempurna! Engkau penjaga sejarah sejati. ⚔️"
                  : score >= total - 2
                    ? "Hebat! Pengetahuanmu tentang Maluku sangat baik."
                    : score >= total / 2
                      ? "Bagus! Tapi masih ada yang bisa dipelajari."
                      : "Terus belajar — sejarah menunggu untuk dikenang."}
              </p>
              <p className="text-muted-foreground text-sm mt-3">
                Skor terbaikmu: <span className="text-gold">{Math.max(best, score)}</span> / {total}
              </p>

              <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
                <button
                  onClick={reset}
                  className="px-7 py-3 rounded-full bg-gradient-maroon text-beige font-medium shadow-glow hover:scale-105 transition-transform"
                >
                  Coba Lagi
                </button>
                <Link
                  to="/"
                  className="px-7 py-3 rounded-full border border-gold/60 text-gold font-medium hover:bg-gold/10 transition-colors"
                >
                  ← Kembali ke Biografi
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}