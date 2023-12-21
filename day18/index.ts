import { promises as fs } from 'fs';
import { chrono } from '../utils/chrono';
import { part1 } from './part1';
import { part2 } from './part2';
import { DigInstruction } from './types/dig-instruction.type';

async function parse(inputFileName: string): Promise<DigInstruction[]> {
  const instructions: DigInstruction[] = [];
  const input = await fs.readFile(inputFileName, 'utf8');
  const lines = input.split('\n');

  for (const line of lines) {
    const [direction, distance, rgb] = line.split(' ');

    instructions.push({
      direction,
      distance: Number(distance),
      rgb: rgb.match(/\(#(.*?)\)/)[1],
    });
  }

  return instructions;
}

async function main(inputFileName: string): Promise<void> {
  const input = await parse(inputFileName);

  chrono<DigInstruction[]>(part1, input, 'part1');
  chrono<DigInstruction[]>(part2, input, 'part2');
}

main(process.argv[2]);
