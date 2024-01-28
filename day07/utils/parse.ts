import { promises as fs } from 'fs';
import { Hand } from '../types/hand.type';

export async function parse(inputFileName: string): Promise<Hand[]> {
  const hands: Hand[] = [];
  const data = await fs.readFile(inputFileName, 'utf8');
  const lines = data.split('\n');

  for (const line of lines) {
    const [cards, bid] = line.split(' ');
    hands.push({ cards, groups: [], bid: Number(bid) });
  }

  return hands;
}
