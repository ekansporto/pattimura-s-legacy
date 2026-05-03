import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import battleScene from "@/assets/battle-scene.jpg";

export const Route = createFileRoute("/kuis")({
  head: () => ({
    meta: [
      { title: "Pertempuran Benteng Duurstede — Game Naratif Pahlawan Maluku" },
      {
        name: "description",
        content:
          "Game pilihan naratif gaya RPG: pimpin Kapitan Pattimura mempertahankan Benteng Duurstede pada tahun 1817.",
      },
      { property: "og:title", content: "Pertempuran Benteng Duurstede" },
      { property: "og:description", content: "Game naratif perlawanan rakyat Maluku 1817." },
      { property: "og:image", content: battleScene },
      { name: "twitter:image", content: battleScene },
    ],
  }),
  component: KuisPage,
});

type Choice = {
  label: string;
  text: string;
  variant: "red" | "gold";
  // consequence
  good: boolean;
  hpEnemy?: number; // damage to enemy
  hpSelf?: number; // damage to self
  result: string; // narration after choice
};

type Scene = {
  id: number;
  narration: string;
  prompt?: string;
  choices: [Choice, Choice];
};

const SCENES: Scene[] = [
  {
    id: 1,
    narration:
      "Sersan, Benteng Duurstede terkepung sepenuhnya. Kapal-kapal Belanda di teluk bersiap menembakkan meriam, sementara pasukan infantri musuh mulai mendaki dinding. Kita kehabisan peluru.",
    prompt: "APA PERINTAHMU, KAPITAN?",
    choices: [
      {
        label: "A",
        text: "BERTAHAN DI DINDING BENTENG SEKUAT TENAGA.",
        variant: "red",
        good: false,
        hpSelf: 25,
        hpEnemy: 10,
        result:
          "Pasukanmu bertahan gigih, tapi meriam Belanda meluluhlantakkan dinding utara. Banyak prajurit gugur sebelum sempat melawan.",
      },
      {
        label: "B",
        text: "SERANGAN BALIK MENYELURUH DAN REBUT SENJATA MEREKA!",
        variant: "gold",
        good: true,
        hpEnemy: 30,
        hpSelf: 10,
        result:
          "Dengan teriakan 'Mena Muria!', pasukanmu menerjang turun. Senjata musuh berpindah tangan, garis depan Belanda kacau balau.",
      },
    ],
  },
  {
    id: 2,
    narration:
      "Malam tiba. Residen Van den Berg tertangkap di dalam benteng. Beberapa serdadu Belanda menyerah, sebagian lain bersembunyi di gudang mesiu — siap meledakkan diri.",
    prompt: "APA TINDAKANMU, KAPITAN?",
    choices: [
      {
        label: "A",
        text: "BAKAR GUDANG MESIU DARI LUAR — JANGAN BERI MEREKA KESEMPATAN.",
        variant: "red",
        good: false,
        hpSelf: 20,
        hpEnemy: 5,
        result:
          "Ledakan dahsyat mengguncang benteng. Musuh musnah, namun sebagian dinding selatan ikut runtuh dan melukai pasukanmu.",
      },
      {
        label: "B",
        text: "KIRIM UTUSAN — TAWARKAN MENYERAH DENGAN KEHORMATAN.",
        variant: "gold",
        good: true,
        hpEnemy: 25,
        hpSelf: 0,
        result:
          "Mereka menyerah. Senjata, mesiu, dan benteng kini sepenuhnya milik rakyat Maluku. Kemenangan tanpa korban tambahan.",
      },
    ],
  },
  {
    id: 3,
    narration:
      "Berita kemenangan menyebar. Namun mata-mata melaporkan armada bantuan Belanda dari Ambon akan tiba dalam dua hari. Beberapa kapitan ragu melanjutkan perlawanan.",
    prompt: "BAGAIMANA KAU SATUKAN MEREKA?",
    choices: [
      {
        label: "A",
        text: "PAKSA MEREKA TUNDUK DENGAN ANCAMAN.",
        variant: "red",
        good: false,
        hpSelf: 15,
        hpEnemy: 0,
        result:
          "Kepercayaan retak. Beberapa pasukan diam-diam mundur ke kampung halaman. Semangatmu mulai goyah.",
      },
      {
        label: "B",
        text: "KUMPULKAN MEREKA DAN BACAKAN PROKLAMASI HARIA.",
        variant: "gold",
        good: true,
        hpEnemy: 20,
        hpSelf: 0,
        result:
          "Kata-katamu menggetarkan dada para kapitan. Mereka bersumpah berjuang sampai titik darah penghabisan. Martha Christina pun mengangkat tombak di sampingmu.",
      },
    ],
  },
  {
    id: 4,
    narration:
      "Armada Belanda tiba lebih cepat dari dugaan. Kapal-kapal mengepung pantai Saparua. Pasukan musuh mendarat dengan jumlah berlipat.",
    prompt: "STRATEGI APA YANG KAU PILIH?",
    choices: [
      {
        label: "A",
        text: "HADANG MEREKA DI PANTAI DENGAN SELURUH KEKUATAN.",
        variant: "red",
        good: false,
        hpSelf: 30,
        hpEnemy: 15,
        result:
          "Pertempuran terbuka di pasir. Korban berjatuhan, dan pasukan kita kalah jumlah. Tapi nama Pattimura makin ditakuti.",
      },
      {
        label: "B",
        text: "GUNAKAN HUTAN — PERANG GERILYA DARI BUKIT.",
        variant: "gold",
        good: true,
        hpEnemy: 30,
        hpSelf: 5,
        result:
          "Dari rimbun pepohonan, parang Salawaku berkilat. Patroli Belanda lenyap satu per satu sebelum sempat melapor.",
      },
    ],
  },
  {
    id: 5,
    narration:
      "Pengkhianat dari kalangan sendiri membocorkan markasmu. Belanda mengepung. Mereka menawarkan pengampunan jika kau menyerah hidup-hidup.",
    prompt: "APA JAWABANMU, KAPITAN?",
    choices: [
      {
        label: "A",
        text: "MENYERAH — SELAMATKAN NYAWA YANG TERSISA.",
        variant: "red",
        good: false,
        hpSelf: 25,
        hpEnemy: 0,
        result:
          "Kau ditangkap dan dibawa ke Ambon. Namun kepalamu tetap tegak — dan dunia mengingat: Pattimura tak pernah memohon ampun.",
      },
      {
        label: "B",
        text: "“LEBIH BAIK MATI BERKALANG TANAH DARIPADA HIDUP DIJAJAH!”",
        variant: "gold",
        good: true,
        hpEnemy: 40,
        hpSelf: 20,
        result:
          "Kau bertempur sampai napas terakhir orang-orangmu. Walau akhirnya tertangkap, semangat 1817 menyala abadi di setiap dada anak Maluku.",
      },
    ],
  },
];

