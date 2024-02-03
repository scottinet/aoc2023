import { Point3D } from '@utils/models/point3d.model';
import { InputInfo } from './models/input-info';
import { Vect3D } from './models/vect3d';

// Gauss-Jordan elimination
// See https://fr.wikipedia.org/wiki/%C3%89limination_de_Gauss-Jordan#cite_note-4
function solveEquations(matrix: number[][]): number[] {
  let r = -1;

  for (let j = 0; r < matrix.length - 1 && j < matrix[0].length; j++) {
    let k = r + 1;
    let maxVal = Math.abs(matrix[k][j]);

    for (let i = r + 2; i < matrix.length; i++) {
      if (Math.abs(matrix[i][j]) > maxVal) {
        k = i;
        maxVal = Math.abs(matrix[i][j]);
      }
    }

    if (matrix[k][j] === 0) continue;

    r++;

    const divider = matrix[k][j];
    matrix[k] = matrix[k].map((val) => val / divider);

    if (r !== k) {
      const temp = matrix[r];
      matrix[r] = matrix[k];
      matrix[k] = temp;
    }

    for (let i = 0; i < matrix.length; i++) {
      if (i !== r) {
        const multiplier = matrix[i][j];
        for (let l = 0; l < matrix[0].length; l++) {
          matrix[i][l] -= matrix[r][l] * multiplier;
        }
      }
    }
  }

  return matrix.map((row) => row[matrix[0].length - 1]);
}

function getEquationXY(
  p1: Point3D,
  v1: Vect3D,
  p2: Point3D,
  v2: Vect3D
): number[] {
  return [
    v2.vy - v1.vy,
    v1.vx - v2.vx,
    p1.y - p2.y,
    p2.x - p1.x,
    p2.x * v2.vy - p2.y * v2.vx - p1.x * v1.vy + p1.y * v1.vx,
  ];
}

function getEquationYZ(
  p1: Point3D,
  v1: Vect3D,
  p2: Point3D,
  v2: Vect3D
): number[] {
  return [
    v2.vz - v1.vz,
    v1.vy - v2.vy,
    p1.z - p2.z,
    p2.y - p1.y,
    p2.y * v2.vz - p2.z * v2.vy - p1.y * v1.vz + p1.z * v1.vy,
  ];
}

export function part2(input: InputInfo): void {
  // Going to solve a system of equations, where the line crossing all
  // other lines is the solution of the system.
  // Let the input lines be named a1, a2, a3, ..., an
  // And let's name the line crossing all other lines as b
  // The equation for each line is:
  //    bx + t*vbx = a1x + t*v1x  (same for y and z)
  // So we can rewrite the equation as:
  //    bx - a1x = t*(v1x - vbx)
  //    t = (bx - a1x) / (v1x - vbx)
  // Since it's the same for all lines, if we add another one, we have:
  //    t = (bx - a1x) / (v1x - vbx) = (bx - a2x) / (v2x - vbx)
  //    (bx - a1x) * (v2x - vbx) = (bx - a2x) * (v1x - vbx)
  ///   ... some more math later ...
  //    (v2y - v1y) * bx + (v1x -v2x) * by + (a1y - a2y) * vbx + (a2x - a1x) * vby = a2x * v2y - a2y * v2x - a1x * v1y + a1y * v1x
  // Each equation has 4 unknowns, and we also must solve similar equations to find bz and vbz
  // (well actually finding z/bz should be easier once we know x/bx/y/by, but I'm going to use the same approach for all)

  const equationsXY: number[][] = [];
  const equationsYZ: number[][] = [];
  const p1 = input.points[0];
  const v1 = input.vects[0];

  for (let i = 1; i < 5; i++) {
    const p2 = input.points[i];
    const v2 = input.vects[i];

    equationsXY.push(getEquationXY(p1, v1, p2, v2));
    equationsYZ.push(getEquationYZ(p1, v1, p2, v2));
  }

  const solutionXY = solveEquations(equationsXY);
  const solutionYZ = solveEquations(equationsYZ);

  const x = Math.round(solutionXY[0]);
  const y = Math.round(solutionXY[1]);
  const z = Math.round(solutionYZ[1]);
  console.log(`X: ${x}, Y: ${y}, Z: ${z}`);
  console.log(`Sum: ${x + y + z}`);
}
