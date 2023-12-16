import assert from 'assert';
import { Draw } from './models/draw.type';
import { parseData } from './parse';

function getMinimumPossibleDraw(game: Array<Draw>): Draw {
  return game.reduce(
    (acc, draw) => {
      return {
        green: Math.max(acc.green, draw.green),
        red: Math.max(acc.red, draw.red),
        blue: Math.max(acc.blue, draw.blue),
      };
    },
    { green: 0, red: 0, blue: 0 }
  );
}

async function part2(inputFileName: string): Promise<void> {
  const games = await parseData(inputFileName);
  const powers: Array<number> = [];

  for (const game of games) {
    const minimumPossibleDraw = getMinimumPossibleDraw(game);
    powers.push(
      minimumPossibleDraw.red *
        minimumPossibleDraw.green *
        minimumPossibleDraw.blue
    );
  }

  console.log(`Powers: ${powers.join(', ')}`);
  console.log(`Sum: ${powers.reduce((acc, power) => acc + power, 0)}`);
}

const inputFileName = process.argv[2];

assert(inputFileName, 'Input file name is missing');
part2(inputFileName);
