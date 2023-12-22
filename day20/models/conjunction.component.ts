import { Pulse } from '../types/pulse.type';
import { AbstractComponent } from './component.abstract';

export class ConjunctionComponent extends AbstractComponent {
  private receivedFromParent: { [key: string]: boolean } = {};

  protected override addParent(parent: AbstractComponent): void {
    super.addParent(parent);
    this.receivedFromParent[parent.name] = false;
  }

  flip(seq: number): void {
    const item = this.unqueue(seq);

    if (!item) return;

    this.receivedFromParent[item.from] = item.pulse.high;

    // State: 0 = all low, 1 = all high, 2 = mixed
    this.state = -1;
    Object.values(this.receivedFromParent).forEach((value) => {
      if (this.state === -1) {
        this.state = value ? 1 : 0;
      } else if (this.state !== (value ? 1 : 0)) {
        this.state = 2;
      }
    });

    const newPulse: Pulse = { high: this.state !== 1, seq };
    this.broadcast(newPulse);
  }
}
