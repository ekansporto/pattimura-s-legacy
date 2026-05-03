import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import battleScene from "@/assets/battle-scene.jpg";
import pattimuraImg from "@/assets/pattimura.jpg";

type Phase = "intro" | "scenario" | "result";
type Outcome = "success" | "fail" | null;

const SCENARIO =
  "Belanda mulai mengepung benteng dari segala penjuru. Pasukan mulai kelelahan dan peluru hampir habis. Apa keputusanmu, Kapitan?";

const SUCCESS_TEXT =
  "Strategi hebat! Lewat lebatnya hutan Saparua, kau memukul mundur pasukan musuh dan membakar semangat rakyat Maluku!";

const FAIL_TEXT =
  "Benteng terkepung tanpa jalan keluar. Persediaan habis, satu per satu pejuang gugur. Sejarah mencatat keberanianmu, namun strategi ini tak menyelamatkan pasukan.";

// Tiny click sound via WebAudio (no external file)
function playClick() {
  try {
    const Ctx = (window.AudioContext || (window as any).webkitAudioContext) as typeof AudioContext;
    const ctx = new Ctx();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "triangle";
    o.frequency.setValueAtTime(720, ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(240, ctx.currentTime + 0.08);
    g.gain.setValueAtTime(0.18, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);
    o.connect(g).connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + 0.13);
    setTimeout(() => ctx.close(), 200);
  } catch {
    /* ignore */
  }
}

function useTypewriter(text: string, speed = 28) {
  const [out, setOut] = useState("");
  const [done, setDone] = useState(false);
  const idx = useRef(0);
  useEffect(() => {
    setOut("");
    setDone(false);
    idx.current = 0;
    const id = setInterval(() => {
      idx.current += 1;
      setOut(text.slice(0, idx.current));
      if (idx.current >= text.length) {
        clearInterval(id);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);
  return { out, done };
}

export function MiniGame() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [outcome, setOutcome] = useState<Outcome>(null);

  const dialogText = useMemo(() => {
    if (phase === "scenario") return SCENARIO;
    if (phase === "result") return outcome === "success" ? SUCCESS_TEXT : FAIL_TEXT;
    return "";
  }, [phase, outcome]);

  const { out, done } = useTypewriter(dialogText);

  const choose = (opt: "A" | "B") => {
    playClick();
    setOutcome(opt === "A" ? "success" : "fail");
    setPhase("result");
  };

  const start = () => {
    playClick();
    setPhase("scenario");
    setOutcome(null);
  };

  const reset = () => {
    playClick();
    setPhase("intro");
    setOutcome(null);
  };

  return (
    <section className="relative py-20 px-4 sm:px-6 border-t border-border overflow-hidden">
      {/* Sepia-tinted dramatic background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${battleScene})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "sepia(0.55) saturate(1.1) contrast(1.05) brightness(0.55)",
        }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-b from-maroon-deep/70 via-background/60 to-background pointer-events-none" />

      <div className="relative max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-gold tracking-[0.4em] text-xs mb-3">— INTERACTIVE NARRATIVE —</p>
          <h2 className="font-serif-display text-4xl sm:text-5xl text-beige drop-shadow-2xl">
            The Last Stand
          </h2>
        </div>

        {/* Stage: character + dialog */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-6 items-end">
          {/* Character portrait */}
          <AnimatePresence mode="wait">
            <motion.div
              key={outcome ?? phase}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              className="relative mx-auto md:mx-0"
            >
              <div className="relative w-48 sm:w-56 md:w-full max-w-xs">
                <div className="absolute -inset-2 rounded-3xl bg-gradient-gold opacity-30 blur-xl" />
                <img
                  src={pattimuraImg}
                  alt="Kapitan Pattimura"
                  className="relative rounded-3xl border-2 border-gold shadow-glow w-full object-cover"
                  style={{ filter: "sepia(0.3) contrast(1.05)" }}
                />
                <div className="absolute bottom-2 left-2 right-2 text-center">
                  <span className="inline-block px-3 py-1 rounded-full bg-maroon-deep/80 border border-gold/60 text-gold text-[10px] tracking-[0.3em]">
                    KAPITAN PATTIMURA
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Glassmorphism dialog box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="relative rounded-2xl border border-gold/50 p-6 sm:p-8 backdrop-blur-xl"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.22 0.08 30 / 0.55), oklch(0.18 0.05 40 / 0.35))",
              boxShadow: "0 10px 40px -10px oklch(0.1 0.05 25 / 0.7), inset 0 1px 0 oklch(0.95 0.05 80 / 0.15)",
            }}
          >
            {phase === "intro" && (
              <div className="text-center">
                <p className="text-gold font-serif-display tracking-[0.3em] text-xs mb-3">
                  SAPARUA · 1817
                </p>
                <h3 className="font-serif-display text-2xl sm:text-3xl text-beige">
                  Pertahanan Terakhir
                </h3>
                <p className="text-beige/80 mt-3 leading-relaxed">
                  Ambil peran sebagai Kapitan. Sebuah keputusan akan menentukan nasib rakyat Maluku.
                </p>
                <button
                  onClick={start}
                  className="mt-6 px-8 py-3 rounded-full bg-gradient-maroon text-beige font-bold tracking-wide border border-gold shadow-glow hover:scale-105 transition-transform animate-glow-pulse"
                >
                  ⚔ Mulai Cerita
                </button>
              </div>
            )}

            {phase !== "intro" && (
              <>
                <p className="font-serif-display text-beige text-lg sm:text-xl leading-relaxed min-h-[6rem]">
                  {out}
                  {!done && <span className="inline-block w-2 h-5 bg-gold ml-1 animate-pulse align-middle" />}
                </p>

                {/* Choices */}
                {phase === "scenario" && done && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3"
                  >
                    <ChoiceButton
                      label="A"
                      text="Lakukan serangan kejutan lewat hutan"
                      onClick={() => choose("A")}
                      tone="gold"
                    />
                    <ChoiceButton
                      label="B"
                      text="Tetap bertahan di dalam benteng"
                      onClick={() => choose("B")}
                      tone="maroon"
                    />
                  </motion.div>
                )}

                {/* Result actions */}
                {phase === "result" && done && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-6 flex flex-wrap items-center gap-3"
                  >
                    <span
                      className={`px-3 py-1 rounded-full text-xs tracking-[0.3em] border ${
                        outcome === "success"
                          ? "bg-gold/15 border-gold text-gold"
                          : "bg-maroon-deep/60 border-maroon text-beige/90"
                      }`}
                    >
                      {outcome === "success" ? "STRATEGI BERHASIL" : "STRATEGI GAGAL"}
                    </span>
                    <button
                      onClick={reset}
                      className="ml-auto px-6 py-2.5 rounded-full bg-gradient-maroon text-beige font-medium border border-gold hover:scale-105 transition-transform"
                    >
                      ⟲ Ulangi Cerita
                    </button>
                  </motion.div>
                )}
              </>
            )}
          </motion.div>
        </div>
      </div>

      {/* Success flash + fireworks */}
      <AnimatePresence>
        {phase === "result" && outcome === "success" && <Fireworks />}
      </AnimatePresence>
    </section>
  );
}

