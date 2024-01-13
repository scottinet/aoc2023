import { SettledBrick } from './models/settled-brick.type';

export function part1(bricks: SettledBrick[]): void {
  let destroyable = 0;

  for (const brick of bricks) {
    if (brick.supporting.length === 0) {
      destroyable++;
    } else {
      if (brick.supporting.every((s) => s.supportedBy.length > 1)) {
        destroyable++;
      }
    }
  }

  console.log(destroyable);
}
