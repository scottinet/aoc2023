import { chrono } from '../utils/chrono';
import { part1 } from './part1';
import { part2 } from './part2';
import { Hand } from './types/hand.type';
import { parse } from './utils/parse';

async function main(inputFileName: string): Promise<void> {
  const hands = await parse(inputFileName);

  chrono<Hand[]>(part1, hands, 'part1');
  chrono<Hand[]>(part2, hands, 'part2');
}

main(process.argv[2]);
