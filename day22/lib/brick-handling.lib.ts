import { SettledBrick } from '../models/settled-brick.type';
import { Brick } from '../types/brick.type';

export function settleTo(brick: SettledBrick, targetZ: number): void {
  const delta = Math.abs(targetZ - Math.min(brick.start.z, brick.end.z));

  brick.start.z -= delta;
  brick.end.z -= delta;
}

export function isPointInBrick(x: number, y: number, brick: Brick): boolean {
  const minx = Math.min(brick.start.x, brick.end.x);
  const maxx = Math.max(brick.start.x, brick.end.x);
  const miny = Math.min(brick.start.y, brick.end.y);
  const maxy = Math.max(brick.start.y, brick.end.y);

  return x >= minx && x <= maxx && y >= miny && y <= maxy;
}
