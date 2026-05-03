import { useEffect, useRef, useState } from "react";

type Vec = { x: number; y: number };
type Artifact = {
  id: string;
  name: string;
  pos: Vec;
  story: string;
  collected: boolean;
  glyph: string;
};
type Patrol = { pos: Vec; dir: 1 | -1; min: number; max: number; axis: "x" | "y"; speed: number };

const TILE = 32;
const COLS = 20;
const ROWS = 14;
const W = COLS * TILE;
const H = ROWS * TILE;

const START: Vec = { x: TILE, y: TILE };

const ARTIFACTS_INIT: Artifact[] = [
  {
    id: "salawaku",
    name: "Parang Salawaku",
    pos: { x: 5 * TILE, y: 10 * TILE },
    glyph: "⚔",
    story:
      "Parang Salawaku — sepasang parang & perisai khas Maluku. Senjata ikonik Kapitan Pattimura saat memimpin perebutan Benteng Duurstede pada Mei 1817.",
    collected: false,
  },
  {
    id: "tombak",
    name: "Tombak Nusalaut",
    pos: { x: 16 * TILE, y: 4 * TILE },
    glyph: "⤣",
    story:
      "Tombak Nusalaut — andalan Martha Christina Tiahahu, gadis pemberani dari Nusalaut yang ikut berperang bersama ayahnya melawan kolonial Belanda.",
    collected: false,
  },
  {
    id: "proklamasi",
    name: "Surat Proklamasi Saparua",
    pos: { x: 10 * TILE, y: 7 * TILE },
    glyph: "✉",
    story:
      "Proklamasi Haria — naskah keluhan & seruan perlawanan rakyat Maluku tahun 1817 yang menjadi dasar moral perjuangan melawan VOC/Belanda.",
    collected: false,
  },
];

const PATROLS_INIT: Patrol[] = [
  { pos: { x: 6 * TILE, y: 4 * TILE }, dir: 1, min: 3 * TILE, max: 14 * TILE, axis: "x", speed: 1.4 },
  { pos: { x: 12 * TILE, y: 9 * TILE }, dir: -1, min: 6 * TILE, max: 17 * TILE, axis: "x", speed: 1.8 },
  { pos: { x: 9 * TILE, y: 11 * TILE }, dir: 1, min: 2 * TILE, max: 12 * TILE, axis: "y", speed: 1.2 },
];

const GATE: Vec = { x: 18 * TILE, y: 12 * TILE };

