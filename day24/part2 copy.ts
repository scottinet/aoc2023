import { Point3D } from '@utils/models/point3d.model';
import { InputInfo } from './models/input-info';
import { Vect3D } from './models/vect3d';

const EPSILON = 10e-6;
const MAX_STARTS = 100;

function dotProduct(v1: Vect3D, v2: Vect3D): number {
  return v1.vx * v2.vx + v1.vy * v2.vy + v1.vz * v2.vz;
}

function crossProduct(p1: Point3D, p2: Point3D): Vect3D {
  return new Vect3D(
    p1.y * p2.z - p1.z * p2.y,
    p1.z * p2.x - p1.x * p2.z,
    p1.x * p2.y - p1.y * p2.x
  );
}

function intersects(p1: Point3D, v1: Vect3D, q1: Point3D, v2: Vect3D): boolean {
  const p2 = new Point3D(p1.x + v1.vx, p1.y + v1.vy, p1.z + v1.vz);
  const pm = crossProduct(p1, p2);
  const q2 = new Point3D(q1.x + v2.vx, q1.y + v2.vy, q1.z + v2.vz);
  const qm = crossProduct(q1, q2);

  return dotProduct(v1, qm) + dotProduct(v2, pm) < EPSILON;
}

export function part2(input: InputInfo): void {
  const lines: { point: Point3D; vect: Vect3D }[] = input.vects.map(
    (vect, i) => {
      return { point: input.points[i].clone(), vect };
    }
  );
  const starts: Point3D[] = [];
  let candidate: { point: Point3D; vect: Vect3D } = null;

  for (let i = 0; candidate === null; i++) {
    for (const line of lines) {
      line.point.x += line.vect.vx;
      line.point.y += line.vect.vy;
      line.point.z += line.vect.vz;
    }

    lines.sort((a, b) => a.point.z - b.point.z);

    for (let j = 0; j < starts.length; j++) {
      const jumps = Math.min(i, MAX_STARTS) - j;
      const vect = new Vect3D(
        (lines[1].point.x - starts[j].x) / jumps,
        (lines[1].point.y - starts[j].y) / jumps,
        (lines[1].point.z - starts[j].z) / jumps
      );

      if (
        lines
          .slice(2)
          .every((line) => intersects(starts[j], vect, line.point, line.vect))
      ) {
        candidate = { point: starts[j], vect };
        break;
      }
    }

    starts.push(lines[0].point.clone());

    if (starts.length > MAX_STARTS) starts.shift();
  }

  const throwPosition = new Point3D(
    candidate.point.x - candidate.vect.vx,
    candidate.point.y - candidate.vect.vy,
    candidate.point.z - candidate.vect.vz
  );

  console.log('Throw position:', throwPosition);
  console.log('Sum: ', throwPosition.x + throwPosition.y + throwPosition.z);
}
