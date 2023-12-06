import { chrono } from '../utils/chrono';
import { RaceRecord } from './models/race-record.type';
import { part1 } from './part1';
import { parse } from './utils/parse';

async function main(inputFileName: string): Promise<void> {
  const races = await parse(inputFileName);

  chrono<RaceRecord[]>(part1, races, 'part1');
}

main(process.argv[2]);
