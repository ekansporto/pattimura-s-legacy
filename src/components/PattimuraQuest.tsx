import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// ============= Constants =============
const TILE_SIZE = 32;
const MAP_WIDTH = 20;
const MAP_HEIGHT = 15;
const CANVAS_W = MAP_WIDTH * TILE_SIZE;
const CANVAS_H = MAP_HEIGHT * TILE_SIZE;
const SAVE_KEY = "pattimura_quest_v1";

const MAP_RAW: number[][] = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,5,0,0,0,1,0,8,0,0,0,0,8,0,0,0,0,0,1],
  [1,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,4,0,0,1],
  [1,0,0,0,0,0,1,0,0,1,1,2,1,1,0,0,0,0,0,1],
  [1,1,1,2,1,1,1,0,0,1,0,0,0,1,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,1,0,6,0,1,0,1,1,2,1,1],
  [1,0,4,0,0,0,0,0,0,2,0,0,0,2,0,1,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,1,0,0,0,1,0,1,0,4,0,1],
  [1,1,2,1,1,0,0,0,0,1,1,1,1,1,0,1,0,0,0,1],
  [1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,2,0,0,0,1],
  [1,0,8,0,2,0,8,0,0,0,0,0,8,0,0,1,0,0,0,1],
  [1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,1,2,1,1],
  [1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,7,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

const DOOR_POSITIONS: Record<string, number> = {
  "6_3": 0, "3_5": 1, "11_4": 2, "9_7": 3, "13_7": 4,
  "2_9": 5, "4_11": 6, "17_6": 7, "15_10": 8, "17_12": 9,
};
// Doors are open from the start. Exit unlocks after ALL 10 questions answered.
const TOTAL_QUESTIONS = 10;

// ============= Types =============
type Direction = "up" | "down" | "left" | "right";
interface Player { x: number; y: number; facing: Direction; walkFrame: number; walkTimer: number; }
interface DialogStep { speaker: string; text: string; portrait: "pattimura" | "martha" | "system"; }
interface PuzzleData {
  id: number; title: string; subtitle: string; context: string;
  question: string; answers: string[]; correctIndex: number;
  feedbackCorrect: string; feedbackWrong: string;
}
interface GameState {
  player: Player;
  gameStarted: boolean;
  missionStarted: boolean;
  metPattimura: boolean; metMartha: boolean;
  puzzlesAnswered: boolean[]; doorsOpen: boolean[];
  score: number; totalAnswered: number;
  startedAt: number | null; elapsedMs: number;
  exitUnlocked: boolean; gameWon: boolean;
  dialogActive: boolean; currentDialog: DialogStep[] | null; dialogStepIndex: number;
  puzzleActive: boolean; currentPuzzleId: number | null;
  puzzleAnswered: boolean; lastAnswerCorrect: boolean | null; selectedAnswer: number | null;
  hintText: string;
}
type GameAction =
  | { type: "MOVE_PLAYER"; dx: number; dy: number; delta: number }
  | { type: "OPEN_DIALOG"; dialog: DialogStep[]; npc?: "pattimura" | "martha" }
  | { type: "ADVANCE_DIALOG" }
  | { type: "OPEN_PUZZLE"; puzzleId: number }
  | { type: "ANSWER_PUZZLE"; answerIndex: number }
  | { type: "CLOSE_PUZZLE" }
  | { type: "WIN_GAME" }
  | { type: "START_GAME" }
  | { type: "START_MISSION" }
  | { type: "TICK_TIMER"; now: number }
  | { type: "SET_HINT"; text: string }
  | { type: "LOAD_SAVE"; savedState: Partial<GameState> };

// ============= Data =============
const PUZZLES: PuzzleData[] = [
  {
    id: 0,
    title: "Terminal Alpha — Kapitan Pattimura",
    subtitle: "Verifikasi data sejarah untuk membuka akses",
    context:
      "Thomas Matulessy lahir sekitar tahun 1783 di Hualoy, Seram, Maluku. Ia dikenal sebagai Kapitan Pattimura, pemimpin perlawanan rakyat Maluku melawan VOC/Belanda pada tahun 1817. Pattimura memimpin penyerangan terhadap Benteng Duurstede di Saparua. Ia ditangkap dan dihukum gantung pada 16 Desember 1817 di Ambon.",
    question: "Kapan Pattimura memimpin penyerangan terhadap Benteng Duurstede di Saparua?",
    answers: ["A. 14 Maret 1817", "B. 16 Mei 1817", "C. 20 April 1816", "D. 3 Juni 1818"],
    correctIndex: 1,
    feedbackCorrect: "✓ Benar! 16 Mei 1817, Pattimura memimpin pasukan menyerang Benteng Duurstede.",
    feedbackWrong: "✗ Salah. Pelajari kembali konteks di atas dan coba lagi.",
  },
  {
    id: 1,
    title: "Terminal Beta — Latar Belakang Perjuangan",
    subtitle: "Data terenkripsi — jawab untuk mendekripsi",
    context:
      "Pattimura lahir dari keluarga bangsawan Maluku. Sebelum memimpin perlawanan, ia pernah menjadi sersan milisi di bawah pemerintahan Inggris. Ketika Belanda kembali berkuasa dan menerapkan monopoli rempah serta kerja paksa, rakyat Maluku marah dan bersatu.",
    question: "Apa jabatan militer Pattimura sebelum memimpin perlawanan rakyat Maluku?",
    answers: ["A. Mayor Infanteri", "B. Kapten Marinir", "C. Sersan Milisi", "D. Laksamana Angkatan Laut"],
    correctIndex: 2,
    feedbackCorrect: "✓ Tepat! Pattimura adalah Sersan Milisi di bawah pemerintahan Inggris.",
    feedbackWrong: "✗ Kurang tepat. Baca kembali konteks dan coba lagi.",
  },
  {
    id: 2,
    title: "Terminal Gamma — Martha Christina Tiahahu",
    subtitle: "Aktivasi sistem memerlukan data pahlawan wanita",
    context:
      "Martha Christina Tiahahu (1800–1818) adalah pejuang wanita Maluku, putri Kapitan Paulus Tiahahu. Ia ikut berperang bersama ayahnya dalam perlawanan Pattimura 1817 di usia 17 tahun. Setelah ditangkap, ia wafat 2 Januari 1818 di kapal Belanda Eversten karena mogok makan. Jasadnya dibuang ke Laut Banda.",
    question: "Bagaimana Martha Christina Tiahahu wafat?",
    answers: [
      "A. Tewas dalam pertempuran di Saparua",
      "B. Dihukum mati di Ambon bersama Pattimura",
      "C. Wafat di kapal Belanda karena mogok makan",
      "D. Meninggal karena penyakit di penjara Batavia",
    ],
    correctIndex: 2,
    feedbackCorrect: "✓ Benar! Martha wafat 2 Januari 1818 di kapal Belanda karena mogok makan.",
    feedbackWrong: "✗ Belum tepat. Perhatikan konteks di atas dan coba lagi.",
  },
];

PUZZLES.push(
  {
    id: 3,
    title: "Terminal Delta — Benteng Duurstede",
    subtitle: "Identifikasi lokasi pertempuran",
    context: "Benteng Duurstede adalah benteng peninggalan VOC yang terletak di Pulau Saparua, Maluku Tengah. Benteng ini menjadi target utama serangan rakyat Maluku pada 16 Mei 1817 di bawah pimpinan Kapitan Pattimura.",
    question: "Di pulau manakah Benteng Duurstede terletak?",
    answers: ["A. Ambon", "B. Saparua", "C. Seram", "D. Banda"],
    correctIndex: 1,
    feedbackCorrect: "✓ Tepat! Benteng Duurstede ada di Pulau Saparua.",
    feedbackWrong: "✗ Salah. Benteng Duurstede terletak di Saparua.",
  },
  {
    id: 4,
    title: "Terminal Epsilon — Akhir Hidup Pattimura",
    subtitle: "Catat tanggal eksekusi",
    context: "Setelah ditangkap pasukan Belanda, Kapitan Pattimura diadili dan dijatuhi hukuman mati. Ia dihukum gantung di depan Benteng Nieuw Victoria, Ambon, pada 16 Desember 1817.",
    question: "Bagaimana Pattimura menemui akhir hidupnya?",
    answers: [
      "A. Tewas di medan perang Saparua",
      "B. Dihukum gantung di Ambon, 16 Desember 1817",
      "C. Dibuang ke Pulau Banda hingga wafat",
      "D. Ditembak mati di kapal VOC",
    ],
    correctIndex: 1,
    feedbackCorrect: "✓ Benar! Pattimura digantung di Ambon, 16 Desember 1817.",
    feedbackWrong: "✗ Kurang tepat. Ia dihukum gantung di Ambon.",
  },
  {
    id: 5,
    title: "Terminal Zeta — Ayah Martha",
    subtitle: "Verifikasi silsilah pejuang",
    context: "Martha Christina Tiahahu adalah putri Kapitan Paulus Tiahahu, seorang pemimpin perlawanan dari Nusalaut yang juga turut berjuang bersama Pattimura.",
    question: "Siapa nama ayah Martha Christina Tiahahu?",
    answers: ["A. Thomas Matulessy", "B. Kapitan Paulus Tiahahu", "C. Said Perintah", "D. Anthony Rhebok"],
    correctIndex: 1,
    feedbackCorrect: "✓ Tepat! Ayahnya adalah Kapitan Paulus Tiahahu.",
    feedbackWrong: "✗ Salah. Ayah Martha adalah Kapitan Paulus Tiahahu.",
  },
  {
    id: 6,
    title: "Terminal Eta — Senjata Tradisional",
    subtitle: "Identifikasi persenjataan rakyat Maluku",
    context: "Dalam perlawanan 1817, rakyat Maluku menggunakan senjata tradisional khas mereka — parang panjang dan perisai kayu — untuk melawan pasukan VOC yang bersenjata api.",
    question: "Apa nama kombinasi senjata khas Maluku berupa parang dan perisai?",
    answers: ["A. Keris & Tameng", "B. Parang Salawaku", "C. Tombak Cakalele", "D. Mandau & Klewang"],
    correctIndex: 1,
    feedbackCorrect: "✓ Benar! Parang Salawaku adalah senjata khas Maluku.",
    feedbackWrong: "✗ Belum tepat. Jawabannya Parang Salawaku.",
  },
  {
    id: 7,
    title: "Terminal Theta — Asal Daerah Martha",
    subtitle: "Tentukan tanah kelahiran",
    context: "Martha Christina Tiahahu lahir pada 4 Januari 1800 di Desa Abubu, Pulau Nusalaut, Maluku. Ia tumbuh sebagai gadis pemberani yang menolak penjajahan sejak usia muda.",
    question: "Di pulau manakah Martha Christina Tiahahu dilahirkan?",
    answers: ["A. Saparua", "B. Nusalaut", "C. Haruku", "D. Ambon"],
    correctIndex: 1,
    feedbackCorrect: "✓ Benar! Martha lahir di Nusalaut.",
    feedbackWrong: "✗ Salah. Martha lahir di Pulau Nusalaut.",
  },
  {
    id: 8,
    title: "Terminal Iota — Penyebab Perlawanan",
    subtitle: "Analisis akar konflik",
    context: "Kembalinya Belanda ke Maluku pasca-Inggris membawa kebijakan yang menyengsarakan: monopoli rempah, kerja paksa (rodi), pemotongan tunjangan guru, serta pengiriman pemuda Maluku menjadi serdadu di Jawa. Inilah yang memicu perlawanan 1817.",
    question: "Manakah BUKAN penyebab perlawanan rakyat Maluku 1817?",
    answers: [
      "A. Monopoli rempah-rempah oleh Belanda",
      "B. Kerja paksa (rodi)",
      "C. Pemberian tanah luas kepada rakyat",
      "D. Pengiriman pemuda Maluku ke Jawa",
    ],
    correctIndex: 2,
    feedbackCorrect: "✓ Tepat! Belanda justru merampas, bukan memberi tanah.",
    feedbackWrong: "✗ Kurang tepat. Belanda tidak memberi tanah kepada rakyat.",
  },
  {
    id: 9,
    title: "Terminal Kappa — Semboyan Perjuangan",
    subtitle: "Kalimat terakhir sang Kapitan",
    context: "Sebelum dihukum gantung, Kapitan Pattimura mengucapkan kalimat penuh keberanian yang kemudian menjadi semboyan perjuangan rakyat Maluku melawan penjajahan.",
    question: "Apa semboyan terkenal dari Kapitan Pattimura?",
    answers: [
      "A. \"Merdeka atau mati!\"",
      "B. \"Lebih baik mati daripada dijajah!\"",
      "C. \"Bersatu kita teguh!\"",
      "D. \"Maju tak gentar!\"",
    ],
    correctIndex: 1,
    feedbackCorrect: "✓ Benar! \"Lebih baik mati daripada dijajah!\"",
    feedbackWrong: "✗ Salah. Semboyannya: \"Lebih baik mati daripada dijajah!\"",
  },
);

const DIALOGS: Record<string, DialogStep[]> = {
  mission_brief: [
    { speaker: "KAPITAN PATTIMURA", portrait: "pattimura",
      text: "Hai Anak Muda! Aku Thomas Matulessy — Kapitan Pattimura. Kamu terjebak di dunia digital ini." },
    { speaker: "KAPITAN PATTIMURA", portrait: "pattimura",
      text: "Misimu: temukan 3 terminal sejarah (α, β, γ), jawab tantangannya. Tiap jawaban benar membuka pintu menuju portal keluar." },
    { speaker: "SISTEM", portrait: "system",
      text: "✓ Misi diaktifkan! Terminal kini bisa diakses. Ilmu adalah kuncimu." },
  ],
  no_mission: [
    { speaker: "SISTEM", portrait: "system",
      text: "⚠ Selesaikan tugas dulu — bicara dengan Kapitan Pattimura (sosok berbaju merah-emas) untuk memulai misi." },
  ],
  pattimura_intro: [
    { speaker: "KAPITAN PATTIMURA", portrait: "pattimura",
      text: "Hai, Anak Muda! Kamu terjebak di dunia digital ini? Tenang, aku Thomas Matulessy — Kapitan Pattimura. Aku akan membimbingmu keluar." },
    { speaker: "KAPITAN PATTIMURA", portrait: "pattimura",
      text: "Untuk membuka pintu, jawab tantangan sejarah di setiap terminal biru. Ilmu adalah senjata terkuat melawan kebodohan!" },
    { speaker: "KAPITAN PATTIMURA", portrait: "pattimura",
      text: "Temukan 3 terminal di seluruh peta. Jawab dengan benar, pintu-pintu akan terbuka. Pantang menyerah!" },
  ],
  pattimura_revisit: [
    { speaker: "KAPITAN PATTIMURA", portrait: "pattimura",
      text: "Teruskan perjuanganmu! Selesaikan semua terminal sejarahnya." },
  ],
  martha_intro: [
    { speaker: "MARTHA CHRISTINA TIAHAHU", portrait: "martha",
      text: "Halo! Aku Martha. Usiaku 17 tahun saat aku turun ke medan perang bersama Ayah dan Kapitan Pattimura melawan Belanda di Saparua." },
    { speaker: "MARTHA CHRISTINA TIAHAHU", portrait: "martha",
      text: "Perempuan pun bisa berjuang! Selesaikan semua terminal — jalan keluarmu menunggu!" },
  ],
  martha_revisit: [
    { speaker: "MARTHA CHRISTINA TIAHAHU", portrait: "martha",
      text: "Kamu pasti bisa! Terus maju dan temukan semua terminal." },
  ],
  terminal_solved: [
    { speaker: "SISTEM", portrait: "system", text: "✓ Terminal ini sudah berhasil diakses sebelumnya." },
  ],
  exit_locked: [
    { speaker: "SISTEM", portrait: "system", text: "⚠ Portal keluar masih terkunci. Jawab semua 10 pertanyaan terlebih dahulu!" },
  ],
  exit_open: [
    { speaker: "SISTEM", portrait: "system",
      text: "✓ Semua pertanyaan selesai! Portal keluar aktif. Kamu membawa semangat Pattimura & Martha!" },
  ],
  all_done: [
    { speaker: "SISTEM", portrait: "system", text: "✓ Semua pertanyaan sudah dijawab. Menuju portal EXIT (kanan-bawah)!" },
  ],
};

// ============= Helpers =============
function isWalkable(doorsOpen: boolean[], col: number, row: number): boolean {
  if (row < 0 || row >= MAP_HEIGHT || col < 0 || col >= MAP_WIDTH) return false;
  const tile = MAP_RAW[row][col];
  if (tile === 1) return false;
  if (tile === 2) {
    const id = DOOR_POSITIONS[`${col}_${row}`];
    return id !== undefined && doorsOpen[id];
  }
  // NPCs, terminals are blocking
  if (tile === 4 || tile === 5 || tile === 6) return false;
  return true;
}

function formatTime(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(total / 60).toString().padStart(2, "0");
  const s = (total % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

// Lightweight WebAudio SFX — no assets, only triggers after user interaction.
let _audioCtx: AudioContext | null = null;
function getAudioCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    if (!_audioCtx) {
      const Ctor = (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext);
      _audioCtx = new Ctor();
    }
    if (_audioCtx.state === "suspended") void _audioCtx.resume();
    return _audioCtx;
  } catch { return null; }
}
function playSfx(kind: "correct" | "wrong" | "open" | "win") {
  const ctx = getAudioCtx(); if (!ctx) return;
  const now = ctx.currentTime;
  const tone = (freq: number, start: number, dur: number, type: OscillatorType = "sine", vol = 0.18) => {
    const o = ctx.createOscillator(); const g = ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, now + start);
    g.gain.setValueAtTime(0, now + start);
    g.gain.linearRampToValueAtTime(vol, now + start + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, now + start + dur);
    o.connect(g).connect(ctx.destination);
    o.start(now + start); o.stop(now + start + dur + 0.02);
  };
  if (kind === "correct") { tone(660, 0, 0.12, "triangle"); tone(880, 0.1, 0.18, "triangle"); tone(1320, 0.22, 0.22, "triangle"); }
  else if (kind === "wrong") { tone(220, 0, 0.18, "square", 0.14); tone(150, 0.18, 0.28, "square", 0.14); }
  else if (kind === "open") { tone(520, 0, 0.08, "sine", 0.12); }
  else if (kind === "win") { [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.12, 0.22, "triangle")); }
}

