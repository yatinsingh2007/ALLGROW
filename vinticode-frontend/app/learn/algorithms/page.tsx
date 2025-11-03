export default function AlgorithmsPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-semibold mb-4">Algorithm Intuition</h1>
      <p className="text-neutral-300 mb-6">
        Build mental models, not rote memory. Each pattern below includes its
        core invariant, when it applies, and how to recognize it quickly.
      </p>
      <section className="space-y-5 text-neutral-200">
        <div>
          <h2 className="text-xl font-medium">Two Pointers</h2>
          <p className="text-neutral-400">Invariant: one pass maintains relative order information.</p>
        </div>
        <div>
          <h2 className="text-xl font-medium">Sliding Window</h2>
          <p className="text-neutral-400">Invariant: window always satisfies/violates a condition you adjust.</p>
        </div>
        <div>
          <h2 className="text-xl font-medium">Divide & Conquer</h2>
          <p className="text-neutral-400">Heuristic: split problem, solve parts, merge with proof of correctness.</p>
        </div>
        <div>
          <h2 className="text-xl font-medium">Graphs & Traversals</h2>
          <p className="text-neutral-400">Modeling: states as nodes, moves as edges; choose BFS/DFS by goal.</p>
        </div>
      </section>
    </main>
  );
}


