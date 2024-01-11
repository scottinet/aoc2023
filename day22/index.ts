import { chrono } from '@utils/chrono';
import { Point3D } from '@utils/models/point3d.model';
import { promises as fs } from 'fs';
import { part1 } from './part1';
import { part2 } from './part2';
import { Brick } from './types/brick.type';

function iterationToName(iteration: number): string {
  let name = '';
  let remaining = iteration;

  if (remaining === 0) return 'A';

  for (let power = 0; remaining > 0; power++) {
    const digit = remaining % 26;
    const letter = String.fromCharCode(65 + digit);
    name = letter + name;
    remaining = Math.floor(remaining / 26);
  }

  return name;
}

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
      name: iterationToName(i),
      start: new Point3D(x1, y1, z1),
      end: new Point3D(x2, y2, z2),
    });
  }

  return bricks;
}

async function main(inputFileName: string): Promise<void> {
  const input = await parse(inputFileName);

  chrono<Brick[]>(part1, input, 'part1');
  chrono<Brick[]>(part2, input, 'part2');
}

main(process.argv[2]);
