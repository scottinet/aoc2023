import { Point } from './types/point.type';

function getGalaxies(universe: string[]): Point[] {
  const galaxies: Point[] = [];

  for (let y = 0; y < universe.length; y++) {
    for (let x = 0; x < universe[y].length; x++) {
      if (universe[y][x] === '#') {
        galaxies.push({ x, y });
      }
    }
  }

  return galaxies;
}

export function part1(universe: string[]): void {
  const galaxies = getGalaxies(universe);
  let totalDistance = 0;

  for (let i = 0; i < galaxies.length; i++) {
    for (let j = i + 1; j < galaxies.length; j++) {
      const distance =
        Math.abs(galaxies[i].x - galaxies[j].x) +
        Math.abs(galaxies[i].y - galaxies[j].y);

      totalDistance += distance;
    }
  }

  console.log(`Total distance: ${totalDistance}`);
}
