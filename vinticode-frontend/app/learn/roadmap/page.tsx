export default function RoadmapPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-semibold mb-4">Roadmap: Build DSA Intuition</h1>
      <p className="text-neutral-300 mb-6">
        This roadmap prioritizes intuition over memorization. You will learn to
        recognize patterns, reason with invariants, and form hypotheses before
        you code. Each phase trains a specific mental skill.
      </p>
      <ol className="space-y-6 text-neutral-200 list-decimal pl-6">
        <li>
          <span className="font-medium">Programming Basics</span>
          <p className="text-neutral-400">Comfort with syntax and control flow to express ideas quickly.</p>
        </li>
        <li>
          <span className="font-medium">Data Structures as Tools</span>
          <p className="text-neutral-400">Know the trade-offs so you can pick the right tool on instinct.</p>
        </li>
        <li>
          <span className="font-medium">Algorithmic Patterns</span>
          <p className="text-neutral-400">Two pointers, sliding window, recursion, greedy, binary search.</p>
        </li>
        <li>
          <span className="font-medium">Complexity</span>
          <p className="text-neutral-400">Reason about limits to choose feasible strategies early.</p>
        </li>
        <li>
          <span className="font-medium">Practice with Intuition Checks</span>
          <p className="text-neutral-400">Explain the why, list invariants, and predict outcomes before coding.</p>
        </li>
      </ol>
    </main>
  );
}


