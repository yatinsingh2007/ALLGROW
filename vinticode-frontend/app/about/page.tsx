export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-semibold mb-4">About VintiCode</h1>
      <p className="text-neutral-300 mb-6">
        VintiCode helps you build deep DSA intuition through pattern-first
        learning, invariants, and deliberate practice. We focus on the mental
        moves behind correct solutions.
      </p>
      <section className="space-y-5 text-neutral-200">
        <div>
          <h2 className="text-xl font-medium">Our Approach</h2>
          <p className="text-neutral-400">
            Learn by patterns, not by memorizing. We emphasize recognizing
            structures, forming hypotheses, and validating with invariants.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-medium">What You Get</h2>
          <p className="text-neutral-400">
            A roadmap, pattern playbooks, practice labs, and concise guides to
            keep your intuition sharp and transferable.
          </p>
        </div>
      </section>
    </main>
  );
}


