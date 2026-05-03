import { useEffect, useMemo, useState } from "react";
import battleScene from "@/assets/battle-scene.jpg";
import pattimuraImg from "@/assets/pattimura.jpg";

type Phase = "narration" | "choice" | "result" | "ended";

type Scene = {
  id: number;
  narration: string;
  question: string;
  choices: {
    label: string;
    text: string;
    correct: boolean;
    feedback: string;
    dmgEnemy: number;
    dmgSelf: number;
  }[];
};

const SCENES: Scene[] = [
  {
    id: 1,
    narration:
      "Senja di Saparua, 1817. Asap mengepul di sekitar Benteng Duurstede. Pasukan Belanda mulai mendekat dengan meriam terhunus.",
    question: "APA PERINTAHMU, KAPITAN?",
    choices: [
      {
        label: "A",
        text: "Bertahan di dinding benteng sekuat tenaga.",
        correct: false,
        feedback: "Pasukan tertahan, namun meriam Belanda merobek dinding benteng. Pasukan kita banyak yang gugur.",
        dmgEnemy: 10,
        dmgSelf: 25,
      },
      {
        label: "B",
        text: "Serangan balik menyeluruh dan rebut senjata mereka!",
        correct: true,
        feedback: "Serangan kejutan! Garnisun Belanda terkejut dan benteng pun jatuh ke tangan rakyat Maluku!",
        dmgEnemy: 35,
        dmgSelf: 8,
      },
    ],
  },
  {
    id: 2,
    narration:
      "Bantuan Belanda dari Ambon datang dengan kapal perang. Kau harus menentukan strategi pertahanan berikutnya.",
    question: "BAGAIMANA STRATEGI KITA?",
    choices: [
      {
        label: "A",
        text: "Tarik mundur ke hutan dan pakai taktik gerilya.",
        correct: true,
        feedback: "Hutan jadi sekutu kita. Pasukan Belanda tersesat dan banyak yang tumbang dalam penyergapan.",
        dmgEnemy: 30,
        dmgSelf: 5,
      },
      {
        label: "B",
        text: "Hadapi langsung di pantai dengan formasi terbuka.",
        correct: false,
        feedback: "Meriam kapal melumat barisan kita. Banyak pejuang gugur sebelum sempat melawan.",
        dmgEnemy: 5,
        dmgSelf: 30,
      },
    ],
  },
  {
    id: 3,
    narration:
      "Belanda menawarkan perundingan: menyerah dan kau akan diampuni. Namun kau tahu janji kolonial tak pernah ditepati.",
    question: "APA JAWABANMU?",
    choices: [
      {
        label: "A",
        text: "Tolak! Lebih baik mati daripada tunduk.",
        correct: true,
        feedback: "Semangat rakyat menyala. Kapitan Pattimura menjadi simbol perlawanan abadi.",
        dmgEnemy: 25,
        dmgSelf: 10,
      },
      {
        label: "B",
        text: "Terima tawaran demi keselamatan pasukan.",
        correct: false,
        feedback: "Janji itu dilanggar. Tokoh-tokoh perjuangan ditangkap satu per satu.",
        dmgEnemy: 0,
        dmgSelf: 35,
      },
    ],
  },
];

