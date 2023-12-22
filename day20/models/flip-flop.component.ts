import { Pulse } from '../types/pulse.type';
import { AbstractComponent } from './component.abstract';

export class FlipFlopComponent extends AbstractComponent {
  flip(seq: number): void {
    const item = this.unqueue(seq);

    if (!item || item.pulse.high) return;

    const newPulse: Pulse = { high: this.state === 0, seq };
    this.state = (this.state + 1) % 2;
    this.broadcast(newPulse);
  }
}
