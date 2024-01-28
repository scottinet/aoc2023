import { Point } from '@utils/models/point.model';
import { InputInfo } from './models/input-info';
import { Vect3D } from './models/vect3d';

function getLine(p: Vect3D): { a: number; b: number; c: number } {
  const a = p.vy;
  const b = -p.vx;
  return { a, b, c: a * p.x + b * p.y };
}

function getIntersection(p1: Vect3D, p2: Vect3D): Point | null {
  const l1 = getLine(p1);
  const l2 = getLine(p2);
  const det = l1.a * l2.b - l2.a * l1.b;

  if (det === 0) return null;

  return new Point(
    (l2.b * l1.c - l1.b * l2.c) / det,
    (l1.a * l2.c - l2.a * l1.c) / det
  );
}

function inFuture(vect: Vect3D, p: Point): boolean {
  return (
    Math.sign(vect.vx) === Math.sign(p.x - vect.x) &&
    Math.sign(vect.vy) === Math.sign(p.y - vect.y)
  );
}

function inTestZone(p: Point, min: number, max: number): boolean {
  return p.x >= min && p.x <= max && p.y >= min && p.y <= max;
}

export function part1(input: InputInfo): void {
  const { min, max, vects } = input;
  let intersections = 0;

  for (let i = 0; i < vects.length - 1; i++) {
    for (let j = i + 1; j < vects.length; j++) {
      const p = getIntersection(vects[i], vects[j]);

      if (
        p &&
        inTestZone(p, min, max) &&
        inFuture(vects[i], p) &&
        inFuture(vects[j], p)
      ) {
        intersections++;
      }
    }
  }

  console.log(intersections);
}
