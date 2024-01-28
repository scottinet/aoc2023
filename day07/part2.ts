import { Hand } from './types/hand.type';

export const CARD_TYPES = 'J23456789TQKA';

function groupCards(cards: string): number[] {
  let groups: number[] = Array(CARD_TYPES.length).fill(0);
  const jokerless = cards.split('').filter((c) => c !== 'J');
  const jokers = cards.length - jokerless.length;

  jokerless.forEach((card) => {
    groups[CARD_TYPES.indexOf(card)]++;
  });

  groups = groups.sort((a, b) => b - a);
  groups[0] += jokers;

  return groups;
}

function compareGroups(a: Hand, b: Hand): number {
  for (let i = 0; i < 2; i++) {
    if (a.groups[i] !== b.groups[i]) return a.groups[i] - b.groups[i];
  }

  for (let i = 0; i < a.cards.length; i++) {
    const aIndex = CARD_TYPES.indexOf(a.cards[i]);
    const bIndex = CARD_TYPES.indexOf(b.cards[i]);

    if (aIndex !== bIndex) return aIndex - bIndex;
  }

  throw new Error('hands are equal');
}

export function part2(hands: Hand[]): void {
  let winnings = 0;

  hands.forEach((hand) => {
    hand.groups = groupCards(hand.cards);
  });

  hands.sort(compareGroups);

  for (let i = 0; i < hands.length; i++) {
    winnings += (i + 1) * hands[i].bid;
  }

  console.log(`Winnings: ${winnings}`);
}