function ChoiceButton({
  label,
  text,
  onClick,
  tone,
}: {
  label: string;
  text: string;
  onClick: () => void;
  tone: "gold" | "maroon";
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`group relative text-left p-4 rounded-xl border transition-all overflow-hidden ${
        tone === "gold"
          ? "border-gold/60 bg-gold/5 hover:bg-gold/15"
          : "border-maroon/70 bg-maroon-deep/40 hover:bg-maroon-deep/70"
      }`}
    >
      <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, oklch(0.78 0.14 75 / 0.35), transparent 60%)",
        }}
      />
      <span className="relative font-serif-display text-beige">
        <span className="text-gold mr-2">{label}.</span>
        {text}
      </span>
    </motion.button>
  );
}

function Fireworks() {
  const sparks = Array.from({ length: 18 });
  return (
    <>
      {/* Flash */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.6, 0] }}
        transition={{ duration: 0.8 }}
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(circle at 50% 40%, oklch(0.95 0.14 80 / 0.7), transparent 60%)" }}
      />
      {/* Sparks */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        {sparks.map((_, i) => {
          const angle = (i / sparks.length) * Math.PI * 2;
          const dist = 140 + (i % 3) * 40;
          const x = Math.cos(angle) * dist;
          const y = Math.sin(angle) * dist;
          return (
            <motion.span
              key={i}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{ x, y, opacity: 0, scale: 0.4 }}
              transition={{ duration: 1.1, ease: "easeOut", delay: (i % 6) * 0.04 }}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: i % 2 ? "var(--gold)" : "oklch(0.85 0.18 55)",
                boxShadow: "0 0 12px var(--gold)",
              }}
            />
          );
        })}
      </div>
    </>
  );
}
