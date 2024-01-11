import { Point3D } from '@utils/models/point3d.model';

export interface Brick {
  name: string;
  start: Point3D;
  end: Point3D;
}
