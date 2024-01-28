import { RaceRecord } from './types/race-record.type';

function getWinningRaces(race: RaceRecord): number[] {
  const winning: number[] = [];

  for (let i = 0; i < race.time; i++) {
    if ((race.time - i) * i > race.distance) {
      winning.push(i);
    }
  }

  return winning;
}

export function part1(races: RaceRecord[]): void {
  let winningRaces = 1;

  for (let i = 0; i < races.length; i++) {
    const winning = getWinningRaces(races[i]);
    winningRaces *= winning.length;
  }

  console.log(`Winning races: ${winningRaces}`);
}
