import { promises as fs } from 'fs';
import { chrono } from '../utils/chrono';
import { part1 } from './part1';
import { Grid } from './types/grid.type';

async function main(inputFileName: string): Promise<void> {
  const data = (await fs.readFile(inputFileName, 'utf8')).split('\n');
  const parsed = new Grid(data);

  chrono<Grid>(part1, parsed, 'part1');
}

main(process.argv[2]);
