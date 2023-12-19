import { DigInstruction } from './types/dig-instruction.type';

type Point = { x: number; y: number };

// BURN FOREST, BURN
function dig(dugPoints: Set<string>, min: Point, max: Point): void {
  // Arbitrary, as long as it's inside the figure, I don't care
  const queue = [{ x: 1, y: 1 }];

  while (queue.length > 0) {
    const current = queue.shift();
    const neighbours: Point[] = [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
    ]
      .map(([dx, dy]) => ({ x: current.x + dx, y: current.y + dy }))
      .filter((n) => !dugPoints.has(JSON.stringify(n)));

    for (const n of neighbours) {
      if (n.x < min.x || n.x > max.x || n.y < min.y || n.y > max.y) {
        throw new Error('Out of bounds');
      }

      queue.push(n);
      dugPoints.add(JSON.stringify(n));
    }
  }
}

export function part1(input: DigInstruction[]): void {
  const dugPoints: Set<string> = new Set();
  const current: Point = { x: 0, y: 0 };
  const min: Point = { x: 0, y: 0 };
  const max = { x: 0, y: 0 };

  dugPoints.add(JSON.stringify(current));

  for (let instruction of input) {
    for (let i = 0; i < instruction.distance; i++) {
      const diff = ['U', 'L'].includes(instruction.direction) ? -1 : 1;

      if (['U', 'D'].includes(instruction.direction)) {
        current.y += diff;
        min.y = Math.min(min.y, current.y);
        max.y = Math.max(max.y, current.y);
      } else {
        current.x += diff;
        min.x = Math.min(min.x, current.x);
        max.x = Math.max(max.x, current.x);
      }
      dugPoints.add(JSON.stringify(current));
    }
  }

  dig(dugPoints, min, max);
  console.log(`Dug: ${dugPoints.size}`);
}
