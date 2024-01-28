import { chrono } from '../utils/chrono';
import { parse } from './parse';
import { part2 } from './part2';
import { DesertMap } from './types/desert-map.type';

async function main(inputFileName: string): Promise<void> {
  const desertMap = await parse(inputFileName);

  //   chrono<DesertMap>(part1, desertMap, 'part1');
  chrono<DesertMap>(part2, desertMap, 'part2');
}

main(process.argv[2]);
