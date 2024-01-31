import { chrono } from '@utils/chrono';
import { Point3D } from '@utils/models/point3d.model';
import { numberToName } from '@utils/number-to-name';
import { promises as fs } from 'fs';
import { isPointInBrick, settleTo } from './lib/brick-handling.lib';
import { SettledBrick } from './models/settled-brick.type';
import { part1 } from './part1';
import { part2 } from './part2';
import { Brick } from './types/brick.type';

async function parse(inputFileName: string): Promise<Brick[]> {
  const input = await fs.readFile(inputFileName, 'utf8');
  const lines = input.split('\n');
  const bricks: Brick[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const [start, end] = line.split('~');
    const [x1, y1, z1] = start.split(',').map(Number);
    const [x2, y2, z2] = end.split(',').map(Number);

    bricks.push({
      name: numberToName(i),
      start: new Point3D(x1, y1, z1),
      end: new Point3D(x2, y2, z2),
    });
  }

  return bricks;
}

function settleBricks(bricks: Brick[]): SettledBrick[] {
  bricks.sort(
    (a, b) => Math.min(a.start.z, a.end.z) - Math.min(b.start.z, b.end.z)
  );
  const processed: SettledBrick[] = [];

  for (const brick of bricks) {
    const sbrick: SettledBrick = Object.assign(
      { supporting: [], supportedBy: [] },
      brick
    );
    const supporting: Map<string, SettledBrick> = new Map();
    const minx = Math.min(brick.start.x, brick.end.x);
    const maxx = Math.max(brick.start.x, brick.end.x);

    for (let x = minx; x <= maxx; x++) {
      const miny = Math.min(brick.start.y, brick.end.y);
      const maxy = Math.max(brick.start.y, brick.end.y);

      for (let y = miny; y <= maxy; y++) {
        for (const p of processed) {
          if (isPointInBrick(x, y, p)) {
            supporting.set(`${x},${y}`, p);
          }
        }
      }
    }

    if (supporting.size === 0) {
      settleTo(sbrick, 1);
      processed.push(sbrick);
      continue;
    }

    const minz = Math.min(brick.start.z, brick.end.z);
    let minDelta = Infinity;
    let candidates = new Set<SettledBrick>();

    for (const p of supporting.values()) {
      const delta = minz - Math.max(p.start.z, p.end.z);

      if (delta < minDelta) {
        minDelta = delta;
        candidates = new Set<SettledBrick>([p]);
      } else if (delta === minDelta) {
        candidates.add(p);
      }
    }

    settleTo(sbrick, minz - minDelta + 1);

    for (const p of candidates) {
      p.supporting.push(sbrick);
      sbrick.supportedBy.push(p);
    }

    processed.push(sbrick);
  }

  return processed;
}

async function main(inputFileName: string): Promise<void> {
  const input = await parse(inputFileName);
  const settledBricks = settleBricks(input);

  chrono<SettledBrick[]>(part1, settledBricks, 'part1');
  chrono<SettledBrick[]>(part2, settledBricks, 'part2');
}

main(process.argv[2]);
