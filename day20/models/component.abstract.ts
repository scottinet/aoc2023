import { Pulse } from 'day20/types/pulse.type';

export type QueuedPulse = { from: string; pulse: Pulse };

export abstract class AbstractComponent {
  private _queue: QueuedPulse[] = [];
  private _children: AbstractComponent[] = [];
  protected _parents: AbstractComponent[] = [];
  readonly type: string;
  name: string;
  state: number = 0;
  highPulsesHistory: number = 0;
  lowPulsesHistory: number = 0;

  constructor(name: string) {
    this.name = name;
  }

  add(pulse: Pulse, from: string): void {
    this._queue.push({ from, pulse });
    this._queue.sort((a, b) => a.pulse.seq - b.pulse.seq);
  }

  connect(child: AbstractComponent): void {
    this._children.push(child);
    child.addParent(this);
  }

  get children(): AbstractComponent[] {
    return this._children;
  }

  get parents(): AbstractComponent[] {
    return this._parents;
  }

  get hasWork(): boolean {
    return this._queue.length > 0;
  }

  get lowestPulseSequence(): number {
    return this._queue[0].pulse.seq;
  }

  protected addParent(parent: AbstractComponent): void {
    this._parents.push(parent);
  }

  protected broadcast(pulse: Pulse): void {
    pulse = { high: pulse.high, seq: pulse.seq + 1 };

    this._children.forEach((child) => {
      // console.log(
      //   `${this.name} -${pulse.high ? 'high' : 'low'}-> ${child.name}`
      // );
      child.add(pulse, this.name);
    });
    this.record(pulse, this._children.length);
  }

  protected unqueue(): QueuedPulse {
    return this._queue.shift();
  }

  protected record(pulse: Pulse, pulsesSent: number): void {
    if (pulse.high) this.highPulsesHistory += pulsesSent;
    else this.lowPulsesHistory += pulsesSent;
  }

  abstract flip(): void;
}
