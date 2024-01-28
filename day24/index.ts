import { chrono } from '@utils/chrono';
import { readFile } from 'fs/promises';
import { InputInfo } from './models/input-info';
import { Vect3D } from './models/vect3d';
import { part1 } from './part1';
import { part2 } from './part2';

async function parse(inputFileName: string): Promise<Vect3D[]> {
  const input = await readFile(inputFileName, 'utf-8');

  return input.split('\n').map((line) => {
    const [x, y, z, vx, vy, vz] = line.match(/-?\d+/g).map(Number);

    return new Vect3D(x, y, z, vx, vy, vz);
  });
}

async function main(
  inputFileName: string,
  min: number,
  max: number
): Promise<void> {
  const input = await parse(inputFileName);
  const inputInfo = { min, max, vects: input };

  chrono<InputInfo>(part1, inputInfo, 'part1');
  chrono<InputInfo>(part2, inputInfo, 'part2');
}

const min = parseInt(process.argv[3], 10);
const max = parseInt(process.argv[4], 10);

if (isNaN(min) || isNaN(max)) {
  throw new Error('Invalid min/max values');
}

main(process.argv[2], min, max);
