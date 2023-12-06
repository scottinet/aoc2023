import { RaceRecord } from './models/race-record.type';

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
    console.log(
      `Race ${i + 1}: ${winning.length} races can be won (${winning})`
    );
    winningRaces *= winning.length;
  }

  console.log(`Winning races: ${winningRaces}`);
}