// ============= Renderer =============
function drawFloor(ctx: CanvasRenderingContext2D, px: number, py: number) {
  ctx.fillStyle = "#1a1a2e";
  ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
  ctx.fillStyle = "#22223e";
  ctx.fillRect(px, py, 1, 1);
  ctx.fillRect(px + TILE_SIZE - 1, py + TILE_SIZE - 1, 1, 1);
}
function drawWall(ctx: CanvasRenderingContext2D, px: number, py: number) {
  ctx.fillStyle = "#2a1f0e"; ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
  ctx.fillStyle = "#3d2e15"; ctx.fillRect(px + 1, py + 1, TILE_SIZE - 2, TILE_SIZE - 2);
  ctx.fillStyle = "#5a4520";
  for (let bx = 0; bx < 2; bx++) for (let by = 0; by < 2; by++)
    ctx.fillRect(px + 2 + bx * 14, py + 2 + by * 14, 10, 10);
  ctx.fillStyle = "#6a5530";
  ctx.fillRect(px, py, TILE_SIZE, 2); ctx.fillRect(px, py, 2, TILE_SIZE);
}
function drawDoor(ctx: CanvasRenderingContext2D, px: number, py: number, open: boolean) {
  drawFloor(ctx, px, py);
  if (open) {
    ctx.fillStyle = "#3d2000"; ctx.fillRect(px + 4, py + 2, 3, TILE_SIZE - 4);
    ctx.fillStyle = "#4caf50";
    ctx.fillRect(px, py, TILE_SIZE, 2); ctx.fillRect(px, py + TILE_SIZE - 2, TILE_SIZE, 2);
  } else {
    ctx.fillStyle = "#8B4513"; ctx.fillRect(px + 4, py + 2, TILE_SIZE - 8, TILE_SIZE - 4);
    ctx.fillStyle = "#A0522D"; ctx.fillRect(px + 4, py + 2, TILE_SIZE - 8, 4);
    ctx.fillStyle = "#FFD700"; ctx.fillRect(px + TILE_SIZE / 2 - 2, py + TILE_SIZE / 2 - 2, 5, 5);
    ctx.fillStyle = "#cc0000";
    ctx.fillRect(px, py, TILE_SIZE, 2); ctx.fillRect(px, py + TILE_SIZE - 2, TILE_SIZE, 2);
  }
}
function drawTerminal(ctx: CanvasRenderingContext2D, px: number, py: number, solved: boolean) {
  drawFloor(ctx, px, py);
  ctx.fillStyle = solved ? "#003322" : "#003366";
  ctx.fillRect(px + 4, py + 4, TILE_SIZE - 8, TILE_SIZE - 10);
  const blink = Math.floor(Date.now() / 500) % 2;
  ctx.fillStyle = solved ? "#00ff88" : blink ? "#00ffff" : "#00aacc";
  ctx.fillRect(px + 6, py + 10, TILE_SIZE - 12, 2);
  ctx.fillRect(px + 6, py + 14, TILE_SIZE - 16, 2);
  ctx.fillStyle = solved ? "#007744" : "#0088cc";
  ctx.fillRect(px + 8, py + TILE_SIZE - 8, TILE_SIZE - 16, 4);
}
function drawPattimura(ctx: CanvasRenderingContext2D, px: number, py: number) {
  drawFloor(ctx, px, py);
  ctx.fillStyle = "#8B0000"; ctx.fillRect(px + 8, py + 14, 16, 12);
  ctx.fillStyle = "#DAA520"; ctx.fillRect(px + 8, py + 14, 16, 4);
  ctx.fillStyle = "#8B6914"; ctx.fillRect(px + 11, py + 6, 10, 10);
  ctx.fillStyle = "#1a0a0a"; ctx.fillRect(px + 13, py + 9, 2, 2); ctx.fillRect(px + 17, py + 9, 2, 2);
  ctx.fillStyle = "#2c1810"; ctx.fillRect(px + 10, py + 4, 12, 5); ctx.fillRect(px + 9, py + 6, 14, 2);
  ctx.fillStyle = "#4a1a00"; ctx.fillRect(px + 10, py + 26, 4, 4); ctx.fillRect(px + 18, py + 26, 4, 4);
}
function drawMartha(ctx: CanvasRenderingContext2D, px: number, py: number) {
  drawFloor(ctx, px, py);
  ctx.fillStyle = "#cc3300"; ctx.fillRect(px + 8, py + 14, 16, 12);
  ctx.fillStyle = "#c8a227"; ctx.fillRect(px + 8, py + 14, 16, 3); ctx.fillRect(px + 9, py + 25, 14, 3);
  ctx.fillStyle = "#8B6914"; ctx.fillRect(px + 11, py + 7, 10, 9);
  ctx.fillStyle = "#1a0a0a";
  ctx.fillRect(px + 13, py + 10, 2, 2); ctx.fillRect(px + 17, py + 10, 2, 2);
  ctx.fillRect(px + 11, py + 5, 10, 5); ctx.fillRect(px + 9, py + 8, 3, 8); ctx.fillRect(px + 20, py + 8, 3, 8);
  ctx.fillStyle = "#4a1a00"; ctx.fillRect(px + 10, py + 26, 4, 4); ctx.fillRect(px + 18, py + 26, 4, 4);
}
function drawExit(ctx: CanvasRenderingContext2D, px: number, py: number, unlocked: boolean) {
  drawFloor(ctx, px, py);
  const pulse = 0.5 + 0.5 * Math.sin(Date.now() / 300);
  ctx.fillStyle = unlocked ? `rgba(200,162,39,${0.2 + pulse * 0.3})` : "rgba(60,60,60,0.4)";
  ctx.fillRect(px + 2, py + 2, TILE_SIZE - 4, TILE_SIZE - 4);
  ctx.strokeStyle = unlocked ? "#ffd700" : "#444"; ctx.lineWidth = 2;
  ctx.strokeRect(px + 2, py + 2, TILE_SIZE - 4, TILE_SIZE - 4);
  ctx.fillStyle = unlocked ? "#ffd700" : "#555";
  ctx.font = "bold 11px monospace"; ctx.textAlign = "center";
  ctx.fillText("EXIT", px + TILE_SIZE / 2, py + TILE_SIZE / 2 + 4);
}
function drawDecor(ctx: CanvasRenderingContext2D, px: number, py: number) {
  drawFloor(ctx, px, py);
  ctx.fillStyle = "#1a3a1a"; ctx.fillRect(px + 8, py + 16, 4, 12);
  ctx.fillStyle = "#1a5a1a"; ctx.fillRect(px + 6, py + 8, 8, 12);
  ctx.fillStyle = "#2a7a2a"; ctx.fillRect(px + 8, py + 4, 6, 8);
  ctx.fillStyle = "#c8a227"; ctx.fillRect(px + 14, py + 20, 3, 3);
}
function drawPlayer(ctx: CanvasRenderingContext2D, px: number, py: number, walkFrame: number) {
  const leg = walkFrame === 0 ? 0 : 3;
  ctx.fillStyle = "#cc3300"; ctx.fillRect(px + 10, py + 14, 12, 10);
  ctx.fillStyle = "#003399"; ctx.fillRect(px + 10, py + 22, 5, 6); ctx.fillRect(px + 17, py + 22, 5, 6);
  ctx.fillStyle = "#FDBCB4"; ctx.fillRect(px + 11, py + 6, 10, 10);
  ctx.fillStyle = "#1a0a0a";
  ctx.fillRect(px + 13, py + 9, 2, 2); ctx.fillRect(px + 17, py + 9, 2, 2);
  ctx.fillRect(px + 11, py + 5, 10, 4);
  ctx.fillStyle = "#003399";
  ctx.fillRect(px + 10, py + 26 + leg, 4, 4); ctx.fillRect(px + 18, py + 26 - leg, 4, 4);
}

