import { ButtonComponent } from './models/button.component';
import { AbstractComponent } from './models/component.abstract';

type CycleState = { index: number; highPulses: number; lowPulses: number };

const cache: Map<string, CycleState> = new Map();

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

function memoize(
  components: AbstractComponent[],
  sequence: number
): CycleState {
  let state = '';
  let high = 0;
  let low = 0;

  for (const component of components) {
    state += component.state;
    high += component.highPulsesHistory;
    low += component.lowPulsesHistory;
  }

  const memoizedCache = cache.get(state);

  if (memoizedCache) {
    return {
      index: memoizedCache.index,
      highPulses: high - memoizedCache.highPulses,
      lowPulses: low - memoizedCache.lowPulses,
    };
  }

  cache.set(state, { index: sequence, highPulses: high, lowPulses: low });
  return null;
}

function getReadyToWork(start: AbstractComponent): AbstractComponent[] {
  let comp: AbstractComponent[] = [start];

  while (!comp.some((c) => c.hasWork)) {
    comp = comp.flatMap((c) => c.children);
  }

  return comp;
}

function runLoop(
  compList: AbstractComponent[],
  automaton: AbstractComponent,
  seq: number
): void {
  const seen: Map<AbstractComponent, boolean> = new Map();
  let currentPhase: AbstractComponent[] = [
    compList.find((c) => c.name === 'broadcaster'),
  ];
  automaton.flip(seq);

  while (compList.some((component) => component.hasWork)) {
    let worked = false;
    for (const component of currentPhase) {
      if (!seen.has(component)) {
        seen.set(component, true);
        component.flip(seq);
        worked = true;
      }
    }

    if (worked === false) {
      seen.clear();
      currentPhase = getReadyToWork(automaton);
    } else {
      currentPhase = currentPhase.flatMap((component) => component.children);
    }
  }
}

export function part1(automaton: ButtonComponent): void {
  const components = getComponentsList(automaton);
  let cycle: CycleState = null;
  let high = 0;
  let low = 0;

  for (let seq = 0; seq < 1000; seq++) {
    cycle = memoize(components, seq);

    if (cycle !== null) {
      const cycleLength = seq - cycle.index;
      const remaining = Math.floor((1000 - seq) / cycleLength);
      seq += remaining * seq;
      high = cycle.highPulses + remaining * cycle.highPulses;
      low = cycle.lowPulses + remaining * cycle.lowPulses;
      continue;
    }

    runLoop(components, automaton, seq);
  }

  if (!cycle) {
    console.log('No cycle found');
    for (const component of components) {
      high += component.highPulsesHistory;
      low += component.lowPulsesHistory;
    }
    console.log(`High pulses: ${high}, low pulses: ${low}`);
  }

  console.log(`Part 1: ${high * low}`);
}
