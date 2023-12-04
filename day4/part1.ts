import assert from 'assert';
import { parse } from './utils/parse';

async function part1(inputFileName: string): Promise<void> {
  const scratchcards = await parse(inputFileName);
  let points: number = 0;

  for (const scratchcard of scratchcards) {
    const p = scratchcard.wins > 0 ? Math.pow(2, scratchcard.wins - 1) : 0;
    console.log(`Card ${scratchcards.indexOf(scratchcard) + 1}: ${p}`);
    points += p;
  }

  console.log(`Total: ${points}`);
}

const inputFileName = process.argv[2];
assert(inputFileName, 'Input file name is missing');
part1(inputFileName);
