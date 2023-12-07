import { CARD_TYPES } from './constants/card-types.const';
import { Hand } from './models/hand.type';

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
  hands.sort(compareGroups);

  for (let i = 0; i < hands.length; i++) {
    const hand = hands[i];
    winnings += (i + 1) * hand.bid;
  }

  console.log(`Winnings: ${winnings}`);
}
