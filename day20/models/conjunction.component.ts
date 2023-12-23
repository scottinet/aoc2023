import { Pulse } from '../types/pulse.type';
import { AbstractComponent } from './component.abstract';

export class ConjunctionComponent extends AbstractComponent {
  override type = '&';
  private receivedFromParent: { [key: string]: number } = {};

  protected override addParent(parent: AbstractComponent): void {
    super.addParent(parent);
    this.receivedFromParent[parent.name] = 0;
  }

  flip(): void {
    const item = this.unqueue();

    if (!item) return;

    this.receivedFromParent[item.from] = item.pulse.high ? 1 : 0;
    this.state = Object.values(this.receivedFromParent).every((v) => v === 1)
      ? 1
      : 0;

    const newPulse: Pulse = { high: this.state !== 1, seq: item.pulse.seq };
    this.broadcast(newPulse);
  }
}
