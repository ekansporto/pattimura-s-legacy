import { useState } from "react";

type Choice = { text: string; score: number; next: number | "end"; feedback: string };
type Scene = { id: number; narrator: string; dialogue: string; choices: Choice[] };

const scenes: Scene[] = [
  {
    id: 1,
    narrator: "Mei 1817 — Pasukan Belanda mulai mendekati Benteng Duurstede di Saparua.",
    dialogue: "Apa keputusan pertamamu sebagai Kapitan Besar?",
    choices: [
      { text: "Serang langsung tanpa persiapan", score: 0, next: 2, feedback: "Semangatmu besar, tapi pasukan belum siap. Banyak yang gugur sia-sia." },
      { text: "Susun pertahanan & strategi", score: 2, next: 2, feedback: "Tepat! Strategi matang membuat pasukanmu bergerak terorganisir." },
      { text: "Mundur sementara mencari bantuan", score: 1, next: 2, feedback: "Aman, tapi musuh keburu memperkuat posisi. Waktu terbuang." },
    ],
  },
  {
    id: 2,
    narrator: "Benteng Duurstede berhasil direbut. Residen Van den Berg ditawan.",
    dialogue: "Bagaimana kau menyikapi tawanan dan persenjataan musuh?",
    choices: [
      { text: "Bunuh semua tawanan tanpa ampun", score: 0, next: 3, feedback: "Tindakan kejam. Beberapa kapitan lain mulai meragukan kepemimpinanmu." },
      { text: "Negosiasi & kuasai persenjataan", score: 2, next: 3, feedback: "Bijak — kau dapat senjata, mesiu, dan reputasi sebagai pemimpin yang berkehormatan." },
      { text: "Bakar benteng beserta isinya", score: 1, next: 3, feedback: "Musuh memang habis, tapi kau juga kehilangan benteng strategis itu." },
    ],
  },
  {
    id: 3,
    narrator: "Martha Christina Tiahahu, 17 tahun, datang menawarkan diri ikut bertempur.",
    dialogue: "Apa keputusanmu terhadap permintaan Martha?",
    choices: [
      { text: "Tolak — perang bukan untuk perempuan muda", score: 0, next: 4, feedback: "Kau kehilangan satu pejuang paling berani. Sejarah mencatat kekecewaannya." },
      { text: "Terima — beri ia komando di Nusalaut", score: 2, next: 4, feedback: "Tepat! Martha memimpin perempuan Nusalaut, jadi simbol semangat juang." },
      { text: "Terima, tapi tugaskan urusan logistik saja", score: 1, next: 4, feedback: "Aman tapi kurang memanfaatkan keberaniannya yang luar biasa." },
    ],
  },
  {
    id: 4,
    narrator: "Armada bantuan Belanda dari Ambon tiba. Pasukanmu kalah jumlah.",
    dialogue: "Strategi apa yang kau pilih?",
    choices: [
      { text: "Hadapi terbuka di pantai", score: 0, next: 5, feedback: "Berani, tapi pasukanmu hancur dalam pertempuran terbuka." },
      { text: "Perang gerilya dari hutan & bukit", score: 2, next: 5, feedback: "Brilian! Patroli musuh lenyap satu per satu di rimbun pohon Saparua." },
      { text: "Sembunyi di kampung-kampung", score: 1, next: 5, feedback: "Beberapa pasukanmu selamat, tapi kau kehilangan inisiatif." },
    ],
  },
  {
    id: 5,
    narrator: "Pengkhianat membocorkan markasmu. Belanda menawarkan pengampunan.",
    dialogue: "Apa jawaban terakhirmu, Kapitan?",
    choices: [
      { text: "Menyerah demi nyawa pasukan", score: 0, next: "end", feedback: "Kau selamat sesaat, tapi semangat perlawanan padam terlalu cepat." },
      { text: "“Lebih baik mati berkalang tanah daripada hidup dijajah!”", score: 2, next: "end", feedback: "Kata-katamu menggema sepanjang masa. Kau gugur, tapi semangat 1817 abadi." },
      { text: "Pura-pura menerima, lalu kabur diam-diam", score: 1, next: "end", feedback: "Kau lolos, tapi kehormatanmu sebagai Kapitan Besar dipertanyakan." },
    ],
  },
];

