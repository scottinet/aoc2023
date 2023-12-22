import { Pulse } from '../types/pulse.type';
import { AbstractComponent } from './component.abstract';

export class ButtonComponent extends AbstractComponent {
  flip(seq: number): void {
    const pulse: Pulse = { high: false, seq };
    this.broadcast(pulse);
  }
}
