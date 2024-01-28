import { Point } from '@utils/models/point.model';
import { GardenMap } from './types/garden-map.type';

const MAX_STEPS = 26501365;

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

function fillMap(map: string[], start: Point): FilledMapNode {
  const root: FilledMapNode = new FilledMapNode(start.x, start.y, 0, []);
  const visited: Set<string> = new Set([start.toString()]);
  const queue: FilledMapNode[] = [root];

  while (queue.length > 0) {
    const current = queue.shift();
    const neighbours = current
      .getNeighbours({
        minX: 0,
        maxX: map[0].length,
        minY: 0,
        maxY: map.length,
      })
      .filter((pos) => map[pos.y][pos.x] !== '#');

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
        queue.push(newTree);
      }
    }
  }

  return root;
}

function countPositions(filledMap: FilledMapNode, steps: number): number {
  const currentValue = filledMap.depth % 2 === steps % 2 ? 1 : 0;

  if (filledMap.depth === steps) {
    return currentValue;
  }

  return filledMap.neighbours.reduce(
    (acc, neighbour) => acc + countPositions(neighbour, steps),
    currentValue
  );
}

export function part2(input: GardenMap): void {
  const mapLength = input.map[0].length;
  const layers = (MAX_STEPS - input.start.x) / mapLength;
  const filled = layers - 1;
  const filledMap = fillMap(input.map, input.start);
  const sameLayerPos = countPositions(filledMap, MAX_STEPS);
  const otherLayerPos = countPositions(filledMap, MAX_STEPS - 1);

  let sameLayers = 1;
  let otherLayers = 0;
  for (let i = 1; i <= filled; i++) {
    if (i % 2 === 0) {
      sameLayers += 4 * i;
    } else {
      otherLayers += 4 * i;
    }
  }

  let positions = sameLayers * sameLayerPos + otherLayers * otherLayerPos;

  // 4 orthogonal paths
  for (const entryPoint of [
    new Point(input.start.x, 0),
    new Point(input.start.x, input.map.length - 1),
    new Point(0, input.start.y),
    new Point(input.map[0].length - 1, input.start.y),
  ]) {
    positions += countPositions(fillMap(input.map, entryPoint), mapLength - 1);
  }

  // 4 edges
  for (let i = 1; i <= 2; i++) {
    const layer = layers - 2 + i;

    for (const edge of [
      new Point(0, 0),
      new Point(0, input.map.length - 1),
      new Point(input.map[0].length - 1, 0),
      new Point(input.map[0].length - 1, input.map.length - 1),
    ]) {
      positions +=
        layer *
        countPositions(
          fillMap(input.map, edge),
          mapLength + mapLength * (2 - i) - 67
        );
    }
  }

  console.log(positions.toLocaleString());
  console.log(positions);
}
