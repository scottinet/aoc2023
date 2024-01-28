import { HikePoint } from './models/hike-point.model';

type HikeSegment = {
  start: HikePoint;
  end: HikePoint;
  points: Set<string>;
  length: number;
  prev: HikeSegment | null;
};

type Segment = {
  start: HikePoint;
  end: HikePoint;
  length: number;
  next: HikePoint[];
};

const segments: Map<string, Segment> = new Map();

function getSegment(
  points: Map<string, HikePoint>,
  start: HikePoint,
  prev: HikePoint
): Segment {
  const segment = segments.get(start.toString());
  if (segment) return segment;

  let neighbours = start
    .getNeighbours()
    .map((n) => points.get(n.toString()))
    .filter((n) => n && !n.equals(prev));
  let end = start;
  let length = 0;

  while (neighbours.length === 1) {
    const prev = end;
    end = neighbours[0];
    length++;
    neighbours = end
      .getNeighbours()
      .map((n) => points.get(n.toString()))
      .filter((n) => n && !n.equals(prev));
  }

  const segmentData = { start, end, length, next: neighbours };
  segments.set(start.toString(), segmentData);
  return segmentData;
}

export function part2(data: HikePoint[]): void {
  const start = data.filter((p) => p.y === 0)[0];
  const end = data.filter((p) => p.y === data[data.length - 1].y)[0];
  let maxLength = 0;
  let startSegment: HikeSegment = {
    start,
    end: start,
    points: new Set([start.toString()]),
    length: 0,
    prev: null,
  };
  const queue: HikeSegment[] = [startSegment];

  const pointsMap = new Map<string, HikePoint>();
  data.forEach((p) => pointsMap.set(p.toString(), p));

  while (queue.length > 0) {
    const current = queue.pop();
    const segment = getSegment(
      pointsMap,
      current.start,
      current.prev?.end ?? current.start
    );

    if (current.points.has(segment.end.toString())) continue;

    current.end = segment.end;
    current.points.add(segment.end.toString());
    current.length += segment.length;

    if (segment.end.equals(end)) {
      if (current.length > maxLength) {
        console.log(
          `New candidate: ${current.length} (queue remaining: ${queue.length})`
        );
      }

      maxLength = Math.max(maxLength, current.length);
    }

    queue.push(
      ...segment.next
        .filter((n) => !current.points.has(n.toString()))
        .map((n) => ({
          start: n,
          end: n,
          length: current.length + 1,
          points: new Set([...current.points, n.toString()]),
          prev: current,
        }))
    );
  }

  console.log(maxLength);
}
