import assert from 'assert';
import { parse } from './utils/parse';

async function part2(inputFileName: string): Promise<void> {
  const scratchcards = await parse(inputFileName);
  const copies: Uint32Array = new Uint32Array(scratchcards.length);
  copies.fill(1);

  for (let i = 0; i < scratchcards.length; i++) {
    const copiesCount = copies[i];

    for (
      let j = i + 1;
      j < Math.min(scratchcards.length, i + scratchcards[i].wins + 1);
      j++
    ) {
      copies[j] += copiesCount;
    }
  }

  copies.forEach((count, index) =>
    console.log(`Card ${index + 1}: ${count} copies`)
  );
  console.log(`Total: ${copies.reduce((acc, count) => acc + count, 0)} copies`);
}

const inputFileName = process.argv[2];
assert(inputFileName, 'Input file name is missing');
part2(inputFileName);
