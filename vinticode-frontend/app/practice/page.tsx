export default function PracticePage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-semibold mb-4">Practice Labs</h1>
      <p className="text-neutral-300 mb-6">
        Deliberate drills to test and strengthen intuition. For each problem,
        write down the pattern hypothesis, invariants, and expected complexity
        before coding. Compare after.
      </p>
      <ul className="space-y-3 text-neutral-200 list-disc pl-6">
        <li>Warmup: arrays, strings, hash maps (pattern spotting)</li>
        <li>Patterns: two pointers, sliding window, binary search (why/when)</li>
        <li>Recursion and backtracking (state, choices, constraints)</li>
        <li>Graphs: traversal, connectivity, shortest paths (modeling)</li>
      </ul>
    </main>
  );
}


