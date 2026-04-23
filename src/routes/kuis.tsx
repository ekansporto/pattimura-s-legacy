import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import heroBg from "@/assets/hero-bg.jpg";
import battleImg from "@/assets/battle.jpg";
import pattimuraImg from "@/assets/pattimura.jpg";
import marthaImg from "@/assets/martha.jpg";

export const Route = createFileRoute("/kuis")({
  head: () => ({
    meta: [
      { title: "Pertempuran Benteng Duurstede — Mini Game Pahlawan Maluku" },
      {
        name: "description",
        content:
          "Mini game pertempuran: jawab pertanyaan sejarah untuk menyerang benteng kolonial Belanda bersama Pattimura & Martha.",
      },
      { property: "og:title", content: "Pertempuran Benteng Duurstede" },
      { property: "og:description", content: "Mini game perlawanan rakyat Maluku 1817." },
      { property: "og:image", content: battleImg },
      { name: "twitter:image", content: battleImg },
    ],
  }),
  component: KuisPage,
});

type Q = { q: string; opts: string[]; a: number; explain: string };

const QUESTIONS: Q[] = [
  {
    q: "Siapa nama asli Kapitan Pattimura?",
    opts: ["Thomas Matulessy", "Paulus Tiahahu", "Sultan Nuku", "Antonie Rhebok"],
    a: 0,
    explain: "Pattimura adalah gelar untuk Thomas Matulessy.",
  },
  {
    q: "Tahun berapa perlawanan besar rakyat Maluku?",
    opts: ["1815", "1817", "1825", "1908"],
    a: 1,
    explain: "Perlawanan dimulai Mei 1817 di Saparua.",
  },
  {
    q: "Benteng kolonial yang direbut Pattimura?",
    opts: ["Victoria", "Duurstede", "Rotterdam", "Vredeburg"],
    a: 1,
    explain: "Benteng Duurstede di Saparua direbut 16 Mei 1817.",
  },
  {
    q: "Di usia berapa Martha Christina Tiahahu wafat?",
    opts: ["15 tahun", "18 tahun", "21 tahun", "25 tahun"],
    a: 1,
    explain: "Martha wafat di Laut Banda, 2 Januari 1818.",
  },
  {
    q: "Bagaimana Pattimura gugur?",
    opts: ["Tewas di medan", "Dihukum gantung", "Tenggelam", "Sakit"],
    a: 1,
    explain: "Dihukum gantung 16 Desember 1817 di Benteng Victoria.",
  },
  {
    q: "Asal pulau Martha Christina Tiahahu?",
    opts: ["Saparua", "Nusalaut", "Ambon", "Banda"],
    a: 1,
    explain: "Martha lahir di Abubu, Pulau Nusalaut.",
  },
  {
    q: "Senjata khas Maluku yang digunakan pasukan Pattimura?",
    opts: ["Rencong", "Keris", "Parang Salawaku", "Mandau"],
    a: 2,
    explain: "Parang Salawaku — pedang & perisai khas Maluku.",
  },
  {
    q: "Siapa ayah Martha Christina Tiahahu?",
    opts: ["Anthony Rhebok", "Paulus Tiahahu", "Said Perintah", "Lukas Selano"],
    a: 1,
    explain: "Kapitan Paulus Tiahahu, juga seorang pejuang.",
  },
];

