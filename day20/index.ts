import { promises as fs } from 'fs';
import { chrono } from '../utils/chrono';
import { BlackHoleComponent } from './models/blackhole.component';
import { BroadcasterComponent } from './models/broadcaster.component';
import { ButtonComponent } from './models/button.component';
import { AbstractComponent } from './models/component.abstract';
import { ConjunctionComponent } from './models/conjunction.component';
import { FlipFlopComponent } from './models/flip-flop.component';
import { part1 } from './part1';
import { part2 } from './part2';

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
        console.log(`New black hole component: ${arg}`);
      }

      component.connect(child);
    }
  }

  return button;
}

async function main(inputFileName: string): Promise<void> {
  const input = await parseInput(inputFileName);

  chrono<ButtonComponent>(part1, input, 'part1');
  chrono<ButtonComponent>(part2, input, 'part2');
}

main(process.argv[2]);
