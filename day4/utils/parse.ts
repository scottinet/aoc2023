import { Scratchcard } from 'day4/models/scratchcard.type';
import fs from 'fs/promises';

export async function parse(fileName: string): Promise<Array<Scratchcard>> {
  const scratchcards: Array<Scratchcard> = [];
  const data = await fs.readFile(fileName, 'utf-8');

  for (const line of data.split('\n')) {
    const [winningStr, scratchedStr] = line
      .replace(/^Card\s+\d+: /, '')
      .split('|');

    const scratchcard: Scratchcard = {
      winning: winningStr
        .split(/\s+/)
        .map((n) => parseInt(n, 10))
        .filter((n) => !isNaN(n)),
      scratched: scratchedStr
        .split(/\s+/)
        .map((n) => parseInt(n, 10))
        .filter((n) => !isNaN(n)),
    };

    scratchcards.push(scratchcard);
  }

  return scratchcards;
}