function renderFrame(ctx: CanvasRenderingContext2D, state: GameState) {
  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
  for (let row = 0; row < MAP_HEIGHT; row++) {
    for (let col = 0; col < MAP_WIDTH; col++) {
      const px = col * TILE_SIZE; const py = row * TILE_SIZE;
      const tile = MAP_RAW[row][col];
      const key = `${col}_${row}`;
      switch (tile) {
        case 0: drawFloor(ctx, px, py); break;
        case 1: drawWall(ctx, px, py); break;
        case 2: {
          const id = DOOR_POSITIONS[key];
          drawDoor(ctx, px, py, id !== undefined && state.doorsOpen[id]);
          break;
        }
        case 4: {
          drawTerminal(ctx, px, py, state.totalAnswered >= TOTAL_QUESTIONS);
          break;
        }
        case 5: drawPattimura(ctx, px, py); break;
        case 6: drawMartha(ctx, px, py); break;
        case 7: drawExit(ctx, px, py, state.exitUnlocked); break;
        case 8: drawDecor(ctx, px, py); break;
        default: drawFloor(ctx, px, py);
      }
    }
  }
  drawPlayer(ctx, Math.round(state.player.x * TILE_SIZE), Math.round(state.player.y * TILE_SIZE), state.player.walkFrame);
}

