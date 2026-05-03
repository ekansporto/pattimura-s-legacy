import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { PattimuraQuest } from "@/components/PattimuraQuest";
import battleScene from "@/assets/battle-scene.jpg";

export const Route = createFileRoute("/kuis")({
  head: () => ({
    meta: [
      { title: "The Last Stand — Simulasi Strategi Pahlawan Maluku" },
      {
        name: "description",
        content:
          "Mini game interactive story untuk mereview materi sejarah perjuangan Pattimura & Martha Christina Tiahahu.",
      },
      { property: "og:title", content: "The Last Stand: Uji Strategimu" },
      { property: "og:description", content: "Simulasi naratif perlawanan rakyat Maluku 1817." },
      { property: "og:image", content: battleScene },
      { name: "twitter:image", content: battleScene },
    ],
  }),
  component: KuisPage,
});

function KuisPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url(${battleScene})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-maroon-deep/80 via-background/80 to-background" />
        <div className="relative max-w-4xl mx-auto px-6 py-20 text-center">
          <p className="text-gold tracking-[0.4em] text-xs mb-4">— REVIEW MATERI —</p>
          <h1 className="font-serif-display text-4xl sm:text-6xl text-beige drop-shadow-2xl">
            The Last Stand
          </h1>
          <p className="mt-5 text-beige/85 text-lg max-w-2xl mx-auto">
            Simulasi naratif singkat — uji pemahamanmu tentang strategi perlawanan rakyat Maluku 1817.
          </p>
        </div>
      </section>

      <PattimuraQuest />

      <section className="py-12 px-6 text-center">
        <Link
          to="/"
          className="inline-block px-7 py-3 rounded-full border border-gold/60 text-gold font-medium hover:bg-gold/10 transition-colors"
        >
          ← Kembali ke Beranda
        </Link>
      </section>

      <footer className="py-10 border-t border-border text-center text-muted-foreground text-sm">
        © {new Date().getFullYear()} Pahlawan Maluku
      </footer>
    </div>
  );
}
