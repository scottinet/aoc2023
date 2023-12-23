import { GardenMap } from './types/garden-map.type';
import { Point } from './types/point.type';

const MAX_STEPS = 64;

function getNeighbours(garden: GardenMap, point: Point): Point[] {
  const width = garden.map[0].length;
  const height = garden.map.length;

  const neighbours = [
    new Point(point.x - 1, point.y),
    new Point(point.x + 1, point.y),
    new Point(point.x, point.y - 1),
    new Point(point.x, point.y + 1),
  ];

  return neighbours
    .filter(({ x, y }) => x >= 0 && x < width && y >= 0 && y < height)
    .filter(({ x, y }) => garden.map[y][x] !== '#');
}

export function part1(input: GardenMap): void {
  let positions: Map<string, Point> = new Map();
  positions.set(input.start.toString(), input.start);

  for (let i = 0; i < MAX_STEPS; i++) {
    const newPositions: Map<string, Point> = new Map();

    for (const pos of positions.values()) {
      for (const neighbour of getNeighbours(input, pos)) {
        newPositions.set(neighbour.toString(), neighbour);
      }
    }

    positions = newPositions;
  }

  console.log(positions.size);
}
