import assert from 'assert';
import { Draw } from './models/draw.type';
import { parseData } from './parse';

function isGamePossible(game: Array<Draw>, bagContent: Draw): boolean {
  const maxShownColors = game.reduce(
    (acc, draw) => {
      return {
        green: Math.max(acc.green, draw.green),
        red: Math.max(acc.red, draw.red),
        blue: Math.max(acc.blue, draw.blue),
      };
    },
    { green: 0, red: 0, blue: 0 }
  );

  return (
    bagContent.green >= maxShownColors.green &&
    bagContent.red >= maxShownColors.red &&
    bagContent.blue >= maxShownColors.blue
  );
}

async function part1(inputFileName: string, bagContent: Draw): Promise<void> {
  const games = await parseData(inputFileName);
  const possibleGameIds: Array<number> = [];

  for (const [index, game] of games.entries()) {
    if (isGamePossible(game, bagContent)) {
      possibleGameIds.push(index + 1);
    }
  }

  if (possibleGameIds.length) {
    console.log(`Possible games: ${possibleGameIds.join(', ')}`);
    console.log(`Sum: ${possibleGameIds.reduce((acc, id) => acc + id, 0)}`);
  } else {
    console.log('No possible games');
  }
}

const inputFileName = process.argv[2];
const bagContent: Draw = { red: 12, green: 13, blue: 14 };

assert(inputFileName, 'Input file name is missing');
part1(inputFileName, bagContent);
