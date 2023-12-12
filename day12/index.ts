import { promises as fs } from 'fs';
import { chrono } from '../utils/chrono';
import { part1 } from './part1';
import { SpringRecord } from './types/spring-record.type';

async function parse(inputFileName: string): Promise<SpringRecord[]> {
  const input = await fs.readFile(inputFileName, 'utf8');
  const springRecords: SpringRecord[] = [];

  for (const line of input.split('\n')) {
    const [record, damaged] = line.split(' ');
    const recordNum = record.split('').map((n) => {
      if (n === '.') return 0;
      if (n === '#') return 1;
      return NaN;
    });
    const damagedNum = damaged.split(',').map(Number);

    springRecords.push({ record: recordNum, damaged: damagedNum });
  }

  return springRecords;
}

async function main(inputFileName: string): Promise<void> {
  const records = await parse(inputFileName);

  chrono<SpringRecord[]>(part1, records, 'part1');
}

main(process.argv[2]);
