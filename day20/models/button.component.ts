import { Pulse } from '../types/pulse.type';
import { AbstractComponent } from './component.abstract';

export class ButtonComponent extends AbstractComponent {
  override type = 'B';

  flip(): void {
    const pulse: Pulse = { high: false, seq: 0 };
    this.broadcast(pulse);
  }
}
