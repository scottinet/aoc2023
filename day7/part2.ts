import { Hand } from './models/hand.type';

export const CARD_TYPES = 'J23456789TQKA';

function groupCards(cards: string): number[] {
  let groups: number[] = Array(CARD_TYPES.length).fill(0);
  const jokerless = cards.split('').filter((c) => c !== 'J');
  const jokers = cards.length - jokerless.length;

  for (const card of jokerless) {
    const index = CARD_TYPES.indexOf(card);
    groups[index]++;
  }

  groups = groups.sort((a, b) => b - a);
  groups[0] = Math.min(jokers + groups[0], cards.length);

  return groups;
}

function compareGroups(a: Hand, b: Hand): number {
  for (let i = 0; i < 2; i++) {
    const diff = a.groups[i] - b.groups[i];
    if (diff !== 0) {
      return diff;
    }
  }

  for (let i = 0; i < a.cards.length; i++) {
    const aIndex = CARD_TYPES.indexOf(a.cards[i]);
    const bIndex = CARD_TYPES.indexOf(b.cards[i]);

    if (aIndex !== bIndex) {
      return aIndex - bIndex;
    }
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
    const hand = hands[i];
    winnings += (i + 1) * hand.bid;
  }

  console.log(`Winnings: ${winnings}`);
}
