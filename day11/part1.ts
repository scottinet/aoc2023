import { Point } from './types/point.type';

function expandUniverse(universe: string[]): string[] {
  let emptyColumns: Uint8Array = new Uint8Array(universe[0].length).fill(1);
  let emptyLines: Uint8Array = new Uint8Array(universe.length).fill(1);

  for (let y = 0; y < universe.length; y++) {
    if (universe[y].indexOf('#') !== -1) {
      universe[y].split('').forEach((char, x) => {
        if (char === '#') emptyColumns[x] = 0;
      });
    } else {
      emptyLines[y] = 0;
    }
  }

  let extendedUniverse: string[] = [];
  const newUniverseWidth =
    universe[0].length + emptyColumns.reduce((acc, curr) => acc + curr, 0);

  for (let y = 0; y < universe.length; y++) {
    let newLine = '';

    universe[y].split('').forEach((char, x) => {
      if (emptyColumns[x] === 1) newLine += '.';
      newLine += char;
    });

    extendedUniverse.push(newLine);

    if (emptyLines[y] === 0) {
      extendedUniverse.push('.'.repeat(newUniverseWidth));
    }
  }

  return extendedUniverse;
}

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
  universe = expandUniverse(universe);
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
