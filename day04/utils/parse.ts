import { promises as fs } from 'fs';
import { Scratchcard } from '../models/scratchcard.type';

export async function parse(fileName: string): Promise<Array<Scratchcard>> {
  const scratchcards: Array<Scratchcard> = [];
  const data = await fs.readFile(fileName, 'utf-8');

  for (const line of data.split('\n')) {
    const [winningStr, scratchedStr] = line
      .replace(/^Card\s+\d+: /, '')
      .split('|');

    const winning = winningStr
      .split(/\s+/)
      .map((n) => parseInt(n, 10))
      .filter((n) => !isNaN(n));

    const scratched = scratchedStr
      .split(/\s+/)
      .map((n) => parseInt(n, 10))
      .filter((n) => !isNaN(n));

    const wins = scratched.filter((n) => winning.includes(n)).length;

    const scratchcard: Scratchcard = { winning, scratched, wins };

    scratchcards.push(scratchcard);
  }

  return scratchcards;
}
