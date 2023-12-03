import assert from 'assert';
import { Gear } from './models/gear.type';
import { PartNumber } from './models/part-number.type';
import { Point } from './models/point.type';
import { Schematic } from './models/schematic.type';
import { parse } from './utils/parse';

function getPartsAround(schematic: Schematic, point: Point): Array<PartNumber> {
  const parts: Array<PartNumber> = [];

  for (const part of schematic.parts) {
    if (
      (Math.abs(part.start.x - point.x) <= 1 ||
        Math.abs(part.end.x - 1 - point.x) <= 1) &&
      (Math.abs(part.start.y - point.y) <= 1 ||
        Math.abs(part.end.y - point.y) <= 1)
    ) {
      parts.push(part);
    }
  }

  return parts;
}

function findGears(schematic: Schematic): Array<Gear> {
  const gears: Array<Gear> = [];

  for (let y = 0; y < schematic.content.length; y++) {
    const searchPattern = /\*/g;
    let match: RegExpExecArray;

    while ((match = searchPattern.exec(schematic.content[y]))) {
      const x = match.index;
      const partsAround = getPartsAround(schematic, { x, y });

      if (partsAround.length === 2) {
        const gear: Gear = {
          position: { x, y },
          partNumbers: partsAround,
          ratio: partsAround[0].value * partsAround[1].value,
        };

        gears.push(gear);
      }
    }
  }

  return gears;
}

async function part2(inputFileName: string): Promise<void> {
  const schematic = await parse(inputFileName);
  const gears = findGears(schematic);

  console.log(`Sum: ${gears.reduce((acc, gear) => acc + gear.ratio, 0)}`);
}

const inputFileName = process.argv[2];

assert(inputFileName, 'Input file name is missing');
part2(inputFileName);
