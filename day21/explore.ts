import { Point } from '@utils/models/point.model';
import { GardenMap } from './types/garden-map.type';

// This code cannot process the huge number of steps required for
// part2, but it helped me tremendously to understand the problem
// and to check my solution.

const MAX_STEPS = 589;

class AttainedPoint extends Point {
  constructor(
    x: number,
    y: number,
    public readonly depth: number
  ) {
    super(x, y);
  }
}

class FilledMapNode extends AttainedPoint {
  constructor(
    x: number,
    y: number,
    depth: number,
    public readonly neighbours: FilledMapNode[]
  ) {
    super(x, y, depth);
  }
}

class InfiniteMapPlot extends Point {
  constructor(
    x: number,
    y: number,
    public value: number,
    public readonly startIn: Point
  ) {
    super(x, y);
  }
}

function getModulatedPoint(map: string[], p: Point): Point {
  const width = map[0].length;
  const height = map.length;
  const x = p.x >= 0 ? p.x % width : width + ((p.x + 1) % width) - 1;
  const y = p.y >= 0 ? p.y % height : height + ((p.y + 1) % height) - 1;

  return new Point(x, y);
}

function fillMap(map: string[], start: Point): FilledMapNode {
  const root: FilledMapNode = new FilledMapNode(start.x, start.y, 0, []);
  const visited: Set<string> = new Set([start.toString()]);
  const queue: FilledMapNode[] = [root];

  while (queue.length > 0) {
    const current = queue.shift();
    const neighbours = current.getNeighbours().filter((pos) => {
      const modpos = getModulatedPoint(map, pos);
      return map[modpos.y][modpos.x] !== '#';
    });

    for (const neighbour of neighbours) {
      if (!visited.has(neighbour.toString())) {
        visited.add(neighbour.toString());
        const newTree: FilledMapNode = new FilledMapNode(
          neighbour.x,
          neighbour.y,
          current.depth + 1,
          []
        );
        current.neighbours.push(newTree);

        if (current.depth + 1 < MAX_STEPS) {
          queue.push(newTree);
        }
      }
    }
  }

  return root;
}

function countAttainablePositions(
  map: string[],
  root: FilledMapNode,
  maxSteps: number
): InfiniteMapPlot[] {
  const width = map[0].length;
  const height = map.length;
  const queue = [root];
  const maps: Map<string, InfiniteMapPlot> = new Map();

  while (queue.length > 0) {
    const current = queue.shift();
    const value = current.depth % 2 === maxSteps % 2 ? 1 : 0;

    if (value === 1) {
      let mapx = Math.floor(current.x / width);
      let mapy = Math.floor(current.y / height);
      const modmap = new InfiniteMapPlot(
        mapx,
        mapy,
        value,
        getModulatedPoint(map, current)
      );

      if (maps.has(modmap.toString())) {
        maps.get(modmap.toString()).value++;
      } else {
        maps.set(modmap.toString(), modmap);
      }
    }

    if (current.depth < maxSteps) {
      queue.push(...current.neighbours);
    }
  }

  return Array.from(maps.values());
}

function prettyPrintPositions(positions: InfiniteMapPlot[]): void {
  const minX = Math.min(...positions.map((pos) => pos.x));
  const maxX = Math.max(...positions.map((pos) => pos.x));
  const minY = Math.min(...positions.map((pos) => pos.y));
  const maxY = Math.max(...positions.map((pos) => pos.y));

  for (let y = minY; y <= maxY; y++) {
    let line = '';

    for (let x = minX; x <= maxX; x++) {
      const pos = positions.find((pos) => pos.x === x && pos.y === y);

      if (pos) {
        line += (x === 0 && y === 0 ? '*' : '') + pos.value + '\t';
      } else {
        line += '\t';
      }
    }

    console.log(line);
  }
}

function prettyPrintEntryPoints(positions: InfiniteMapPlot[]): void {
  const minX = Math.min(...positions.map((pos) => pos.x));
  const maxX = Math.max(...positions.map((pos) => pos.x));
  const minY = Math.min(...positions.map((pos) => pos.y));
  const maxY = Math.max(...positions.map((pos) => pos.y));

  for (let y = minY; y <= maxY; y++) {
    let line = '';

    for (let x = minX; x <= maxX; x++) {
      const pos = positions.find((pos) => pos.x === x && pos.y === y);

      if (pos) {
        line += `${pos.startIn.toString()}\t`;
      } else {
        line += '\t';
      }
    }

    console.log(line);
  }
}

export function explore(input: GardenMap): void {
  const filledMap = fillMap(input.map, input.start);
  const positions = countAttainablePositions(input.map, filledMap, MAX_STEPS);

  console.log(positions.reduce((acc, pos) => acc + pos.value, 0));
  prettyPrintPositions(positions);
  console.log('===');
  prettyPrintEntryPoints(positions);
}
