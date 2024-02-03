import { Point3D } from '@utils/models/point3d.model';
import { Vect3D } from './vect3d';

export interface InputInfo {
  min: number;
  max: number;
  points: Point3D[];
  vects: Vect3D[];
}
