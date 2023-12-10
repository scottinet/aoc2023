import { Point } from './point.type';

export type GridNode = {
  str: string;
  coords: Point;
  links: Point[];
};
