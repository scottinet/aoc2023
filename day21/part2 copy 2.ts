import { Point } from '../utils/types/point.type';
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

type EncounteredFilledMapNode = {
  root: FilledMapNode;
  encountered: number;
};

type GardenTile = { pos: Point; root: FilledMapNode; stepsLeft: number };

type FacesHit = {
  north: FilledMapNode;
  south: FilledMapNode;
  east: FilledMapNode;
  west: FilledMapNode;
};

const gardenExtensionCache: Map<string, FacesHit> = new Map();

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

function getFacesHit(
  map: string[],
  node: FilledMapNode,
  nextStarts: FacesHit = {
    north: null,
    south: null,
    east: null,
    west: null,
  }
): FacesHit {
  const assignIfBetter = (node: FilledMapNode, face: string) => {
    if (nextStarts[face] === null || nextStarts[face].depth > node.depth) {
      nextStarts[face] = node;
    }
  };

  if (node.x === 0) assignIfBetter(node, 'west');
  if (node.x === map[0].length - 1) assignIfBetter(node, 'east');
  if (node.y === 0) assignIfBetter(node, 'south');
  if (node.y === map.length - 1) assignIfBetter(node, 'north');

  return node.neighbours.reduce(
    (acc, neighbour) => getFacesHit(map, neighbour, acc),
    nextStarts
  );
}

function extendGarden(tile: GardenTile, map: string[]): GardenTile[] {
  const nextTiles: GardenTile[] = [];
  const cacheHit = gardenExtensionCache.get(tile.root.toString());
  const nextStarts = cacheHit ?? getFacesHit(map, tile.root);

  if (!cacheHit) {
    gardenExtensionCache.set(tile.root.toString(), nextStarts);
  }

  if (nextStarts.north !== null) {
    nextTiles.push({
      pos: new Point(tile.pos.x, tile.pos.y + 1),
      root: new FilledMapNode(nextStarts.north.x, 0, 0, []),
      stepsLeft: tile.stepsLeft - nextStarts.north.depth,
    });
  }

  if (nextStarts.south !== null) {
    nextTiles.push({
      pos: new Point(tile.pos.x, tile.pos.y - 1),
      root: new FilledMapNode(nextStarts.south.x, map.length - 1, 0, []),
      stepsLeft: tile.stepsLeft - nextStarts.south.depth,
    });
  }

  if (nextStarts.west !== null) {
    nextTiles.push({
      pos: new Point(tile.pos.x - 1, tile.pos.y),
      root: new FilledMapNode(map[0].length - 1, nextStarts.west.y, 0, []),
      stepsLeft: tile.stepsLeft - nextStarts.west.depth,
    });
  }

  if (nextStarts.east !== null) {
    nextTiles.push({
      pos: new Point(tile.pos.x + 1, tile.pos.y),
      root: new FilledMapNode(0, nextStarts.east.y, 0, []),
      stepsLeft: tile.stepsLeft - nextStarts.east.depth,
    });
  }

  return nextTiles.filter((tile) => tile.stepsLeft > 0);
}

function countAttainablePositions(
  filledMap: FilledMapNode,
  totalSteps: number,
  stepsDone = 0
): number {
  const currentValue = filledMap.depth % 2 === totalSteps % 2 ? 1 : 0;

  if (stepsDone === totalSteps) {
    return currentValue;
  }

  return filledMap.neighbours.reduce(
    (acc, neighbour) =>
      acc + countAttainablePositions(neighbour, totalSteps, stepsDone + 1),
    currentValue
  );
}

function maxDepth(filledMap: FilledMapNode): number {
  if (filledMap.neighbours.length === 0) {
    return filledMap.depth;
  }

  return Math.max(filledMap.depth, ...filledMap.neighbours.map(maxDepth));
}

function isEven(p: Point): boolean {
  return (p.x + p.y) % 2 === 0;
}

export function part2(input: GardenMap): void {
  let oddCases = countAttainablePositions(
    fillMap(input.map, new Point(0, 1)),
    MAX_STEPS
  );
  let evenCases = countAttainablePositions(
    fillMap(input.map, new Point(0, 0)),
    MAX_STEPS
  );
  const n = (MAX_STEPS - input.start.x) / input.map[0].length;
  const remainingSteps =
    MAX_STEPS - input.start.x - input.map[0].length * (n - 1);
  let stepsTaken = isEven(input.start) ? evenCases : oddCases;

  // 4 orthogonal paths
  for (const entryPoint of [
    new Point(input.start.x, 0),
    new Point(input.start.x, input.map.length - 1),
    new Point(0, input.start.y),
    new Point(input.map[0].length - 1, input.start.y),
  ]) {
    stepsTaken += (n - 1) * (isEven(entryPoint) ? evenCases : oddCases);
    stepsTaken += countAttainablePositions(
      fillMap(input.map, entryPoint),
      remainingSteps
    );
  }

  // Adding partially filled faces
  console.log(`Remaining steps: ${remainingSteps}`);

  // 4 edges
  // (onionLayers - 1) per edge because we already counted the 4 corners
  const edgeCases = (2 * Math.pow(n - 1, 2) - 2 * (n - 1)) / 4;
  for (const edge of [
    new Point(0, 0),
    new Point(0, input.map.length - 1),
    new Point(input.map[0].length - 1, 0),
    new Point(input.map[0].length - 1, input.map.length - 1),
  ]) {
    const cases = isEven(edge) ? evenCases : oddCases;
    stepsTaken += edgeCases * cases;
    stepsTaken += countAttainablePositions(
      fillMap(input.map, edge),
      remainingSteps
    );
  }

  console.log(stepsTaken.toLocaleString());
  return;
  const start: GardenTile = {
    pos: new Point(0, 0),
    root: fillMap(input.map, input.start),
    stepsLeft: MAX_STEPS,
  };
  const seen: Set<string> = new Set([start.pos.toString()]);
  const filledMaps: Map<string, EncounteredFilledMapNode> = new Map();
  const queue: GardenTile[] = [start];

  while (queue.length > 0) {
    const currentTile = queue.shift();
    const nextTiles = extendGarden(currentTile, input.map);

    for (const nextTile of nextTiles) {
      const nextTileKey = nextTile.pos.toString();

      if (!seen.has(nextTileKey)) {
        let filledMap = filledMaps.get(nextTile.root.toString());

        if (filledMap) {
          filledMap.encountered++;
        } else {
          filledMap = {
            root: fillMap(input.map, nextTile.root),
            encountered: 0,
          };
          filledMaps.set(nextTile.root.toString(), filledMap);
        }

        nextTile.root = filledMap.root;
        seen.add(nextTileKey);
        queue.push(nextTile);
      }
    }
  }

  console.log(
    Array.from(filledMaps.values()).reduce(
      (acc, { root, encountered }) =>
        acc + countAttainablePositions(root, MAX_STEPS) * encountered,
      0
    )
  );
}
