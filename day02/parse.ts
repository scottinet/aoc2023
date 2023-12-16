import fs from 'fs/promises';
import { Draw } from './models/draw.type';

export async function parseData(fileName: string): Promise<Array<Array<Draw>>> {
  const data = await fs.readFile(fileName, 'utf-8');
  const games = [];

  for (const line of data.split('\n')) {
    const drawsStr = line.replace(/Game \d+: /, '').split('; ');
    const draws: Array<Draw> = [];

    for (const drawStr of drawsStr) {
      const draw: Draw = {
        green: 0,
        red: 0,
        blue: 0,
      };
      const colors = drawStr.split(', ');

      for (const color of colors) {
        const [amount, colorName] = color.split(' ');
        draw[colorName as keyof Draw] += parseInt(amount, 10);
      }

      draws.push(draw);
    }

    games.push(draws);
  }

  return games;
}
