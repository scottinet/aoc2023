import { chrono } from '@utils/chrono';
import { Point3D } from '@utils/models/point3d.model';
import { readFile } from 'fs/promises';
import { InputInfo } from './models/input-info';
import { Vect3D } from './models/vect3d';
import { part1 } from './part1';
import { part2 } from './part2';

async function parse(inputFileName: string, min, max): Promise<InputInfo> {
  const input = await readFile(inputFileName, 'utf-8');
  const info: InputInfo = {
    min,
    max,
    vects: [],
    points: [],
  };

  input.split('\n').forEach((line, index) => {
    const [x, y, z, vx, vy, vz] = line.match(/-?\d+/g).map(Number);

    info.vects.push(new Vect3D(vx, vy, vz));
    info.points.push(new Point3D(x, y, z));
  });

  return info;
}

async function main(
  inputFileName: string,
  min: number,
  max: number
): Promise<void> {
  const input = await parse(inputFileName, min, max);

  chrono<InputInfo>(part1, input, 'part1');
  chrono<InputInfo>(part2, input, 'part2');
}

const min = parseInt(process.argv[3], 10);
const max = parseInt(process.argv[4], 10);

if (isNaN(min) || isNaN(max)) {
  throw new Error('Invalid min/max values');
}

main(process.argv[2], min, max);