const KEY = "pattimura-rpg-best";
const MAX_HP = 100;

function KuisPage() {
  const [started, setStarted] = useState(false);
  const [sceneIdx, setSceneIdx] = useState(0);
  const [playerHp, setPlayerHp] = useState(MAX_HP);
  const [enemyHp, setEnemyHp] = useState(MAX_HP);
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState<"narration" | "choice" | "result" | "end">("narration");
  const [lastChoice, setLastChoice] = useState<Choice | null>(null);
  const [shake, setShake] = useState(false);
  const [floatTxt, setFloatTxt] = useState<{ side: "enemy" | "player"; v: string; key: number } | null>(null);
  const [best, setBest] = useState(0);
  const [ending, setEnding] = useState<null | "victory" | "heroic" | "defeat">(null);

  useEffect(() => {
    setBest(Number(localStorage.getItem(KEY) || "0"));
  }, []);

  const scene = SCENES[sceneIdx];

  const start = () => {
    setStarted(true);
    setSceneIdx(0);
    setPlayerHp(MAX_HP);
    setEnemyHp(MAX_HP);
    setScore(0);
    setPhase("narration");
    setLastChoice(null);
    setEnding(null);
  };

  const pick = (c: Choice) => {
    if (phase !== "choice") return;
    setLastChoice(c);

    if (c.hpEnemy && c.hpEnemy > 0) {
      setEnemyHp((hp) => Math.max(0, hp - c.hpEnemy!));
      setFloatTxt({ side: "enemy", v: `-${c.hpEnemy}`, key: Date.now() });
    }
    if (c.hpSelf && c.hpSelf > 0) {
      setPlayerHp((hp) => Math.max(0, hp - c.hpSelf!));
      setFloatTxt({ side: "player", v: `-${c.hpSelf}`, key: Date.now() + 1 });
      setShake(true);
      setTimeout(() => setShake(false), 450);
    }
    setScore((s) => s + (c.good ? 100 : 25));
    setPhase("result");
  };

  const next = () => {
    const nextIdx = sceneIdx + 1;
    if (playerHp <= 0 || nextIdx >= SCENES.length) {
      // Determine ending
      let result: "victory" | "heroic" | "defeat" = "defeat";
      if (playerHp > 0 && enemyHp <= 30) result = "victory";
      else if (playerHp > 0) result = "heroic";
      setEnding(result);
      setPhase("end");
      const final = score + (result === "victory" ? 200 : result === "heroic" ? 100 : 0);
      setScore(final);
      if (final > best) {
        localStorage.setItem(KEY, String(final));
        setBest(final);
      }
      return;
    }
    setSceneIdx(nextIdx);
    setLastChoice(null);
    setPhase("narration");
  };

  // Auto-transition narration -> choice
  useEffect(() => {
    if (phase === "narration") {
      const t = setTimeout(() => setPhase("choice"), 1200);
      return () => clearTimeout(t);
    }
  }, [phase, sceneIdx]);

  const enemyHpPct = useMemo(() => (enemyHp / MAX_HP) * 100, [enemyHp]);
  const playerHpPct = useMemo(() => (playerHp / MAX_HP) * 100, [playerHp]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <div className="relative">
        {/* Battle background */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${battleScene})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/40 to-background" />

        <div className={`relative max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14 ${shake ? "animate-shake" : ""}`}>
          <div className="text-center mb-6">
            <p className="text-gold tracking-[0.3em] text-xs mb-2">— GAME NARATIF —</p>
            <h1 className="font-serif-display text-3xl sm:text-5xl text-beige drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
              Pertempuran Benteng Duurstede
            </h1>
            <p className="text-beige/80 mt-2 text-sm">
              Skor terbaik: <span className="text-gold font-semibold">{best}</span>
            </p>
          </div>

          {!started ? (
            <div className="paper-panel rounded-3xl p-8 sm:p-10 max-w-2xl mx-auto text-center">
              <p className="text-gold font-serif-display tracking-widest text-sm mb-3">SAPARUA · MEI 1817</p>
              <h2 className="font-serif-display text-3xl text-beige">Pimpin Kapitan Pattimura</h2>
              <p className="text-beige/85 mt-4">
                Setiap perintahmu menentukan nasib pasukan dan benteng. Pilih dengan bijak — sejarah sedang menulis namamu.
              </p>
              <button
                onClick={start}
                className="mt-8 px-10 py-4 rounded-full bg-gradient-maroon text-beige font-bold tracking-wide shadow-glow hover:scale-105 transition-transform animate-glow-pulse border border-gold"
              >
                ⚔ MULAI PERTEMPURAN
              </button>
            </div>
          ) : phase === "end" ? (
            <div className="paper-panel rounded-3xl p-8 sm:p-12 text-center max-w-3xl mx-auto">
              <p className="text-gold tracking-[0.3em] text-xs">— AKHIR PERTEMPURAN —</p>
              <h2 className="font-serif-display text-4xl sm:text-5xl text-beige mt-4">
                {ending === "victory"
                  ? "KEMENANGAN GEMILANG ⚔"
                  : ending === "heroic"
                    ? "GUGUR SEBAGAI PAHLAWAN 🌟"
                    : "BENTENG JATUH 🏳"}
              </h2>
              <p className="mt-5 text-beige/90 text-lg leading-relaxed">
                {ending === "victory"
                  ? "Berkat kepemimpinanmu, Benteng Duurstede direbut dan rakyat Maluku bangkit melawan penjajah. Namamu, Pattimura, terukir abadi dalam sejarah."
                  : ending === "heroic"
                    ? "Walau benteng akhirnya jatuh, perlawananmu menyalakan api perjuangan di seluruh Nusantara. 'Lebih baik mati berkalang tanah daripada hidup dijajah.'"
                    : "Pasukanmu kalah jumlah dan strategi. Tapi setiap perlawanan menanam benih kemerdekaan. Cobalah kembali — sejarah memberi kesempatan kedua."}
              </p>
              <p className="text-gold mt-6 text-lg">
                Skor Akhir: <span className="font-bold">{score}</span> · Terbaik:{" "}
                <span className="font-bold">{best}</span>
              </p>
              <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
                <button
                  onClick={start}
                  className="px-7 py-3 rounded-full bg-gradient-maroon text-beige font-medium shadow-glow hover:scale-105 transition-transform border border-gold"
                >
                  ⚔ Bertempur Lagi
                </button>
                <Link
                  to="/"
                  className="px-7 py-3 rounded-full border border-gold/60 text-gold font-medium hover:bg-gold/10 transition-colors"
                >
                  ← Beranda
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {/* HP BARS */}
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                <div className="paper-panel rounded-2xl px-4 py-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-serif-display text-beige tracking-widest">KAPITAN PATTIMURA</span>
                    <span className="text-gold">{playerHp}/{MAX_HP}</span>
                  </div>
                  <div className="mt-2 h-2.5 bg-black/40 rounded-full overflow-hidden border border-gold/40 relative">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-700"
                      style={{ width: `${playerHpPct}%` }}
                    />
                    {floatTxt?.side === "player" && (
                      <span
                        key={floatTxt.key}
                        className="absolute -top-7 right-2 text-destructive font-bold text-lg animate-hero-fade"
                      >
                        {floatTxt.v}
                      </span>
                    )}
                  </div>
                </div>
                <div className="paper-panel rounded-2xl px-4 py-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-serif-display text-beige tracking-widest">BENTENG DUURSTEDE</span>
                    <span className="text-gold">{enemyHp}/{MAX_HP}</span>
                  </div>
                  <div className="mt-2 h-2.5 bg-black/40 rounded-full overflow-hidden border border-gold/40 relative">
                    <div
                      className="h-full bg-gradient-to-r from-destructive to-rose-500 transition-all duration-700"
                      style={{ width: `${enemyHpPct}%` }}
                    />
                    {floatTxt?.side === "enemy" && (
                      <span
                        key={floatTxt.key}
                        className="absolute -top-7 right-2 text-gold font-bold text-lg animate-hero-fade"
                      >
                        {floatTxt.v}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* DIALOG / NARRATION BOX */}
              <div className="paper-panel rounded-3xl p-6 sm:p-8 relative">
                <span className="absolute -top-3 left-6 px-3 py-0.5 bg-maroon-deep border border-gold text-gold text-xs tracking-[0.3em] rounded-full">
                  BABAK {sceneIdx + 1} / {SCENES.length}
                </span>

                {/* Narration */}
                <div key={`n-${sceneIdx}`} className="animate-narration">
                  <p className="text-beige text-base sm:text-lg leading-relaxed font-serif-display tracking-wide">
                    “{scene.narration}”
                  </p>
                </div>

                {/* Result narration */}
                {phase === "result" && lastChoice && (
                  <div className="mt-5 pt-5 border-t border-gold/30 animate-narration">
                    <p className="text-gold text-xs tracking-[0.3em] mb-2">
                      {lastChoice.good ? "⚔ KEPUTUSAN BIJAK" : "🛡 KEPUTUSAN BERAT"}
                    </p>
                    <p className="text-beige/95 leading-relaxed italic">{lastChoice.result}</p>
                  </div>
                )}

                {/* Prompt + choices */}
                {phase === "choice" && scene.prompt && (
                  <div className="mt-7 animate-narration">
                    <h3 className="font-serif-display text-2xl sm:text-3xl text-gold text-center tracking-wider drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
                      {scene.prompt}
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4 mt-6">
                      {scene.choices.map((c) => {
                        const red =
                          "border-destructive bg-gradient-to-br from-maroon to-maroon-deep text-beige hover:shadow-[0_0_25px_rgba(180,40,40,0.55)]";
                        const gold =
                          "border-gold bg-gradient-to-br from-[oklch(0.5_0.14_60)] to-[oklch(0.35_0.1_50)] text-beige hover:shadow-[0_0_25px_rgba(220,170,60,0.6)] animate-glow-pulse";
                        return (
                          <button
                            key={c.label}
                            onClick={() => pick(c)}
                            className={`group text-left p-4 sm:p-5 rounded-2xl border-2 transition-all hover:scale-[1.02] active:scale-[0.99] ${
                              c.variant === "red" ? red : gold
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <span className="font-serif-display text-3xl text-gold drop-shadow">
                                {c.label}.
                              </span>
                              <span className="font-serif-display text-sm sm:text-base leading-snug pt-1 tracking-wide">
                                {c.text}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Continue button */}
                {phase === "result" && (
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={next}
                      className="px-7 py-3 rounded-full bg-gradient-maroon text-beige font-medium shadow-glow hover:scale-105 transition-transform border border-gold"
                    >
                      Lanjutkan →
                    </button>
                  </div>
                )}
              </div>

              <div className="text-center text-xs text-beige/70 tracking-widest">
                SKOR: <span className="text-gold font-semibold">{score}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