export function SaparuaGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playerRef = useRef<Vec>({ ...START });
  const keysRef = useRef<Record<string, boolean>>({});
  const patrolsRef = useRef<Patrol[]>(PATROLS_INIT.map((p) => ({ ...p, pos: { ...p.pos } })));
  const artifactsRef = useRef<Artifact[]>(ARTIFACTS_INIT.map((a) => ({ ...a })));
  const tickRef = useRef(0);

  const [, force] = useState(0);
  const [story, setStory] = useState<{ name: string; text: string } | null>(null);
  const [hits, setHits] = useState(0);
  const [won, setWon] = useState(false);
  const [muted, setMuted] = useState(true);
  const audioRef = useRef<{ ctx: AudioContext | null; osc: OscillatorNode | null; gain: GainNode | null }>({
    ctx: null,
    osc: null,
    gain: null,
  });

  // Ambient drum-like loop using WebAudio
  useEffect(() => {
    if (muted) {
      audioRef.current.osc?.stop();
      audioRef.current.ctx?.close();
      audioRef.current = { ctx: null, osc: null, gain: null };
      return;
    }
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const gain = ctx.createGain();
    gain.gain.value = 0.0001;
    gain.connect(ctx.destination);
    let stopped = false;
    const beat = () => {
      if (stopped) return;
      const now = ctx.currentTime;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.setValueAtTime(80, now);
      o.frequency.exponentialRampToValueAtTime(45, now + 0.25);
      g.gain.setValueAtTime(0.25, now);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
      o.connect(g).connect(ctx.destination);
      o.start(now);
      o.stop(now + 0.45);
      setTimeout(beat, 900);
    };
    beat();
    audioRef.current = { ctx, osc: null, gain };
    return () => {
      stopped = true;
      ctx.close();
    };
  }, [muted]);

  // Input
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = true;
      if (["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(e.key.toLowerCase()))
        e.preventDefault();
    };
    const up = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = false;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  // Game loop
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let raf = 0;
    const speed = 2.4;

    const loop = () => {
      tickRef.current++;
      const k = keysRef.current;
      const p = playerRef.current;
      if (!story && !won) {
        if (k["arrowup"] || k["w"]) p.y -= speed;
        if (k["arrowdown"] || k["s"]) p.y += speed;
        if (k["arrowleft"] || k["a"]) p.x -= speed;
        if (k["arrowright"] || k["d"]) p.x += speed;
        p.x = Math.max(8, Math.min(W - 8 - 18, p.x));
        p.y = Math.max(8, Math.min(H - 8 - 18, p.y));

        // patrols
        for (const pt of patrolsRef.current) {
          pt.pos[pt.axis] += pt.dir * pt.speed;
          if (pt.pos[pt.axis] < pt.min) {
            pt.pos[pt.axis] = pt.min;
            pt.dir = 1;
          } else if (pt.pos[pt.axis] > pt.max) {
            pt.pos[pt.axis] = pt.max;
            pt.dir = -1;
          }
          // collision with player
          const dx = pt.pos.x + 14 - (p.x + 9);
          const dy = pt.pos.y + 14 - (p.y + 9);
          if (Math.hypot(dx, dy) < 18) {
            playerRef.current = { ...START };
            setHits((h) => h + 1);
          }
        }

        // artifact pickup
        for (const a of artifactsRef.current) {
          if (a.collected) continue;
          const dx = a.pos.x + 14 - (p.x + 9);
          const dy = a.pos.y + 14 - (p.y + 9);
          if (Math.hypot(dx, dy) < 20) {
            a.collected = true;
            setStory({ name: a.name, text: a.story });
            force((n) => n + 1);
          }
        }

        // gate
        const allDone = artifactsRef.current.every((a) => a.collected);
        if (allDone) {
          const dx = GATE.x + 16 - (p.x + 9);
          const dy = GATE.y + 16 - (p.y + 9);
          if (Math.hypot(dx, dy) < 28) setWon(true);
        }
      }

      // ===== DRAW =====
      // map background — old map / wood
      ctx.fillStyle = "#1a0a08";
      ctx.fillRect(0, 0, W, H);
      // wood grain stripes
      for (let y = 0; y < ROWS; y++) {
        ctx.fillStyle = y % 2 === 0 ? "rgba(74,14,14,0.18)" : "rgba(74,14,14,0.10)";
        ctx.fillRect(0, y * TILE, W, TILE);
      }
      // map vignette
      const grd = ctx.createRadialGradient(W / 2, H / 2, 80, W / 2, H / 2, W / 1.2);
      grd.addColorStop(0, "rgba(212,175,55,0.06)");
      grd.addColorStop(1, "rgba(0,0,0,0.65)");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, W, H);

      // grid hints
      ctx.strokeStyle = "rgba(212,175,55,0.07)";
      ctx.lineWidth = 1;
      for (let x = 0; x <= COLS; x++) {
        ctx.beginPath();
        ctx.moveTo(x * TILE, 0);
        ctx.lineTo(x * TILE, H);
        ctx.stroke();
      }
      for (let y = 0; y <= ROWS; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * TILE);
        ctx.lineTo(W, y * TILE);
        ctx.stroke();
      }

      // gate
      const allDone = artifactsRef.current.every((a) => a.collected);
      ctx.fillStyle = allDone ? "#d4af37" : "#3a1a1a";
      ctx.fillRect(GATE.x, GATE.y, 32, 32);
      ctx.strokeStyle = allDone ? "#fff7c2" : "#5a2424";
      ctx.lineWidth = 2;
      ctx.strokeRect(GATE.x, GATE.y, 32, 32);
      if (allDone) {
        ctx.shadowColor = "#d4af37";
        ctx.shadowBlur = 20 + Math.sin(tickRef.current * 0.1) * 8;
        ctx.strokeRect(GATE.x, GATE.y, 32, 32);
        ctx.shadowBlur = 0;
      }
      ctx.fillStyle = allDone ? "#1a0a08" : "#d4af37";
      ctx.font = "bold 18px serif";
      ctx.textAlign = "center";
      ctx.fillText("⌂", GATE.x + 16, GATE.y + 22);

      // artifacts
      for (const a of artifactsRef.current) {
        if (a.collected) continue;
        const pulse = 4 + Math.sin(tickRef.current * 0.15) * 2;
        ctx.shadowColor = "#d4af37";
        ctx.shadowBlur = pulse * 2;
        ctx.fillStyle = "#d4af37";
        ctx.fillRect(a.pos.x + 4, a.pos.y + 4, 24, 24);
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#1a0a08";
        ctx.font = "bold 18px serif";
        ctx.textAlign = "center";
        ctx.fillText(a.glyph, a.pos.x + 16, a.pos.y + 22);
      }

      // patrols (silhouette)
      for (const pt of patrolsRef.current) {
        ctx.fillStyle = "#000";
        ctx.beginPath();
        ctx.arc(pt.pos.x + 14, pt.pos.y + 14, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#4a0e0e";
        ctx.lineWidth = 2;
        ctx.stroke();
        // eyes
        ctx.fillStyle = "#ff5252";
        ctx.fillRect(pt.pos.x + 10, pt.pos.y + 12, 3, 3);
        ctx.fillRect(pt.pos.x + 16, pt.pos.y + 12, 3, 3);
      }

      // start checkpoint marker
      ctx.strokeStyle = "rgba(212,175,55,0.4)";
      ctx.setLineDash([4, 4]);
      ctx.strokeRect(START.x, START.y, 18, 18);
      ctx.setLineDash([]);

      // player (silhouette scout)
      ctx.fillStyle = "#d4af37";
      ctx.fillRect(p.x, p.y, 18, 18);
      ctx.fillStyle = "#1a0a08";
      ctx.fillRect(p.x + 4, p.y + 4, 4, 4);
      ctx.fillRect(p.x + 10, p.y + 4, 4, 4);

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [story, won]);

  const collected = artifactsRef.current.filter((a) => a.collected).length;

  const restart = () => {
    artifactsRef.current = ARTIFACTS_INIT.map((a) => ({ ...a }));
    patrolsRef.current = PATROLS_INIT.map((p) => ({ ...p, pos: { ...p.pos } }));
    playerRef.current = { ...START };
    setHits(0);
    setWon(false);
    setStory(null);
    force((n) => n + 1);
  };

  return (
    <section className="relative py-12 px-4 sm:px-6 border-t border-border">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-6">
          <p className="text-gold tracking-[0.4em] text-xs mb-2">— SAPARUA 1817 —</p>
          <h2 className="font-serif-display text-3xl sm:text-4xl text-beige">REBELLION</h2>
          <p className="text-beige/70 text-sm mt-2">
            Gunakan <b className="text-gold">WASD</b> / <b className="text-gold">Panah</b> untuk menyelinap.
            Kumpulkan 3 artefak suci, hindari patroli penjajah, lalu menuju gerbang emas.
          </p>
        </div>

        {/* HUD */}
        <div className="flex items-center justify-between gap-4 mb-3 flex-wrap">
          <div className="flex gap-2">
            {artifactsRef.current.map((a) => (
              <div
                key={a.id}
                title={a.name}
                className={`w-12 h-12 rounded-md border-2 flex items-center justify-center text-lg font-bold transition-all ${
                  a.collected
                    ? "border-gold bg-gold/20 text-gold shadow-glow"
                    : "border-border bg-background/60 text-beige/30"
                }`}
              >
                {a.glyph}
              </div>
            ))}
          </div>
          <div className="text-beige/80 text-xs tracking-[0.25em]">
            TERKUMPUL <span className="text-gold">{collected}/3</span> · TERTANGKAP{" "}
            <span className="text-destructive">{hits}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setMuted((m) => !m)}
              className="px-3 py-1.5 rounded-full border border-gold/50 text-gold text-xs hover:bg-gold/10"
            >
              {muted ? "♪ Nyalakan" : "× Diam"}
            </button>
            <button
              onClick={restart}
              className="px-3 py-1.5 rounded-full border border-border text-beige/80 text-xs hover:bg-background/60"
            >
              ⟲ Ulang
            </button>
          </div>
        </div>

        <div
          className="relative mx-auto rounded-xl overflow-hidden border-2 border-gold/60 shadow-glow"
          style={{ width: W, maxWidth: "100%" }}
        >
          <canvas
            ref={canvasRef}
            width={W}
            height={H}
            className="block w-full h-auto"
            style={{ imageRendering: "pixelated", background: "#1a0a08" }}
          />

          {story && (
            <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-6 animate-narration">
              <div className="paper-panel rounded-2xl p-6 max-w-md text-center">
                <p className="text-gold tracking-[0.3em] text-[10px] mb-2">— KILAS BALIK —</p>
                <h3 className="font-serif-display text-2xl text-gold mb-3">{story.name}</h3>
                <p className="text-beige/90 leading-relaxed">{story.text}</p>
                <button
                  onClick={() => setStory(null)}
                  className="mt-5 px-6 py-2 rounded-full bg-gradient-maroon text-beige font-medium border border-gold hover:scale-105 transition-transform"
                >
                  Lanjutkan →
                </button>
              </div>
            </div>
          )}

          {won && (
            <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-6">
              <div className="paper-panel rounded-2xl p-7 max-w-md text-center animate-glow-pulse">
                <p className="text-gold tracking-[0.3em] text-[10px] mb-2">— MISI SELESAI —</p>
                <h3 className="font-serif-display text-3xl text-gold mb-3">SAPARUA BANGKIT</h3>
                <p className="text-beige/90">
                  Tiga pusaka telah disatukan. Semangat perlawanan Maluku 1817 hidup kembali.
                </p>
                <p className="mt-2 text-beige/70 text-sm">Tertangkap: {hits} kali</p>
                <button
                  onClick={restart}
                  className="mt-5 px-7 py-3 rounded-full bg-gradient-maroon text-beige font-bold border border-gold shadow-glow hover:scale-105 transition-transform"
                >
                  ⟲ Main Lagi
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
