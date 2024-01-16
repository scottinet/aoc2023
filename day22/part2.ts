import { SettledBrick } from './models/settled-brick.type';

function countCollapsable(collapsed: SettledBrick): number {
  if (collapsed.supporting.length === 0) return 0;

  const queue = collapsed.supporting.slice();
  const seen = new Set<string>([collapsed.name]);
  let count = 0;

  while (queue.length > 0) {
    queue.sort((a, b) => a.start.z - b.start.z);
    const brick = queue.shift();
    if (seen.has(brick.name)) continue;

    if (brick.supportedBy.every((s) => seen.has(s.name))) {
      queue.push(...brick.supporting);
      seen.add(brick.name);
      count++;
    }
  }

  return count;
}

export function part2(bricks: SettledBrick[]): void {
  console.log(
    'Total collapsable: ' + bricks.reduce((a, b) => a + countCollapsable(b), 0)
  );
}
