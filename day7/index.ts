import { chrono } from '../utils/chrono';
import { Hand } from './models/hand.type';
import { part1 } from './part1';
import { parse } from './utils/parse';

async function main(inputFileName: string): Promise<void> {
  const hands = await parse(inputFileName);

  chrono<Hand[]>(part1, hands, 'part1');
}

main(process.argv[2]);