export function MiniGame() {
  const [status, setStatus] = useState<"start" | "playing" | "end">("start");
  const [currentScene, setCurrentScene] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  const start = () => {
    setStatus("playing");
    setCurrentScene(0);
    setScore(0);
    setFeedback(null);
  };

  const choose = (c: Choice) => {
    setScore((s) => s + c.score);
    setFeedback(c.feedback);
  };

  const next = () => {
    const scene = scenes[currentScene];
    const lastChoice = scene.choices.find((c) => c.feedback === feedback);
    setFeedback(null);
    if (!lastChoice) return;
    if (lastChoice.next === "end" || currentScene >= scenes.length - 1) {
      setStatus("end");
    } else {
      setCurrentScene(currentScene + 1);
    }
  };

  const maxScore = scenes.length * 2;
  const ending =
    score >= maxScore * 0.8
      ? { title: "Strategi Tepat ⚔", desc: "Kepemimpinanmu cemerlang. Kau layak disebut Kapitan Besar sejati." }
      : score >= maxScore * 0.5
        ? { title: "Cukup Baik 🛡", desc: "Banyak keputusan bijak, walau ada yang berat. Sejarah tetap mengenangmu." }
        : { title: "Perlu Belajar Lagi 📜", desc: "Beberapa pilihanmu merugikan pasukan. Pelajari kembali kisah Pattimura & Martha." };

  return (
    <section className="py-24 px-6 bg-brown-deep/30 border-t border-border">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-gold tracking-[0.3em] text-xs mb-3">— UJI STRATEGIMU —</p>
          <h2 className="font-serif-display text-4xl sm:text-5xl text-beige">The Last Stand</h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
            Simulasi naratif untuk mereview materi. Pilih jalan ceritamu sebagai pemimpin perlawanan.
          </p>
        </div>

        {status === "start" && (
          <div className="paper-panel rounded-3xl p-8 sm:p-10 text-center">
            <p className="text-gold font-serif-display tracking-widest text-sm mb-3">SAPARUA · 1817</p>
            <h3 className="font-serif-display text-2xl text-beige">Pimpin Perlawanan</h3>
            <p className="text-beige/85 mt-3">
              Setiap pilihan menentukan skormu. Tunjukkan strategi terbaikmu sebagai Kapitan.
            </p>
            <button
              onClick={start}
              className="mt-7 px-9 py-3.5 rounded-full bg-gradient-maroon text-beige font-bold tracking-wide shadow-glow hover:scale-105 transition-transform border border-gold animate-glow-pulse"
            >
              ⚔ Mulai Simulasi
            </button>
          </div>
        )}

        {status === "playing" && (
          <div className="paper-panel rounded-3xl p-6 sm:p-8 relative">
            <span className="absolute -top-3 left-6 px-3 py-0.5 bg-maroon-deep border border-gold text-gold text-xs tracking-[0.3em] rounded-full">
              SCENE {currentScene + 1} / {scenes.length}
            </span>
            <div key={`s-${currentScene}`} className="animate-narration">
              <p className="text-beige/80 text-sm italic leading-relaxed">{scenes[currentScene].narrator}</p>
              <h3 className="font-serif-display text-xl sm:text-2xl text-gold mt-4">
                {scenes[currentScene].dialogue}
              </h3>
            </div>

            {!feedback ? (
              <div className="mt-6 space-y-3">
                {scenes[currentScene].choices.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => choose(c)}
                    className="w-full text-left p-4 rounded-xl border border-gold/40 bg-card hover:border-gold hover:bg-card/80 hover:translate-x-1 transition-all text-beige font-serif-display"
                  >
                    <span className="text-gold mr-2">{String.fromCharCode(65 + i)}.</span>
                    {c.text}
                  </button>
                ))}
              </div>
            ) : (
              <div className="mt-6 animate-narration">
                <div className="p-5 rounded-xl bg-maroon-deep/60 border-l-4 border-gold">
                  <p className="text-gold text-xs tracking-[0.3em] mb-2">— KONSEKUENSI —</p>
                  <p className="text-beige/95 italic leading-relaxed">{feedback}</p>
                </div>
                <div className="mt-5 flex justify-between items-center">
                  <span className="text-beige/70 text-sm">
                    Skor: <span className="text-gold font-semibold">{score}</span> / {maxScore}
                  </span>
                  <button
                    onClick={next}
                    className="px-6 py-2.5 rounded-full bg-gradient-maroon text-beige font-medium shadow-glow hover:scale-105 transition-transform border border-gold"
                  >
                    Lanjut →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {status === "end" && (
          <div className="paper-panel rounded-3xl p-8 sm:p-10 text-center animate-narration">
            <p className="text-gold tracking-[0.3em] text-xs">— HASIL SIMULASI —</p>
            <h3 className="font-serif-display text-3xl sm:text-4xl text-beige mt-3">{ending.title}</h3>
            <p className="text-gold mt-4 text-lg">
              Skor: <span className="font-bold">{score}</span> / {maxScore}
            </p>
            <p className="text-beige/90 mt-4 leading-relaxed">{ending.desc}</p>
            <button
              onClick={start}
              className="mt-7 px-8 py-3 rounded-full bg-gradient-maroon text-beige font-medium shadow-glow hover:scale-105 transition-transform border border-gold"
            >
              ⟲ Coba Lagi
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
