import { HikePoint } from './models/hike-point.model';

type HikeSegment = {
  start: HikePoint;
  end: HikePoint;
  length: number;
  next: HikeSegment[];
};

function findStart(points: HikePoint[]): HikePoint {
  const candidates = points.filter((p) => p.y === 0);

  if (candidates.length > 1) throw new Error('Multiple start points found');
  if (candidates.length === 0) throw new Error('No start point found');

  return candidates[0];
}

function findEnd(points: HikePoint[]): HikePoint {
  const candidates = points.filter((p) => p.y === points[points.length - 1].y);

  if (candidates.length > 1) throw new Error('Multiple end points found');
  if (candidates.length === 0) throw new Error('No end point found');

  return candidates[0];
}

function getNeighbours(
  points: Map<string, HikePoint>,
  point: HikePoint,
  prev: HikePoint
): HikePoint[] {
  const neighbours: HikePoint[] = [];

  for (const n of point.getNeighbours()) {
    if (n.equals(prev)) continue;
    const neighbour = points.get(n.toString());

    if (neighbour) {
      if (
        neighbour.type === '.' ||
        (neighbour.type === '>' && point.x < n.x) ||
        (neighbour.type === '<' && point.x > n.x) ||
        (neighbour.type === '^' && point.y > n.y) ||
        (neighbour.type === 'v' && point.y < n.y)
      ) {
        neighbours.push(neighbour);
      }
    }
  }

  return neighbours;
}

function buildGraph(points: HikePoint[]): HikeSegment {
  const start = findStart(points);
  let startSegment: HikeSegment = {
    start,
    end: start,
    length: 0,
    next: [],
  };
  const queue: HikeSegment[] = [startSegment];
  const visited = new Set<string>();
  const pointsMap = new Map<string, HikePoint>();
  points.forEach((p) => pointsMap.set(p.toString(), p));

  while (queue.length > 0) {
    const current = queue.shift();
    let neighbours = getNeighbours(pointsMap, current.end, current.start);

    while (neighbours.length === 1) {
      const prev = current.end;
      current.end = neighbours[0];
      current.length++;
      neighbours = getNeighbours(pointsMap, current.end, prev);
    }

    const key = current.start.toString() + '-' + current.end.toString();

    if (visited.has(key)) continue;

    visited.add(key);
    const next = neighbours.map((n) => ({
      start: n,
      end: n,
      length: current.length + 1,
      next: [],
    }));
    current.next = next;
    queue.push(...next);
  }

  return startSegment;
}

export function part1(data: HikePoint[]): void {
  const graph = buildGraph(data);

  const end = findEnd(data);
  const queue: HikeSegment[] = [graph];
  let maxLength = 0;

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (current.end.toString() === end.toString()) {
      maxLength = Math.max(maxLength, current.length);
    }
    queue.push(...current.next);
  }

  console.log(maxLength);
}