export function MiniGame() {
  const [sceneIdx, setSceneIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>("narration");
  const [hpSelf, setHpSelf] = useState(100);
  const [hpEnemy, setHpEnemy] = useState(100);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [shake, setShake] = useState(false);
  const [floatDmg, setFloatDmg] = useState<{ side: "self" | "enemy"; v: number } | null>(null);

  const scene = SCENES[sceneIdx];

  useEffect(() => {
    if (phase === "narration") {
      const t = setTimeout(() => setPhase("choice"), 1800);
      return () => clearTimeout(t);
    }
  }, [phase, sceneIdx]);

  const choose = (i: number) => {
    const c = scene.choices[i];
    setFeedback(c.feedback);
    setHpEnemy((v) => Math.max(0, v - c.dmgEnemy));
    setHpSelf((v) => Math.max(0, v - c.dmgSelf));
    if (c.dmgSelf > 0) {
      setShake(true);
      setFloatDmg({ side: "self", v: c.dmgSelf });
      setTimeout(() => setShake(false), 400);
    } else if (c.dmgEnemy > 0) {
      setFloatDmg({ side: "enemy", v: c.dmgEnemy });
    }
    setTimeout(() => setFloatDmg(null), 900);
    if (c.correct) setScore((s) => s + 100);
    setPhase("result");
  };

  const next = () => {
    if (sceneIdx + 1 >= SCENES.length || hpSelf <= 0 || hpEnemy <= 0) {
      setPhase("ended");
      const best = Number(localStorage.getItem("lastStandHigh") || 0);
      if (score > best) localStorage.setItem("lastStandHigh", String(score));
      return;
    }
    setSceneIdx((i) => i + 1);
    setFeedback("");
    setPhase("narration");
  };

  const restart = () => {
    setSceneIdx(0);
    setHpSelf(100);
    setHpEnemy(100);
    setScore(0);
    setFeedback("");
    setPhase("narration");
  };

  const verdict = useMemo(() => {
    if (hpSelf <= 0) return { title: "GUGUR DI MEDAN PERANG", tone: "fail" as const };
    if (hpEnemy <= 0) return { title: "BENTENG DIREBUT!", tone: "success" as const };
    if (score >= 200) return { title: "STRATEGI BIJAK", tone: "success" as const };
    return { title: "PERLAWANAN BERAKHIR", tone: "fail" as const };
  }, [hpSelf, hpEnemy, score]);

  return (
    <section className="relative py-16 px-4 sm:px-6 border-t border-border overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${battleScene})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "sepia(0.5) saturate(1.1) brightness(0.5)",
        }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-b from-maroon-deep/70 via-background/70 to-background" />

      <div className={`relative max-w-4xl mx-auto ${shake ? "animate-shake" : ""}`}>
        {/* HP bars */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <HpBar label="KAPITAN PATTIMURA" hp={hpSelf} tone="gold" />
          <HpBar label="PASUKAN BELANDA" hp={hpEnemy} tone="maroon" align="right" />
        </div>

        <div className="grid md:grid-cols-[200px_1fr] gap-6 items-end">
          {/* Portrait */}
          <div className="relative mx-auto md:mx-0 w-40 sm:w-48">
            <div className="absolute -inset-2 rounded-2xl bg-gradient-gold opacity-30 blur-xl" />
            <img
              src={pattimuraImg}
              alt="Kapitan Pattimura"
              className="relative rounded-2xl border-2 border-gold w-full object-cover shadow-glow"
              style={{ filter: "sepia(0.3) contrast(1.05)" }}
            />
            {floatDmg && (
              <span
                className={`absolute left-1/2 -translate-x-1/2 ${
                  floatDmg.side === "self" ? "top-2 text-destructive" : "-top-6 text-gold"
                } font-serif-display text-2xl font-bold animate-narration drop-shadow-lg`}
              >
                -{floatDmg.v}
              </span>
            )}
          </div>

          {/* Paper dialog box */}
          <div className="paper-panel rounded-2xl p-6 sm:p-8 relative">
            <p className="text-gold font-serif-display tracking-[0.3em] text-[10px] mb-3">
              SAPARUA · 1817 · BABAK {scene?.id ?? "—"}
            </p>

            {phase === "narration" && (
              <p className="font-serif-display text-beige text-lg leading-relaxed animate-narration">
                {scene.narration}
              </p>
            )}

            {phase === "choice" && (
              <>
                <p className="font-serif-display text-beige text-lg leading-relaxed">
                  {scene.narration}
                </p>
                <h3 className="mt-5 text-gold font-serif-display tracking-[0.2em] text-sm">
                  {scene.question}
                </h3>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {scene.choices.map((c, i) => (
                    <button
                      key={i}
                      onClick={() => choose(i)}
                      className={`group text-left p-4 rounded-xl border transition-all ${
                        i === 0
                          ? "border-destructive/70 bg-destructive/10 hover:bg-destructive/20"
                          : "border-gold/70 bg-gold/10 hover:bg-gold/20 animate-glow-pulse"
                      }`}
                    >
                      <span className="font-serif-display text-beige">
                        <span className="text-gold mr-2">{c.label}.</span>
                        {c.text}
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}

            {phase === "result" && (
              <>
                <p className="font-serif-display text-beige text-lg leading-relaxed animate-narration">
                  {feedback}
                </p>
                <div className="mt-5 flex items-center justify-between gap-3 flex-wrap">
                  <span className="text-gold tracking-[0.3em] text-xs">
                    SKOR: {score}
                  </span>
                  <button
                    onClick={next}
                    className="px-6 py-2.5 rounded-full bg-gradient-maroon text-beige font-medium border border-gold hover:scale-105 transition-transform"
                  >
                    Lanjut →
                  </button>
                </div>
              </>
            )}

            {phase === "ended" && (
              <div className="text-center py-2">
                <p className="text-gold tracking-[0.3em] text-xs mb-2">— PERTEMPURAN SELESAI —</p>
                <h3
                  className={`font-serif-display text-3xl ${
                    verdict.tone === "success" ? "text-gold" : "text-beige"
                  }`}
                >
                  {verdict.title}
                </h3>
                <p className="mt-3 text-beige/85">Skor akhir: <b className="text-gold">{score}</b></p>
                <p className="text-beige/60 text-sm">
                  Skor tertinggi: {Math.max(score, Number(localStorage.getItem("lastStandHigh") || 0))}
                </p>
                <button
                  onClick={restart}
                  className="mt-5 px-7 py-3 rounded-full bg-gradient-maroon text-beige font-bold border border-gold shadow-glow hover:scale-105 transition-transform"
                >
                  ⟲ Ulangi Pertempuran
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function HpBar({
  label,
  hp,
  tone,
  align = "left",
}: {
  label: string;
  hp: number;
  tone: "gold" | "maroon";
  align?: "left" | "right";
}) {
  return (
    <div className={align === "right" ? "text-right" : ""}>
      <div className="flex items-center justify-between text-[10px] tracking-[0.25em] mb-1">
        <span className="text-beige/80">{label}</span>
        <span className="text-gold">{hp}/100</span>
      </div>
      <div className="h-3 rounded-full bg-background/60 border border-border overflow-hidden">
        <div
          className="h-full transition-all duration-500"
          style={{
            width: `${hp}%`,
            background:
              tone === "gold"
                ? "linear-gradient(90deg, var(--gold), oklch(0.62 0.16 55))"
                : "linear-gradient(90deg, var(--maroon), var(--maroon-deep))",
          }}
        />
      </div>
    </div>
  );
}