// ============= Reducer =============
const initialState: GameState = {
  player: { x: 1, y: 1, facing: "down", walkFrame: 0, walkTimer: 0 },
  gameStarted: false,
  missionStarted: false,
  metPattimura: false, metMartha: false,
  puzzlesAnswered: Array(TOTAL_QUESTIONS).fill(false),
  score: 0, totalAnswered: 0,
  startedAt: null, elapsedMs: 0,
  doorsOpen: [true, true, true, true, true, true, true, true, true, true],
  exitUnlocked: false, gameWon: false,
  dialogActive: false, currentDialog: null, dialogStepIndex: 0,
  puzzleActive: false, currentPuzzleId: null,
  puzzleAnswered: false, lastAnswerCorrect: null, selectedAnswer: null,
  hintText: "WASD / Panah = Gerak  |  E / Spasi = Interaksi",
};

function reducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "MOVE_PLAYER": {
      const nx = state.player.x + action.dx;
      const ny = state.player.y + action.dy;
      // collision: check tile at center
      const checkCol = Math.round(nx);
      const checkRow = Math.round(ny);
      if (!isWalkable(state.doorsOpen, checkCol, checkRow)) return state;
      let facing: Direction = state.player.facing;
      if (Math.abs(action.dx) > Math.abs(action.dy)) {
        facing = action.dx > 0 ? "right" : "left";
      } else if (action.dy !== 0) {
        facing = action.dy > 0 ? "down" : "up";
      }
      const newTimer = state.player.walkTimer + action.delta;
      let frame = state.player.walkFrame;
      let timer = newTimer;
      if (newTimer > 200) { frame = frame === 0 ? 1 : 0; timer = 0; }
      return { ...state, player: { x: nx, y: ny, facing, walkFrame: frame, walkTimer: timer } };
    }
    case "OPEN_DIALOG":
      return {
        ...state, dialogActive: true,
        currentDialog: action.dialog, dialogStepIndex: 0,
        metPattimura: action.npc === "pattimura" ? true : state.metPattimura,
        metMartha: action.npc === "martha" ? true : state.metMartha,
      };
    case "ADVANCE_DIALOG": {
      const next = state.dialogStepIndex + 1;
      if (!state.currentDialog || next >= state.currentDialog.length)
        return { ...state, dialogActive: false, currentDialog: null, dialogStepIndex: 0 };
      return { ...state, dialogStepIndex: next };
    }
    case "OPEN_PUZZLE":
      return { ...state, puzzleActive: true, currentPuzzleId: action.puzzleId, puzzleAnswered: false, lastAnswerCorrect: null, selectedAnswer: null };
    case "ANSWER_PUZZLE": {
      if (state.currentPuzzleId === null) return state;
      const p = PUZZLES[state.currentPuzzleId];
      if (state.puzzleAnswered) return state;
      const correct = action.answerIndex === p.correctIndex;
      const newAnswered = [...state.puzzlesAnswered];
      const wasAnswered = newAnswered[state.currentPuzzleId];
      newAnswered[state.currentPuzzleId] = true;
      const newTotal = wasAnswered ? state.totalAnswered : state.totalAnswered + 1;
      const newScore = correct && !wasAnswered ? state.score + 1 : state.score;
      return {
        ...state,
        puzzleAnswered: true,
        lastAnswerCorrect: correct,
        selectedAnswer: action.answerIndex,
        puzzlesAnswered: newAnswered,
        totalAnswered: newTotal,
        score: newScore,
        exitUnlocked: newTotal >= TOTAL_QUESTIONS,
      };
    }
    case "CLOSE_PUZZLE":
      return { ...state, puzzleActive: false, currentPuzzleId: null, puzzleAnswered: false, lastAnswerCorrect: null, selectedAnswer: null };
    case "WIN_GAME":
      return { ...state, gameWon: true };
    case "START_GAME":
      return { ...state, gameStarted: true, startedAt: state.startedAt ?? Date.now() };
    case "START_MISSION":
      return { ...state, missionStarted: true, metPattimura: true };
    case "TICK_TIMER":
      if (!state.startedAt || state.gameWon) return state;
      return { ...state, elapsedMs: action.now - state.startedAt };
    case "SET_HINT":
      return { ...state, hintText: action.text };
    case "LOAD_SAVE":
      return { ...state, ...action.savedState };
    default: return state;
  }
}

