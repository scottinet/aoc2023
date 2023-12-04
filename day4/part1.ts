import assert from 'assert';
import { parse } from './utils/parse';

function getPoints(winning: Array<number>, scratched: Array<number>): number {
  let wins = 0;

  for (const num of scratched) {
    if (winning.includes(num)) {
      wins++;
    }
  }

  return wins > 0 ? Math.pow(2, wins - 1) : 0;
}

async function part1(inputFileName: string): Promise<void> {
  const scratchcards = await parse(inputFileName);
  let points: number = 0;

  for (const scratchcard of scratchcards) {
    const p = getPoints(scratchcard.winning, scratchcard.scratched);
    console.log(`Card ${scratchcards.indexOf(scratchcard) + 1}: ${p}`);
    points += p;
  }

  console.log(`Total: ${points}`);
}

const inputFileName = process.argv[2];
assert(inputFileName, 'Input file name is missing');
part1(inputFileName);
