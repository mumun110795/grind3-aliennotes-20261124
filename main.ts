import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The whole entry: one alien tourist's verdict on a two-day stopover.
// It leads with a score, praises the planet in passing, grumbles about
// the vast undrunk oceans and the locals vanishing into sleep for a
// third of the trip, then closes the way seasoned reviewers do —
// with a qualified promise to come back.
const REVIEW =
  "3/5. Lovely planet, baffling itinerary: most of the surface is ocean nobody drinks, and the locals sleep through a third of the visit. Would orbit again, better rested.";

const MIN_CHARS = 1;
const MAX_CHARS = 200;

function checkLine(line: string): void {
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("review must stay on a single line");
  }
  const size = [...line].length;
  if (size < MIN_CHARS || size > MAX_CHARS) {
    throw new Error(
      `review is ${size} characters; the gate allows ${MIN_CHARS}-${MAX_CHARS}`,
    );
  }
}

function main(): void {
  checkLine(REVIEW);

  const outDir = process.env.OUTPUT_DIR ?? "/output";
  // The output directory can be a mounted volume, so we only ever
  // create it (if missing) and write into it — never remove it.
  mkdirSync(outDir, { recursive: true });

  const target = join(outDir, "entry.txt");
  writeFileSync(target, REVIEW, { encoding: "utf8" });

  // Read back what actually landed on disk: a short or altered write
  // would otherwise ship silently past the gate.
  const written = readFileSync(target, { encoding: "utf8" });
  if (written !== REVIEW) {
    throw new Error(
      `entry.txt mismatch: expected ${[...REVIEW].length} characters, read back ${[...written].length}`,
    );
  }

  console.log(`wrote ${target} (${[...REVIEW].length} characters)`);
}

main();