// ============= Component =============
export function PattimuraQuest() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [state, dispatch] = useReducer(reducer, initialState);
  const stateRef = useRef(state); stateRef.current = state;
  const keysRef = useRef<Set<string>>(new Set());
  const lastTimeRef = useRef(0);

  // Load save
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (raw) dispatch({ type: "LOAD_SAVE", savedState: JSON.parse(raw) });
    } catch {}
  }, []);

  // Auto-save
  useEffect(() => {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify({
        gameStarted: state.gameStarted, missionStarted: state.missionStarted,
        metPattimura: state.metPattimura, metMartha: state.metMartha,
        puzzlesAnswered: state.puzzlesAnswered, doorsOpen: state.doorsOpen,
        score: state.score, totalAnswered: state.totalAnswered,
        startedAt: state.startedAt, elapsedMs: state.elapsedMs,
        exitUnlocked: state.exitUnlocked, player: state.player,
      }));
    } catch {}
  }, [state.gameStarted, state.missionStarted, state.metPattimura, state.metMartha, state.puzzlesAnswered, state.doorsOpen, state.score, state.totalAnswered, state.exitUnlocked, state.player]);

  const handleInteract = useCallback(() => {
    const s = stateRef.current;
    if (s.gameWon) return;
    if (s.dialogActive) { dispatch({ type: "ADVANCE_DIALOG" }); return; }
    if (s.puzzleActive) return;
    const { x, y, facing } = s.player;
    const px = Math.round(x), py = Math.round(y);
    const tx = facing === "left" ? px - 1 : facing === "right" ? px + 1 : px;
    const ty = facing === "up" ? py - 1 : facing === "down" ? py + 1 : py;
    const tile = MAP_RAW[ty]?.[tx];
    const key = `${tx}_${ty}`;
    if (tile === 5) {
      if (!s.missionStarted) {
        dispatch({ type: "START_MISSION" });
        dispatch({ type: "OPEN_DIALOG", dialog: DIALOGS.mission_brief, npc: "pattimura" });
      } else {
        dispatch({ type: "OPEN_DIALOG", dialog: s.metPattimura ? DIALOGS.pattimura_revisit : DIALOGS.pattimura_intro, npc: "pattimura" });
      }
      return;
    }
    if (tile === 6) {
      dispatch({ type: "OPEN_DIALOG", dialog: s.metMartha ? DIALOGS.martha_revisit : DIALOGS.martha_intro, npc: "martha" });
      return;
    }
    if (tile === 4) {
      if (!s.missionStarted) { dispatch({ type: "OPEN_DIALOG", dialog: DIALOGS.no_mission }); return; }
      void key;
      const nextId = s.puzzlesAnswered.findIndex((a) => !a);
      if (nextId === -1) {
        dispatch({ type: "OPEN_DIALOG", dialog: DIALOGS.all_done });
        return;
      }
      playSfx("open");
      dispatch({ type: "OPEN_PUZZLE", puzzleId: nextId });
      return;
    }
    if (tile === 7) {
      if (!s.exitUnlocked) { dispatch({ type: "OPEN_DIALOG", dialog: DIALOGS.exit_locked }); return; }
      dispatch({ type: "OPEN_DIALOG", dialog: DIALOGS.exit_open });
      setTimeout(() => dispatch({ type: "WIN_GAME" }), 2500);
    }
  }, []);

  // Keyboard
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      keysRef.current.add(k);
      if (["arrowup","arrowdown","arrowleft","arrowright"," "].includes(k)) e.preventDefault();
      if (k === "e" || k === " " || k === "enter") handleInteract();
    };
    const up = (e: KeyboardEvent) => { keysRef.current.delete(e.key.toLowerCase()); };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [handleInteract]);

  // Timer tick
  useEffect(() => {
    if (!state.gameStarted || state.gameWon) return;
    const id = setInterval(() => dispatch({ type: "TICK_TIMER", now: Date.now() }), 500);
    return () => clearInterval(id);
  }, [state.gameStarted, state.gameWon]);

  // Sound on answer
  useEffect(() => {
    if (state.lastAnswerCorrect === null) return;
    playSfx(state.lastAnswerCorrect ? "correct" : "wrong");
  }, [state.lastAnswerCorrect, state.totalAnswered]);

  // Sound on win
  useEffect(() => { if (state.gameWon) playSfx("win"); }, [state.gameWon]);

  // Game loop
  useEffect(() => {
    let raf = 0;
    const loop = (ts: number) => {
      const delta = lastTimeRef.current ? ts - lastTimeRef.current : 16;
      lastTimeRef.current = ts;
      const s = stateRef.current;
      if (s.gameStarted && !s.dialogActive && !s.puzzleActive && !s.gameWon) {
        const speed = 4 / 1000;
        const k = keysRef.current;
        let dx = 0, dy = 0;
        if (k.has("arrowleft") || k.has("a")) dx = -speed * delta;
        if (k.has("arrowright") || k.has("d")) dx = speed * delta;
        if (k.has("arrowup") || k.has("w")) dy = -speed * delta;
        if (k.has("arrowdown") || k.has("s")) dy = speed * delta;
        if (dx !== 0) dispatch({ type: "MOVE_PLAYER", dx, dy: 0, delta });
        if (dy !== 0) dispatch({ type: "MOVE_PLAYER", dx: 0, dy, delta });
        // Auto-win when stepping on exit tile
        const pCol = Math.round(s.player.x);
        const pRow = Math.round(s.player.y);
        if (s.exitUnlocked && MAP_RAW[pRow]?.[pCol] === 7) {
          dispatch({ type: "WIN_GAME" });
        }
      }
      const c = canvasRef.current; if (c) { const ctx = c.getContext("2d"); if (ctx) renderFrame(ctx, s); }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Mobile dpad
  const press = (k: string) => () => keysRef.current.add(k);
  const release = (k: string) => () => keysRef.current.delete(k);

  const currentStep = state.dialogActive && state.currentDialog ? state.currentDialog[state.dialogStepIndex] : null;
  const currentPuzzle = state.currentPuzzleId !== null ? PUZZLES[state.currentPuzzleId] : null;

  const reset = () => {
    localStorage.removeItem(SAVE_KEY);
    window.location.reload();
  };

  return (
    <section className="py-12 px-4 sm:px-6 border-t border-border">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-6">
          <p className="text-gold tracking-[0.4em] text-xs mb-2">— PATTIMURA QUEST —</p>
          <h2 className="font-serif-display text-3xl sm:text-4xl text-beige">Escape From Digital World</h2>
          <p className="text-beige/70 text-sm mt-2">
            {!state.missionStarted
              ? "🎯 Cari Kapitan Pattimura (sosok merah-emas) dan tekan E untuk memulai misi"
              : state.exitUnlocked
              ? "✓ Semua pertanyaan selesai — menuju portal EXIT (kanan-bawah)"
              : `Misi aktif: jawab ${TOTAL_QUESTIONS} pertanyaan di terminal sejarah`}
          </p>
        </div>

        {/* HUD */}
        <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
          <div className="flex flex-wrap gap-2">
            <div className="px-3 py-1.5 rounded-md border border-gold bg-gold/10 text-gold text-xs font-mono tracking-wider">
              ⭐ SCORE: {state.score} / {state.totalAnswered}
            </div>
            <div className="px-3 py-1.5 rounded-md border border-border bg-background/60 text-beige text-xs font-mono tracking-wider">
              📋 {state.totalAnswered} / {TOTAL_QUESTIONS} DIJAWAB
            </div>
            <div className="px-3 py-1.5 rounded-md border border-border bg-background/60 text-beige text-xs font-mono tracking-wider">
              ⏱ {formatTime(state.elapsedMs)}
            </div>
          </div>
          <button onClick={reset} className="px-3 py-1.5 rounded-full border border-border text-beige/80 text-xs hover:bg-background/60">
            ⟲ Reset
          </button>
        </div>

        {/* Canvas */}
        <div className="relative mx-auto rounded-xl overflow-hidden border-2 border-gold/60 shadow-glow bg-black"
             style={{ width: CANVAS_W, maxWidth: "100%" }}>
          <canvas
            ref={canvasRef}
            width={CANVAS_W}
            height={CANVAS_H}
            className="block w-full h-auto"
            style={{ imageRendering: "pixelated" }}
          />

          {/* Intro overlay */}
          <AnimatePresence>
            {!state.gameStarted && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/90 flex items-center justify-center p-4 text-center"
              >
                <div className="max-w-md">
                  <p className="text-gold tracking-[0.4em] text-xs mb-3">— MISI BARU —</p>
                  <h3 className="font-serif-display text-2xl sm:text-3xl text-beige mb-3">
                    Terjebak di Dunia Digital
                  </h3>
                  <p className="text-beige/80 text-sm leading-relaxed mb-5">
                    Kamu terbangun di sebuah ruangan asing. Pintu-pintu terkunci.
                    Carilah <span className="text-gold font-semibold">Kapitan Pattimura</span> di
                    pojok kiri-atas peta dan tekan <kbd className="px-1.5 py-0.5 bg-gold/20 border border-gold/50 rounded text-gold text-xs">E</kbd> untuk
                    menerima misi.
                  </p>
                  <button
                    onClick={() => dispatch({ type: "START_GAME" })}
                    className="bg-gradient-gold text-maroon-deep font-bold px-8 py-3 rounded-full tracking-widest uppercase text-sm hover:scale-105 transition-transform"
                  >
                    ► Mulai Petualangan
                  </button>
                  <p className="text-beige/50 text-[10px] mt-4 tracking-wider">
                    WASD/Panah = gerak · E/Spasi = interaksi
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Dialog */}
          <AnimatePresence>
            {currentStep && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                className="absolute inset-x-0 bottom-0 p-3 sm:p-4"
              >
                <DialogBox step={currentStep} onContinue={() => dispatch({ type: "ADVANCE_DIALOG" })} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Puzzle */}
          <AnimatePresence>
            {currentPuzzle && state.puzzleActive && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
              >
                <PuzzleOverlay
                  puzzle={currentPuzzle}
                  answered={state.puzzleAnswered}
                  lastAnswerCorrect={state.lastAnswerCorrect}
                  selectedAnswer={state.selectedAnswer}
                  onAnswer={(i) => dispatch({ type: "ANSWER_PUZZLE", answerIndex: i })}
                  onClose={() => dispatch({ type: "CLOSE_PUZZLE" })}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Win */}
          <AnimatePresence>
            {state.gameWon && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/90 flex items-center justify-center p-4 text-center"
              >
                <div>
                  <motion.h3
                    initial={{ y: -20 }} animate={{ y: 0 }}
                    className="font-serif-display text-3xl sm:text-5xl text-gold mb-4"
                  >🏆 MISI SELESAI!</motion.h3>
                  <p className="text-beige mb-2">Kamu berhasil keluar dari dunia digital</p>
                  <p className="text-beige mb-2">dengan membawa semangat perjuangan</p>
                  <p className="text-gold font-bold text-lg mb-4">Pattimura & Martha Christina Tiahahu</p>
                  <div className="flex flex-wrap gap-3 justify-center mb-5">
                    <div className="px-4 py-2 rounded-lg border border-gold bg-gold/10 text-gold font-mono">
                      ⭐ Skor: <span className="font-bold">{state.score} / {TOTAL_QUESTIONS}</span>
                    </div>
                    <div className="px-4 py-2 rounded-lg border border-border bg-background/60 text-beige font-mono">
                      ⏱ Waktu: <span className="font-bold">{formatTime(state.elapsedMs)}</span>
                    </div>
                  </div>
                  <p className="italic text-beige/80 mb-6">"Lebih baik mati daripada dijajah!"</p>
                  <button onClick={reset}
                    className="bg-gradient-gold text-maroon-deep font-bold px-8 py-3 rounded-full tracking-widest uppercase text-sm hover:scale-105 transition-transform">
                    ↺ Main Lagi
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile D-Pad */}
        <div className="mt-6 flex md:hidden items-center justify-between">
          <div className="grid grid-cols-3 gap-1 w-40">
            <div></div>
            <button onTouchStart={press("arrowup")} onTouchEnd={release("arrowup")} className="bg-card border border-border rounded p-3 text-beige active:bg-gold/20">▲</button>
            <div></div>
            <button onTouchStart={press("arrowleft")} onTouchEnd={release("arrowleft")} className="bg-card border border-border rounded p-3 text-beige active:bg-gold/20">◀</button>
            <div></div>
            <button onTouchStart={press("arrowright")} onTouchEnd={release("arrowright")} className="bg-card border border-border rounded p-3 text-beige active:bg-gold/20">▶</button>
            <div></div>
            <button onTouchStart={press("arrowdown")} onTouchEnd={release("arrowdown")} className="bg-card border border-border rounded p-3 text-beige active:bg-gold/20">▼</button>
            <div></div>
          </div>
          <button onClick={handleInteract} className="bg-gradient-maroon border border-gold text-beige font-bold px-6 py-6 rounded-full">E</button>
        </div>
      </div>
    </section>
  );
}

// ============= Subcomponents =============
function DialogBox({ step, onContinue }: { step: DialogStep; onContinue: () => void }) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    setDisplayed("");
    let i = 0;
    const t = setInterval(() => {
      i++;
      setDisplayed(step.text.slice(0, i));
      if (i >= step.text.length) clearInterval(t);
    }, 22);
    return () => clearInterval(t);
  }, [step]);
  const initials = step.portrait === "pattimura" ? "PM" : step.portrait === "martha" ? "MC" : "SYS";
  const portraitColor = step.portrait === "pattimura" ? "bg-[#8B0000]" : step.portrait === "martha" ? "bg-[#cc3300]" : "bg-[#003366]";
  return (
    <div className="bg-black/90 border-2 border-gold rounded-xl p-3 sm:p-4 backdrop-blur cursor-pointer" onClick={onContinue}>
      <div className="flex gap-3">
        <div className={`w-14 h-14 sm:w-16 sm:h-16 ${portraitColor} border-2 border-gold rounded-md flex items-center justify-center font-bold text-beige text-sm shrink-0`}>
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-gold tracking-wider text-xs font-bold mb-1">{step.speaker}</p>
          <p className="text-beige text-sm leading-relaxed">{displayed}<span className="animate-pulse">|</span></p>
          <p className="text-beige/50 text-[10px] mt-1 tracking-widest">[ Tekan E / Klik untuk lanjut ]</p>
        </div>
      </div>
    </div>
  );
}