const KEY = "kuis-maluku-best";
const MAX_HP = 100;
const PLAYER_DMG = 25; // 4 benar = menang
const ENEMY_DMG = 20; // 5 salah = kalah

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function KuisPage() {
  const [started, setStarted] = useState(false);
  const [hero, setHero] = useState<"pattimura" | "martha">("pattimura");

  const [deck, setDeck] = useState<Q[]>([]);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);

  const [enemyHp, setEnemyHp] = useState(MAX_HP);
  const [playerHp, setPlayerHp] = useState(MAX_HP);

  const [shake, setShake] = useState(false);
  const [hit, setHit] = useState<"enemy" | "player" | null>(null);
  const [floatTxt, setFloatTxt] = useState<{ side: "enemy" | "player"; v: string; key: number } | null>(null);

  const [done, setDone] = useState<null | "win" | "lose">(null);
  const [streak, setStreak] = useState(0);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);

  useEffect(() => {
    setBest(Number(localStorage.getItem(KEY) || "0"));
  }, []);

  const heroImg = hero === "pattimura" ? pattimuraImg : marthaImg;
  const heroName = hero === "pattimura" ? "Kapitan Pattimura" : "Martha Christina";

  const cur = deck[idx];

  const start = () => {
    setDeck(shuffle(QUESTIONS));
    setIdx(0);
    setPicked(null);
    setEnemyHp(MAX_HP);
    setPlayerHp(MAX_HP);
    setStreak(0);
    setScore(0);
    setDone(null);
    setStarted(true);
  };

  const choose = (i: number) => {
    if (picked !== null || done) return;
    setPicked(i);
    const correct = i === cur.a;

    if (correct) {
      const bonus = streak >= 2 ? 10 : 0;
      const dmg = PLAYER_DMG + bonus;
      setHit("enemy");
      setFloatTxt({ side: "enemy", v: `-${dmg}`, key: Date.now() });
      setEnemyHp((hp) => Math.max(0, hp - dmg));
      setStreak((s) => s + 1);
      setScore((s) => s + (10 + bonus));
    } else {
      setShake(true);
      setHit("player");
      setFloatTxt({ side: "player", v: `-${ENEMY_DMG}`, key: Date.now() });
      setPlayerHp((hp) => Math.max(0, hp - ENEMY_DMG));
      setStreak(0);
      setTimeout(() => setShake(false), 450);
    }
    setTimeout(() => setHit(null), 500);
  };

  // Cek game over
  useEffect(() => {
    if (!started || done) return;
    if (enemyHp <= 0) {
      setDone("win");
      const final = score + 50;
      if (final > best) {
        localStorage.setItem(KEY, String(final));
        setBest(final);
      }
    } else if (playerHp <= 0) {
      setDone("lose");
      if (score > best) {
        localStorage.setItem(KEY, String(score));
        setBest(score);
      }
    }
  }, [enemyHp, playerHp, started, done, score, best]);

  const next = () => {
    if (done) return;
    setIdx((i) => (i + 1 >= deck.length ? 0 : i + 1));
    setPicked(null);
  };

  const enemyHpPct = useMemo(() => (enemyHp / MAX_HP) * 100, [enemyHp]);
  const playerHpPct = useMemo(() => (playerHp / MAX_HP) * 100, [playerHp]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <div className="relative">
        <div
          className="absolute inset-0 opacity-20"
          style={{ backgroundImage: `url(${heroBg})`, backgroundSize: "cover", backgroundPosition: "center" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="text-center mb-8">
            <p className="text-gold tracking-[0.3em] text-xs mb-3">— MINI GAME —</p>
            <h1 className="font-serif-display text-4xl sm:text-5xl text-beige">Pertempuran Benteng Duurstede</h1>
            <p className="text-muted-foreground mt-3 text-sm sm:text-base">
              Setiap jawaban benar adalah serangan. Setiap salah, musuh menyerang balik. Skor terbaik:{" "}
              <span className="text-gold font-semibold">{best}</span>
            </p>
          </div>

          {!started ? (
            <div className="bg-card border border-border rounded-3xl p-8 sm:p-10 shadow-classic">
              <h2 className="font-serif-display text-2xl text-beige text-center">Pilih Pahlawanmu</h2>
              <p className="text-muted-foreground text-center text-sm mt-2">
                Tiap pahlawan punya semangat sama: kalahkan benteng kolonial!
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mt-8">
                {([
                  { id: "pattimura", name: "Kapitan Pattimura", img: pattimuraImg, tag: "Sang Penyerbu Benteng" },
                  { id: "martha", name: "Martha Christina", img: marthaImg, tag: "Srikandi Pemberani" },
                ] as const).map((h) => {
                  const active = hero === h.id;
                  return (
                    <button
                      key={h.id}
                      onClick={() => setHero(h.id)}
                      className={`group relative p-5 rounded-2xl border-2 transition-all text-left ${
                        active
                          ? "border-gold bg-maroon-deep/60 shadow-glow scale-[1.02]"
                          : "border-border bg-background/40 hover:border-gold/50"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={h.img}
                          alt={h.name}
                          className="w-20 h-20 rounded-full object-cover border-2 border-gold/70"
                        />
                        <div>
                          <p className="font-serif-display text-xl text-beige">{h.name}</p>
                          <p className="text-gold text-xs tracking-wider mt-1">{h.tag}</p>
                        </div>
                      </div>
                      {active && (
                        <span className="absolute top-3 right-3 text-gold text-xs tracking-widest">✓ TERPILIH</span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 text-center">
                <button
                  onClick={start}
                  className="px-10 py-4 rounded-full bg-gradient-maroon text-beige font-bold tracking-wide shadow-glow hover:scale-105 transition-transform"
                >
                  ⚔ MULAI PERTEMPURAN
                </button>
              </div>

              <ul className="mt-8 grid sm:grid-cols-3 gap-3 text-xs text-muted-foreground">
                <li className="bg-background/40 border border-border rounded-xl p-3">
                  <span className="text-gold font-semibold">⚔ Benar:</span> serang benteng −25 HP
                </li>
                <li className="bg-background/40 border border-border rounded-xl p-3">
                  <span className="text-gold font-semibold">🛡 Salah:</span> Belanda balas −20 HP
                </li>
                <li className="bg-background/40 border border-border rounded-xl p-3">
                  <span className="text-gold font-semibold">🔥 Combo 3+:</span> bonus damage +10
                </li>
              </ul>
            </div>
          ) : done ? (
            <div
              className={`bg-card border rounded-3xl p-10 text-center shadow-glow ${
                done === "win" ? "border-gold/60" : "border-destructive/50"
              }`}
            >
              <p className="text-gold tracking-[0.3em] text-xs">— HASIL PERTEMPURAN —</p>
              <h2 className="font-serif-display text-5xl text-beige mt-4">
                {done === "win" ? "KEMENANGAN! ⚔" : "KALAH 🏳"}
              </h2>
              <p className="mt-4 text-beige/85 text-lg max-w-xl mx-auto">
                {done === "win"
                  ? `${heroName} berhasil meruntuhkan Benteng Duurstede! Semangat 1817 hidup kembali.`
                  : `Pasukan ${heroName} terdesak. Tapi semangat takkan pernah padam — coba lagi!`}
              </p>
              <p className="text-muted-foreground text-sm mt-4">
                Skor: <span className="text-gold font-semibold">{score}</span> · Terbaik:{" "}
                <span className="text-gold">{best}</span>
              </p>

              <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
                <button
                  onClick={start}
                  className="px-7 py-3 rounded-full bg-gradient-maroon text-beige font-medium shadow-glow hover:scale-105 transition-transform"
                >
                  ⚔ Bertempur Lagi
                </button>
                <button
                  onClick={() => setStarted(false)}
                  className="px-7 py-3 rounded-full border border-gold/60 text-gold font-medium hover:bg-gold/10 transition-colors"
                >
                  Ganti Pahlawan
                </button>
                <Link
                  to="/"
                  className="px-7 py-3 rounded-full border border-border text-beige/80 font-medium hover:bg-card transition-colors"
                >
                  ← Beranda
                </Link>
              </div>
            </div>
          ) : (
            <div className={`space-y-5 ${shake ? "animate-shake" : ""}`}>
              {/* BATTLEFIELD */}
              <div className="bg-card border border-border rounded-3xl p-5 sm:p-6 shadow-classic">
                <div className="grid grid-cols-2 gap-4 sm:gap-6 items-end">
                  {/* PLAYER */}
                  <div className={`relative ${hit === "player" ? "animate-shake" : ""}`}>
                    <div className="relative mx-auto w-24 h-24 sm:w-28 sm:h-28">
                      <div className="absolute inset-0 rounded-full bg-gradient-maroon blur-xl opacity-70" />
                      <img
                        src={heroImg}
                        alt={heroName}
                        className="relative w-full h-full rounded-full object-cover border-4 border-gold/80"
                      />
                      {floatTxt?.side === "player" && (
                        <span
                          key={floatTxt.key}
                          className="absolute -top-2 left-1/2 -translate-x-1/2 text-destructive font-bold text-xl animate-hero-fade"
                        >
                          {floatTxt.v}
                        </span>
                      )}
                    </div>
                    <p className="text-center font-serif-display text-beige mt-3 text-sm sm:text-base">{heroName}</p>
                    <div className="mt-2 h-2.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500"
                        style={{ width: `${playerHpPct}%` }}
                      />
                    </div>
                    <p className="text-center text-xs text-muted-foreground mt-1">
                      HP {playerHp}/{MAX_HP}
                    </p>
                  </div>

                  {/* ENEMY (Benteng) */}
                  <div className={`relative ${hit === "enemy" ? "animate-shake" : ""}`}>
                    <div className="relative mx-auto w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-brown-deep border-4 border-border flex items-center justify-center text-5xl sm:text-6xl shadow-classic">
                      🏰
                      {floatTxt?.side === "enemy" && (
                        <span
                          key={floatTxt.key}
                          className="absolute -top-2 left-1/2 -translate-x-1/2 text-gold font-bold text-xl animate-hero-fade"
                        >
                          {floatTxt.v}
                        </span>
                      )}
                    </div>
                    <p className="text-center font-serif-display text-beige mt-3 text-sm sm:text-base">
                      Benteng Duurstede
                    </p>
                    <div className="mt-2 h-2.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-destructive to-rose-500 transition-all duration-500"
                        style={{ width: `${enemyHpPct}%` }}
                      />
                    </div>
                    <p className="text-center text-xs text-muted-foreground mt-1">
                      HP {enemyHp}/{MAX_HP}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-5 text-xs tracking-wider text-muted-foreground">
                  <span>SKOR: <span className="text-gold font-semibold">{score}</span></span>
                  {streak >= 2 && (
                    <span className="text-gold animate-ember">🔥 COMBO x{streak}</span>
                  )}
                  <span>RONDE {idx + 1}</span>
                </div>
              </div>

              {/* QUESTION */}
              <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-classic">
                <h2 className="font-serif-display text-xl sm:text-2xl text-beige leading-snug mb-6">
                  {cur.q}
                </h2>

                <div className="grid sm:grid-cols-2 gap-3">
                  {cur.opts.map((opt, i) => {
                    const isAns = i === cur.a;
                    const isPicked = picked === i;
                    let cls = "border-border bg-background/50 hover:border-gold/60 hover:bg-card";
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
                        className={`text-left px-4 py-3 rounded-xl border-2 transition-all font-medium ${cls}`}
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
                  <div className="mt-5 p-4 rounded-xl bg-maroon-deep/60 border border-gold/30 text-beige/90 text-sm">
                    <span className="text-gold font-semibold">
                      {picked === cur.a ? "⚔ Serangan tepat! " : "🛡 Musuh balas menyerang. "}
                    </span>
                    {cur.explain}
                  </div>
                )}

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={next}
                    disabled={picked === null}
                    className="px-7 py-3 rounded-full bg-gradient-maroon text-beige font-medium shadow-glow disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 transition-transform"
                  >
                    Ronde Berikutnya →
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}