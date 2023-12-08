import { chrono } from '../utils/chrono';
import { DesertMap } from './models/desert-map.type';
import { parse } from './parse';
import { part1 } from './part1';

async function main(inputFileName: string): Promise<void> {
  const desertMap = await parse(inputFileName);

  chrono<DesertMap>(part1, desertMap, 'part1');
}

main(process.argv[2]);
