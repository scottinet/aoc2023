import { promises as fs } from 'fs';
import { chrono } from '../utils/chrono';
import { part1 } from './part1';
import { part2 } from './part2';

async function parse(inputFileName: string): Promise<number[][]> {
  const input = await fs.readFile(inputFileName, 'utf8');
  const platform: number[][] = [];

  for (const line of input.split('\n')) {
    platform.push(
      line.split('').map((c) => {
        if (c === '.') return 0;
        if (c === 'O') return 1;
        return NaN;
      })
    );
  }

  return platform;
}

async function main(inputFileName: string): Promise<void> {
  const platform = await parse(inputFileName);

  chrono<number[][]>(part1, platform, 'part1');
  chrono<number[][]>(part2, platform, 'part2');
}

main(process.argv[2]);
