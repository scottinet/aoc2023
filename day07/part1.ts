import { Hand } from './types/hand.type';

export const CARD_TYPES = '23456789TJQKA';

function groupCards(cards: string): number[] {
  let groups: number[] = [];

  for (const card of cards) {
    const index = CARD_TYPES.indexOf(card);
    groups[index] = groups[index] ? groups[index] + 1 : 1;
  }

  groups = groups.filter((v) => v > 1).sort((a, b) => b - a);

  return groups.length ? groups : [1];
}

function compareGroups(a: Hand, b: Hand): number {
  const firstGroupDiff = a.groups[0] - b.groups[0];
  if (firstGroupDiff !== 0) {
    return firstGroupDiff;
  }

  const groupsCountDiff = a.groups.length - b.groups.length;
  if (groupsCountDiff !== 0) {
    return groupsCountDiff;
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

export function part1(hands: Hand[]): void {
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
