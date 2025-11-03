export default function GuidesPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-semibold mb-4">Guides</h1>
      <p className="text-neutral-300 mb-6">
        Structured guides to develop intuition: mental models, heuristics, and
        checklists you can apply under time pressure.
      </p>
      <ul className="space-y-3 text-neutral-200 list-disc pl-6">
        <li>Heuristics: simplify, constrain, and generalize</li>
        <li>Invariants: what must stay true as the algorithm runs</li>
        <li>Proof patterns: induction, contradiction, exchange argument</li>
      </ul>
    </main>
  );
}


