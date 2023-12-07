import { promises as fs } from 'fs';
import { CARD_TYPES } from '../constants/card-types.const';
import { Hand } from '../models/hand.type';

function groupCards(cards: string): number[] {
  let groups: number[] = [];

  for (const card of cards) {
    const index = CARD_TYPES.indexOf(card);
    groups[index] = groups[index] ? groups[index] + 1 : 1;
  }

  groups = groups.filter((v) => v > 1).sort((a, b) => b - a);

  return groups.length ? groups : [1];
}

export async function parse(inputFileName: string): Promise<Hand[]> {
  const hands: Hand[] = [];
  const data = await fs.readFile(inputFileName, 'utf8');
  const lines = data.split('\n');

  for (const line of lines) {
    const [cards, bid] = line.split(' ');
    hands.push({ cards, groups: groupCards(cards), bid: Number(bid) });
  }

  return hands;
}
