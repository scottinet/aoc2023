import { Point3D } from '@utils/models/point3d.model';

export class Vect3D extends Point3D {
  constructor(
    x: number,
    y: number,
    z: number,
    public vx: number,
    public vy: number,
    public vz: number
  ) {
    super(x, y, z);
  }
}
