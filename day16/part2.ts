type Point = { x: number; y: number };
type Vector = Point & { dx: number; dy: number };

function changeDirection(layout: string[], v: Vector): Vector[] {
  const tile = layout[v.y][v.x];

  switch (tile) {
    case '.':
      return [v];
    case '|':
      if (v.dy !== 0) return [v];
      return [
        { ...v, dx: 0, dy: 1 },
        { ...v, dx: 0, dy: -1 },
      ];
    case '-':
      if (v.dx !== 0) return [v];
      return [
        { ...v, dx: 1, dy: 0 },
        { ...v, dx: -1, dy: 0 },
      ];
    case '/':
      if (v.dx !== 0) return [{ ...v, dx: 0, dy: -v.dx }];
      return [{ ...v, dx: -v.dy, dy: 0 }];
    case '\\':
      if (v.dx !== 0) return [{ ...v, dx: 0, dy: v.dx }];
      return [{ ...v, dx: v.dy, dy: 0 }];
    default:
      throw new Error('OHNOES! (╯°□°）╯︵ ┻━┻');
  }
}

function isVectorValid(layout: string[], v: Vector): boolean {
  return v.x >= 0 && v.x < layout[0].length && v.y >= 0 && v.y < layout.length;
}

function computeEnergizedTiles(layout: string[], start: Vector): number {
  let vectors: Vector[] = [start];
  const energized = new Set<string>();
  const seen = new Set<string>();

  while (vectors.length > 0) {
    let newVectors: Vector[] = [];

    for (let i = 0; i < vectors.length; i++) {
      const v = vectors[i];
      const seenKey = JSON.stringify(v);

      if (seen.has(seenKey)) continue;
      seen.add(seenKey);

      v.x += v.dx;
      v.y += v.dy;

      if (isVectorValid(layout, v)) {
        energized.add(v.x + ',' + v.y);
        newVectors.push(...changeDirection(layout, v));
      }
    }

    vectors = newVectors;
  }

  return energized.size;
}

export function part2(layout: string[]): void {
  const l = Array(layout[0].length)
    .fill(0)
    .map((_, i) => i);
  const L = Array(layout.length)
    .fill(0)
    .map((_, i) => i);

  const vectors: Vector[] = [
    ...l.map((x) => ({ x, y: -1, dx: 0, dy: 1 })),
    ...l.map((x) => ({ x, y: layout.length, dx: 0, dy: -1 })),
    ...L.map((y) => ({ x: -1, y, dx: 1, dy: 0 })),
    ...L.map((y) => ({ x: layout[0].length, y, dx: -1, dy: 0 })),
  ];

  let energized = 0;

  for (const v of vectors) {
    energized = Math.max(energized, computeEnergizedTiles(layout, v));
  }

  console.log(`Number of energized points: ${energized}`);
}
