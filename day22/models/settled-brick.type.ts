import { Brick } from '../types/brick.type';

export interface SettledBrick extends Brick {
  supporting: SettledBrick[];
  supportedBy: SettledBrick[];
}
