import { PartNumber } from './part-number.type';
import { Point } from './point.type';

export type Gear = {
  position: Point;
  partNumbers: Array<PartNumber>;
  ratio: number;
};
