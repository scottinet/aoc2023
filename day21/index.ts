import { chrono } from '@utils/chrono';
import { Point } from '@utils/models/point.model';
import { promises as fs } from 'fs';
import { explore } from './explore';
import { part1 } from './part1';
import { part2 } from './part2';
import { GardenMap } from './types/garden-map.type';

async function parse(inputFileName: string): Promise<GardenMap> {
  const input = await fs.readFile(inputFileName, 'utf8');
  const lines = input.split('\n');
  const map: string[] = [];
  let start: Point;

  for (const line of lines) {
    map.push(line);

    if (line.includes('S')) {
      start = new Point(line.indexOf('S'), map.length - 1);
    }
  }

  return { map, start };
}

async function main(inputFileName: string): Promise<void> {
  const input = await parse(inputFileName);

  chrono<GardenMap>(part1, input, 'part1');
  chrono<GardenMap>(part2, input, 'part2');
  chrono<GardenMap>(explore, input, 'part2');
}

main(process.argv[2]);
