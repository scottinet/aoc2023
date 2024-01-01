import { Point } from '../utils/types/point.type';
import { GardenMap } from './types/garden-map.type';

const MAX_STEPS = 500;

class ModPoint extends Point {
  maps: Map<string, Point>;

  constructor(x: number, y: number, maps: Map<string, Point>) {
    super(x, y);
    this.maps = new Map(maps);
  }
}

function getNeighbours(garden: GardenMap, point: ModPoint): ModPoint[] {
  const neighbours = [
    new ModPoint(point.x - 1, point.y, point.maps),
    new ModPoint(point.x + 1, point.y, point.maps),
    new ModPoint(point.x, point.y - 1, point.maps),
    new ModPoint(point.x, point.y + 1, point.maps),
  ];

  for (const n of neighbours) {
    if (n.x < 0) {
      n.x = garden.map[0].length - 1;
      n.maps = new Map(
        Array.from(n.maps).map((p) => {
          const newP = new Point(p[1].x - 1, p[1].y);
          return [newP.toString(), newP];
        })
      );
    } else if (n.x >= garden.map[0].length) {
      n.x = 0;
      n.maps = new Map(
        Array.from(n.maps).map((p) => {
          const newP = new Point(p[1].x + 1, p[1].y);
          return [newP.toString(), newP];
        })
      );
    }

    if (n.y < 0) {
      n.y = garden.map.length - 1;
      n.maps = new Map(
        Array.from(n.maps).map((p) => {
          const newP = new Point(p[1].x, p[1].y - 1);
          return [newP.toString(), newP];
        })
      );
    } else if (n.y >= garden.map.length) {
      n.y = 0;
      n.maps = new Map(
        Array.from(n.maps).map((p) => {
          const newP = new Point(p[1].x, p[1].y + 1);
          return [newP.toString(), newP];
        })
      );
    }
  }

  return neighbours.filter(({ x, y }) => garden.map[y][x] !== '#');
}

export function part2(input: GardenMap): void {
  let positions: Map<string, ModPoint> = new Map();
  positions.set(
    input.start.toString(),
    new ModPoint(
      input.start.x,
      input.start.y,
      new Map([[input.start.toString(), input.start]])
    )
  );

  for (let i = 0; i < MAX_STEPS; i++) {
    const newPositions: Map<string, ModPoint> = new Map();

    for (const pos of positions.values()) {
      for (const neighbour of getNeighbours(input, pos)) {
        const prev = newPositions.get(neighbour.toString());

        if (!prev) {
          newPositions.set(neighbour.toString(), neighbour);
        } else {
          for (const [key, value] of neighbour.maps) {
            prev.maps.set(key, value);
          }
        }
      }
    }

    positions = newPositions;
  }

  let count = 0;
  for (const pos of positions.values()) {
    count += pos.maps.size;

    let minx = Infinity,
      miny = Infinity,
      maxx = -Infinity,
      maxy = -Infinity;
    for (const p of pos.maps.values()) {
      minx = Math.min(minx, p.x);
      miny = Math.min(miny, p.y);
      maxx = Math.max(maxx, p.x);
      maxy = Math.max(maxy, p.y);
    }

    console.log(`[${minx},${miny}] - [${maxx},${maxy}] (${pos.maps.size})`);
  }

  console.log(count);
}
