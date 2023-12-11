import { promises as fs } from 'fs';
import { chrono } from '../utils/chrono';
import { part1 } from './part1';
import { part2 } from './part2';

async function parse(inputFileName: string): Promise<string[]> {
  const input = await fs.readFile(inputFileName, { encoding: 'utf-8' });
  return input.split('\n');
}

async function main(inputFileName: string): Promise<void> {
  const universe = await parse(inputFileName);

  chrono<string[]>(part1, universe, 'part1');
  chrono<string[]>(part2, universe, 'part2');
}

main(process.argv[2]);
