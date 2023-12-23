import { Pulse } from 'day20/types/pulse.type';
import { AbstractComponent } from './component.abstract';

export class BlackHoleComponent extends AbstractComponent {
  override type = 'BH';

  override add(pulse: Pulse, from: string): void {
    // do nothing
  }

  override get hasWork(): boolean {
    return false;
  }

  flip(): boolean {
    return false;
  }
}
