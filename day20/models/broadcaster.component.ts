import { AbstractComponent } from './component.abstract';

export class BroadcasterComponent extends AbstractComponent {
  override type = 'BC';

  flip(): void {
    const item = this.unqueue();

    if (item) this.broadcast(item.pulse);
  }
}