function PuzzleOverlay({ puzzle, answered, lastAnswerCorrect, selectedAnswer, onAnswer, onClose }: {
  puzzle: PuzzleData; answered: boolean; lastAnswerCorrect: boolean | null; selectedAnswer: number | null;
  onAnswer: (i: number) => void; onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
      className="bg-[#0a0a1a] border-2 border-gold rounded-xl p-4 sm:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
    >
      <h3 className="font-serif-display text-xl sm:text-2xl text-gold">{puzzle.title}</h3>
      <p className="text-beige/60 text-xs tracking-wider mb-4">{puzzle.subtitle}</p>
      <div className="bg-black/40 border border-gold/30 rounded p-3 mb-4">
        <p className="text-gold text-xs mb-2 font-bold">📜 DATA SEJARAH</p>
        <p className="text-beige/90 text-sm leading-relaxed">{puzzle.context}</p>
      </div>
      <p className="text-beige font-semibold mb-3">{puzzle.question}</p>
      <div className="space-y-2 mb-4">
        {puzzle.answers.map((ans, i) => {
          const isSel = selectedAnswer === i;
          const isCorrectAns = i === puzzle.correctIndex;
          let cls = "w-full text-left px-4 py-3 rounded-lg text-sm border font-mono transition-all ";
          if (answered && isCorrectAns) cls += "bg-[#1a3a1a] border-[#4caf50] text-[#4caf50]";
          else if (answered && isSel && !isCorrectAns) cls += "bg-[#3a1a1a] border-[#e53935] text-[#e53935]";
          else if (answered) cls += "bg-[#0a1a2e]/40 border-border text-beige/40";
          else cls += "bg-[#0a1a2e] border-[#3a6e8c] text-beige hover:border-gold hover:bg-[#1a2e42]";
          return (
            <motion.button key={i}
              whileHover={!answered ? { scale: 1.01 } : {}} whileTap={!answered ? { scale: 0.99 } : {}}
              disabled={answered} onClick={() => !answered && onAnswer(i)} className={cls}>
              {ans}
            </motion.button>
          );
        })}
      </div>
      <AnimatePresence>
        {answered && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className={`p-3 rounded-lg text-sm mb-3 ${lastAnswerCorrect ? "bg-[#1a3a1a] text-[#7fffa3]" : "bg-[#3a1a1a] text-[#ff9999]"}`}>
            {lastAnswerCorrect ? puzzle.feedbackCorrect : puzzle.feedbackWrong}
          </motion.div>
        )}
      </AnimatePresence>
      {answered && (
        <button onClick={onClose}
          className="w-full bg-gradient-gold text-maroon-deep font-bold py-3 rounded-lg tracking-wider hover:scale-[1.01] transition-transform">
          Lanjutkan ►
        </button>
      )}
    </motion.div>
  );
}