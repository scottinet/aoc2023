import { Point } from '@utils/models/point.model';

export class HikePoint extends Point {
  constructor(
    x: number,
    y: number,
    public readonly type: string
  ) {
    super(x, y);
  }
}
