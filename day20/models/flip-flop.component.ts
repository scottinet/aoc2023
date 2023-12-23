import { Pulse } from '../types/pulse.type';
import { AbstractComponent } from './component.abstract';

export class FlipFlopComponent extends AbstractComponent {
  override type = '%';

  override add(pulse: Pulse, from: string): void {
    if (!pulse.high) super.add(pulse, from);
  }

  flip(): void {
    const item = this.unqueue();

    if (!item || item.pulse.high) return;

    const newPulse: Pulse = { high: this.state === 0, seq: item.pulse.seq };
    this.state = (this.state + 1) % 2;
    this.broadcast(newPulse);
  }
}
