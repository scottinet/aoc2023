import fs from 'fs/promises';
import { PartNumber } from '../types/part-number.type';
import { Schematic } from '../types/schematic.type';

export async function parse(fileName: string): Promise<Schematic> {
  const data = await fs.readFile(fileName, 'utf-8');
  const schematic: Schematic = {
    parts: [],
    content: data.split('\n'),
  };
  let y = 0;

  for (const line of schematic.content) {
    const regexp = /(\d+)/g;
    let match: RegExpExecArray;

    while ((match = regexp.exec(line))) {
      const part: PartNumber = {
        value: parseInt(match[0], 10),
        start: { x: match.index, y },
        end: { x: regexp.lastIndex, y },
      };

      schematic.parts.push(part);
    }

    y++;
  }

  return schematic;
}
