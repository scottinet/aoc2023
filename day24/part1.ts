import { Point3D } from '@utils/models/point3d.model';
import { InputInfo } from './models/input-info';
import { Vect3D } from './models/vect3d';

function getLine(p: Point3D, v: Vect3D): { a: number; b: number; c: number } {
  const a = v.vy;
  const b = -v.vx;
  return { a, b, c: a * p.x + b * p.y };
}

function getIntersection(
  p1: Point3D,
  v1: Vect3D,
  p2: Point3D,
  v2: Vect3D
): Point3D | null {
  const l1 = getLine(p1, v1);
  const l2 = getLine(p2, v2);
  const det = l1.a * l2.b - l2.a * l1.b;

  if (det === 0) return null;

  return new Point3D(
    (l2.b * l1.c - l1.b * l2.c) / det,
    (l1.a * l2.c - l2.a * l1.c) / det,
    0
  );
}

function inFuture(vect: Vect3D, p1: Point3D, p2: Point3D): boolean {
  return (
    Math.sign(vect.vx) === Math.sign(p2.x - p1.x) &&
    Math.sign(vect.vy) === Math.sign(p2.y - p1.y)
  );
}

function inTestZone(p: Point3D, min: number, max: number): boolean {
  return p.x >= min && p.x <= max && p.y >= min && p.y <= max;
}

export function part1(input: InputInfo): void {
  const { min, max, points, vects } = input;
  let intersections = 0;

  for (let i = 0; i < vects.length - 1; i++) {
    for (let j = i + 1; j < vects.length; j++) {
      const p = getIntersection(points[i], vects[i], points[j], vects[j]);

      if (
        p &&
        inTestZone(p, min, max) &&
        inFuture(vects[i], points[i], p) &&
        inFuture(vects[j], points[j], p)
      ) {
        intersections++;
      }
    }
  }

  console.log(intersections);
}
