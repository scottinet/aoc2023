import { chrono } from '../utils/chrono';
import { DesertMap } from './models/desert-map.type';
import { parse } from './parse';
import { part2 } from './part2';

async function main(inputFileName: string): Promise<void> {
  const desertMap = await parse(inputFileName);

  //   chrono<DesertMap>(part1, desertMap, 'part1');
  chrono<DesertMap>(part2, desertMap, 'part2');
}

main(process.argv[2]);
