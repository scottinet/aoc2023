import { chrono } from '@utils/chrono';
import { promises as fs } from 'fs';
import { HikePoint } from './models/hike-point.model';
import { part1 } from './part1';
import { part2 } from './part2';

async function parse(inputFileName: string): Promise<HikePoint[]> {
  const input = await fs.readFile(inputFileName, 'utf8');
  const lines = input.split('\n');
  const points: HikePoint[] = [];

  for (let y = 0; y < lines.length; y++) {
    for (let x = 0; x < lines[y].length; x++) {
      if (lines[y][x] !== '#') {
        points.push(new HikePoint(x, y, lines[y][x]));
      }
    }
  }

  return points;
}

async function main(inputFileName: string): Promise<void> {
  const input = await parse(inputFileName);

  chrono<HikePoint[]>(part1, input, 'part1');
  chrono<HikePoint[]>(part2, input, 'part2');
}

main(process.argv[2]);
