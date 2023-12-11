import { promises as fs } from 'fs';
import { chrono } from '../utils/chrono';
import { part1 } from './part1';

function expandUniverse(universe: string[]): string[] {
  let emptyColumns: Uint8Array = new Uint8Array(universe[0].length).fill(1);
  let emptyLines: Uint8Array = new Uint8Array(universe.length).fill(1);

  for (let y = 0; y < universe.length; y++) {
    if (universe[y].indexOf('#') !== -1) {
      universe[y].split('').forEach((char, x) => {
        if (char === '#') emptyColumns[x] = 0;
      });
    } else {
      emptyLines[y] = 0;
    }
  }

  let extendedUniverse: string[] = [];
  const newUniverseWidth =
    universe[0].length + emptyColumns.reduce((acc, curr) => acc + curr, 0);

  for (let y = 0; y < universe.length; y++) {
    let newLine = '';

    universe[y].split('').forEach((char, x) => {
      if (emptyColumns[x] === 1) newLine += '.';
      newLine += char;
    });

    extendedUniverse.push(newLine);

    if (emptyLines[y] === 0) {
      extendedUniverse.push('.'.repeat(newUniverseWidth));
    }
  }

  return extendedUniverse;
}

async function parse(inputFileName: string): Promise<string[]> {
  const input = await fs.readFile(inputFileName, { encoding: 'utf-8' });
  return input.split('\n');
}

async function main(inputFileName: string): Promise<void> {
  let universe = await parse(inputFileName);
  universe = expandUniverse(universe);

  chrono<string[]>(part1, universe, 'part1');
}

main(process.argv[2]);
