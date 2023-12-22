import { Pulse } from 'day20/types/pulse.type';

export type QueuedPulse = { from: string; pulse: Pulse };

export abstract class AbstractComponent {
  private _queue: QueuedPulse[] = [];
  private _children: AbstractComponent[] = [];
  protected parents: AbstractComponent[] = [];
  name: string;
  state: number = 0;
  highPulsesHistory: number = 0;
  lowPulsesHistory: number = 0;

  constructor(name: string) {
    this.name = name;
  }

  add(pulse: Pulse, from: string): void {
    this._queue.push({ from, pulse });
  }

  connect(child: AbstractComponent): void {
    this._children.push(child);
    child.addParent(this);
  }

  get children(): AbstractComponent[] {
    return this._children;
  }

  get hasWork(): boolean {
    return this._queue.length > 0;
  }

  protected addParent(parent: AbstractComponent): void {
    this.parents.push(parent);
  }

  protected broadcast(pulse: Pulse): void {
    this._children.forEach((child) => {
      // console.log(
      //   `${this.name} -${pulse.high ? 'high' : 'low'}-> ${child.name}`
      // );
      child.add(pulse, this.name);
    });
    this.record(pulse, this._children.length);
  }

  protected unqueue(seq: number): QueuedPulse {
    return this._queue.shift();
  }

  protected record(pulse: Pulse, pulsesSent: number): void {
    if (pulse.high) this.highPulsesHistory += pulsesSent;
    else this.lowPulsesHistory += pulsesSent;
  }

  abstract flip(seq: number): void;
}
