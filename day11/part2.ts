import { Point } from './types/point.type';

const EXPANSION_FACTOR = 1000000;

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

function getEmptyLines(universe: string[]): number[] {
  const emptyLines: number[] = [];

  for (let y = 0; y < universe.length; y++) {
    if (universe[y].indexOf('#') === -1) {
      emptyLines.push(y);
    }
  }

  return emptyLines;
}

function getEmptyColumns(universe: string[]): number[] {
  const emptyColumns: number[] = [];

  for (let x = 0; x < universe[0].length; x++) {
    let empty = true;

    for (let y = 0; y < universe.length; y++) {
      if (universe[y][x] === '#') {
        empty = false;
        break;
      }
    }

    if (empty) {
      emptyColumns.push(x);
    }
  }

  return emptyColumns;
}

function getExpandedX(x: number, emptyColumns: number[]): number {
  return (
    x +
    emptyColumns.filter((column) => column < x).length * (EXPANSION_FACTOR - 1)
  );
}

function getExpandedY(y: number, emptyLines: number[]): number {
  return (
    y + emptyLines.filter((line) => line < y).length * (EXPANSION_FACTOR - 1)
  );
}

function expandGalaxies(universe: string[], galaxies: Point[]): Point[] {
  const expandedGalaxies: Point[] = [];
  const emptyLines = getEmptyLines(universe);
  const emptyColumns = getEmptyColumns(universe);

  for (let i = 0; i < galaxies.length; i++) {
    expandedGalaxies.push({
      x: getExpandedX(galaxies[i].x, emptyColumns),
      y: getExpandedY(galaxies[i].y, emptyLines),
    });
  }

  return expandedGalaxies;
}

export function part2(universe: string[]): void {
  const galaxies = getGalaxies(universe);
  const expandedGalaxies = expandGalaxies(universe, galaxies);
  let totalDistance = 0;

  for (let i = 0; i < expandedGalaxies.length; i++) {
    for (let j = i + 1; j < expandedGalaxies.length; j++) {
      const distance =
        Math.abs(expandedGalaxies[i].x - expandedGalaxies[j].x) +
        Math.abs(expandedGalaxies[i].y - expandedGalaxies[j].y);

      totalDistance += distance;
    }
  }

  console.log(`Total distance: ${totalDistance}`);
}
