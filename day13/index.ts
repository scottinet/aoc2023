import { promises as fs } from 'fs';
import { chrono } from '../utils/chrono';
import { part1 } from './part1';

async function parse(inputFileName: string): Promise<string[][]> {
  const input = await fs.readFile(inputFileName, 'utf8');
  const patterns: string[][] = [];
  let current: string[] = [];

  for (const line of input.split('\n')) {
    if (line === '') {
      patterns.push(current);
      current = [];
    } else {
      current.push(line);
    }
  }

  if (current.length) patterns.push(current);

  return patterns;
}

async function main(inputFileName: string): Promise<void> {
  const patterns = await parse(inputFileName);

  chrono<string[][]>(part1, patterns, 'part1');
}

main(process.argv[2]);
