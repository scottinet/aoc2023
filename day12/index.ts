import { promises as fs } from 'fs';
import { chrono } from '../utils/chrono';
import { part1 } from './part1';
import { part2 } from './part2';
import { SpringRow } from './types/spring-record.type';

async function parse(inputFileName: string): Promise<SpringRow[]> {
  const input = await fs.readFile(inputFileName, 'utf8');
  const springRecords: SpringRow[] = [];

  for (const line of input.split('\n')) {
    const [record, damaged] = line.split(' ');
    const recordNum = record.split('').map((n) => {
      if (n === '.') return 0;
      if (n === '#') return 1;
      if (n === '?') return NaN;
      throw new Error('Invalid record: ' + n + ' in ' + line);
    });
    const damagedNum = damaged.split(',').map(Number);

    springRecords.push({ record: recordNum, damaged: damagedNum });
  }

  return springRecords;
}

async function main(inputFileName: string): Promise<void> {
  const records = await parse(inputFileName);

  chrono<SpringRow[]>(part1, records, 'part1');
  chrono<SpringRow[]>(part2, records, 'part2');
  return;
}

main(process.argv[2]);
