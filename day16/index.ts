import { promises as fs } from 'fs';
import { chrono } from '../utils/chrono';
import { part1 } from './part1';

async function main(inputFileName: string): Promise<void> {
  const input = await fs.readFile(inputFileName, 'utf8');
  const lines = input.split('\n');

  chrono<string[]>(part1, lines, 'part1');
}

main(process.argv[2]);
