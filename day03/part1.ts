import assert from 'assert';
import { PartNumber } from './types/part-number.type';
import { Schematic } from './types/schematic.type';
import { parse } from './utils/parse';

function isPartNumber(schematic: Schematic, part: PartNumber): boolean {
  const minY = Math.max(part.start.y - 1, 0);
  const maxY = Math.min(part.end.y + 1, schematic.content.length - 1);
  const minX = Math.max(part.start.x - 1, 0);
  const maxX = Math.min(part.end.x + 1, schematic.content[0].length - 1);

  for (let y = minY; y <= maxY; y++) {
    const substr = schematic.content[y].substring(minX, maxX);

    if (substr.search(/[^\d.]/) !== -1) {
      return true;
    }
  }

  return false;
}

async function part1(inputFileName: string): Promise<void> {
  const schematic = await parse(inputFileName);
  const partNumbers: Array<PartNumber> = [];

  for (const part of schematic.parts) {
    if (isPartNumber(schematic, part)) {
      partNumbers.push(part);
    }
  }

  if (partNumbers.length) {
    console.log(`Part numbers: ${partNumbers.map((p) => p.value).join(', ')}`);
    console.log(
      `Sum: ${partNumbers.reduce((acc, part) => acc + part.value, 0)}`
    );
  } else {
    console.log('No part numbers');
  }
}

const inputFileName = process.argv[2];

assert(inputFileName, 'Input file name is missing');
part1(inputFileName);
