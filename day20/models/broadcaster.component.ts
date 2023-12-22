import { AbstractComponent } from './component.abstract';

export class BroadcasterComponent extends AbstractComponent {
  flip(seq: number): void {
    const item = this.unqueue(seq);

    if (item) this.broadcast(item.pulse);
  }
}
