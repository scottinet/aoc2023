import { chrono } from '@utils/chrono';
import { part1 } from './part1';
import { part2 } from './part2';
import { RaceRecord } from './types/race-record.type';
import { parse } from './utils/parse';

async function main(inputFileName: string): Promise<void> {
  const races = await parse(inputFileName);

  chrono<RaceRecord[]>(part1, races, 'part1');
  chrono<RaceRecord[]>(part2, races, 'part2');
}

main(process.argv[2]);
