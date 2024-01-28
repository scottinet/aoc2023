import { RaceRecord } from './types/race-record.type';

function getWinningRaces(race: RaceRecord): number {
  let winning: number = 0;

  for (let i = 0; i < race.time; i++) {
    if ((race.time - i) * i > race.distance) {
      winning++;
    }
  }

  return winning;
}

export function part2(races: RaceRecord[]): void {
  let concatTime: string = '';
  let concatDistance: string = '';

  for (let i = 0; i < races.length; i++) {
    concatTime += races[i].time;
    concatDistance += races[i].distance;
  }

  const winning = getWinningRaces({
    time: parseInt(concatTime, 10),
    distance: parseInt(concatDistance, 10),
  });
  console.log(`Winning races: ${winning}`);
}
