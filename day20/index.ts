import lcm from 'compute-lcm';
import { promises as fs } from 'fs';
import { chrono } from '../utils/chrono';
import { BlackHoleComponent } from './models/blackhole.component';
import { BroadcasterComponent } from './models/broadcaster.component';
import { ButtonComponent } from './models/button.component';
import { AbstractComponent } from './models/component.abstract';
import { ConjunctionComponent } from './models/conjunction.component';
import { FlipFlopComponent } from './models/flip-flop.component';

async function parseInput(inputFileName: string): Promise<ButtonComponent> {
  const input = await fs.readFile(inputFileName, 'utf8');
  const lines = input.split('\n');
  const button = new ButtonComponent('button');
  const toConnect: Map<AbstractComponent, string[]> = new Map();
  const dict: Map<string, AbstractComponent> = new Map();
  toConnect.set(button, ['broadcaster']);

  for (const line of lines) {
    let [name, args] = line.split(' -> ');
    const componentArgs = args.split(', ');
    const type = name.at(0);
    let component: AbstractComponent;

    if (name === 'broadcaster') {
      component = new BroadcasterComponent('broadcaster');
    } else if (['&', '%'].includes(type)) {
      name = name.substring(1);

      component =
        type === '&'
          ? new ConjunctionComponent(name)
          : new FlipFlopComponent(name);
    } else {
      throw new Error(`Unknown component type ${type}`);
    }

    toConnect.set(component, componentArgs);
    dict.set(name, component);
  }

  for (const [component, args] of toConnect) {
    for (const arg of args) {
      let child = dict.get(arg);
      if (!child) {
        child = new BlackHoleComponent(arg);
        dict.set(arg, child);
      }

      component.connect(child);
    }
  }

  return button;
}

function getComponentsList(automaton: ButtonComponent): AbstractComponent[] {
  const components: Set<AbstractComponent> = new Set();
  const queue: AbstractComponent[] = [automaton];

  while (queue.length > 0) {
    const component = queue.shift();

    if (!components.has(component)) {
      components.add(component);
      queue.push(...component.children);
    }
  }

  return Array.from(components);
}

function pressButton(
  compList: AbstractComponent[],
  automaton: AbstractComponent,
  seq: number
): void {
  let queue: AbstractComponent[] = [
    compList.find((c) => c.name === 'broadcaster'),
  ];
  automaton.flip();

  while (queue.length > 0) {
    const component = queue.shift();
    component.flip();

    queue = queue
      .concat(...component.children)
      .filter((c) => c.hasWork)
      .sort((a, b) => a.lowestPulseSequence - b.lowestPulseSequence);
  }
}

export function part1(automaton: ButtonComponent): void {
  const components = getComponentsList(automaton);
  let high = 0;
  let low = 0;

  for (let seq = 0; seq < 1000; seq++) {
    pressButton(components, automaton, seq);
  }

  for (const component of components) {
    high += component.highPulsesHistory;
    low += component.lowPulsesHistory;
  }
  console.log(`High pulses: ${high}, low pulses: ${low}`);
  console.log(`Part 1: ${high * low}`);
}

function part2(automaton: ButtonComponent): void {
  const components = getComponentsList(automaton);
  const rx = components.filter((c) => c.name === 'rx')[0];
  const monitoredComponents = rx.parents[0].parents;
  const cycles: Map<AbstractComponent, number> = new Map();

  for (let seq = 0; seq < 1000000; seq++) {
    pressButton(components, automaton, seq);

    for (const comp of monitoredComponents) {
      if (!cycles.has(comp) && comp.highPulsesHistory > 0) {
        console.log(`${comp.name} should be attained after ${seq} signals`);
        cycles.set(comp, seq + 1);
      }
    }

    if (cycles.size === monitoredComponents.length) {
      break;
    }
  }

  console.log(
    `Low signal should be sent to RX after ${lcm(
      Array.from(cycles.values())
    )} button presses`
  );
}

async function main(inputFileName: string): Promise<void> {
  chrono<ButtonComponent>(part1, await parseInput(inputFileName), 'part1');
  chrono<ButtonComponent>(part2, await parseInput(inputFileName), 'part2');
}

main(process.argv[2]);
