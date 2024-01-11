import { Brick } from './types/brick.type';

interface SupportingBrick extends Brick {
  supporting: SupportingBrick[];
  supportedBy: SupportingBrick[];
}

function pointInBrick(x: number, y: number, brick: Brick): boolean {
  const minx = Math.min(brick.start.x, brick.end.x);
  const maxx = Math.max(brick.start.x, brick.end.x);
  const miny = Math.min(brick.start.y, brick.end.y);
  const maxy = Math.max(brick.start.y, brick.end.y);

  return x >= minx && x <= maxx && y >= miny && y <= maxy;
}

function fallTo(brick: SupportingBrick, targetZ: number): void {
  const delta = Math.abs(targetZ - Math.min(brick.start.z, brick.end.z));

  brick.start.z -= delta;
  brick.end.z -= delta;
}

function computeSupportingBricks(bricks: Brick[]): SupportingBrick[] {
  bricks.sort(
    (a, b) => Math.min(a.start.z, a.end.z) - Math.min(b.start.z, b.end.z)
  );
  const processed: SupportingBrick[] = [];

  for (const brick of bricks) {
    const sbrick: SupportingBrick = Object.assign(
      { supporting: [], supportedBy: [] },
      brick
    );
    const supporting: Map<string, SupportingBrick> = new Map();
    const minx = Math.min(brick.start.x, brick.end.x);
    const maxx = Math.max(brick.start.x, brick.end.x);

    for (let x = minx; x <= maxx; x++) {
      const miny = Math.min(brick.start.y, brick.end.y);
      const maxy = Math.max(brick.start.y, brick.end.y);

      for (let y = miny; y <= maxy; y++) {
        for (const p of processed) {
          if (pointInBrick(x, y, p)) {
            supporting.set(`${x},${y}`, p);
          }
        }
      }
    }

    if (supporting.size === 0) {
      fallTo(sbrick, 1);
      processed.push(sbrick);
      continue;
    }

    const minz = Math.min(brick.start.z, brick.end.z);
    let minDelta = Infinity;
    let candidates = new Set<SupportingBrick>();

    for (const p of supporting.values()) {
      const delta = minz - Math.max(p.start.z, p.end.z);

      if (delta < minDelta) {
        minDelta = delta;
        candidates = new Set<SupportingBrick>([p]);
      } else if (delta === minDelta) {
        candidates.add(p);
      }
    }

    fallTo(sbrick, minz - minDelta + 1);

    for (const p of candidates) {
      p.supporting.push(sbrick);
      sbrick.supportedBy.push(p);
    }

    processed.push(sbrick);
  }

  return processed;
}

export function part1(data: Brick[]): void {
  const stackedBricks = computeSupportingBricks(data);
  let destroyable = 0;

  for (const brick of stackedBricks) {
    if (brick.supporting.length === 0) {
      destroyable++;
    } else {
      if (brick.supporting.every((s) => s.supportedBy.length > 1)) {
        destroyable++;
      }
    }
  }

  console.log(destroyable);
}
