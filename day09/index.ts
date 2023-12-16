import { promises as fs } from 'fs';
import { chrono } from '../utils/chrono';
import { part1 } from './part1';
import { part2 } from './part2';

async function parse(inputFileName: string): Promise<number[][]> {
  const input = await fs.readFile(inputFileName, 'utf8');
  const lines = input.split('\n');
  const numbers = lines.map((line) =>
    line.split(/\s+/).map((num) => parseInt(num))
  );
  return numbers;
}

async function main(inputFileName: string) {
  const numbers = await parse(inputFileName);

  chrono<number[][]>(part1, numbers, 'part1');
  chrono<number[][]>(part2, numbers, 'part2');
}

main(process.argv[2]);
