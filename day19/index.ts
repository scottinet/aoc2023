import { promises as fs } from 'fs';
import { chrono } from '../utils/chrono';
import { part1 } from './part1';
import { part2 } from './part2';
import { Day19Input } from './types/day19-input.type';
import { MachinePart } from './types/machine-part.type';
import { Workflow } from './types/workflow.type';

function parseWorkflow(input: string): { name: string; wf: Workflow } {
  const [_, name, operations] = input.match(/^(.*?){(.*)}$/);
  const wf: Workflow = {
    operations: [],
    destIfRejected: '',
  };

  for (const op of operations.split(',')) {
    let result = op.match(/^(.*?)([<>])(.*?):(.*?)$/);

    if (result === null) {
      wf.destIfRejected = op;
    } else {
      const [_, part, operator, value, destIfTrue] = result;
      wf.operations.push({
        part,
        operator,
        value: parseInt(value, 10),
        destIfTrue,
      });
    }
  }

  return { name, wf };
}

function parseParts(input: string): MachinePart {
  // {x=787,m=2655,a=1222,s=2876}
  const result = input.match(/^\{(.*)\}$/)[1].split(',');
  const part: MachinePart = { x: 0, m: 0, a: 0, s: 0 };

  for (const r of result) {
    const [_, name, value] = r.match(/^(.*?)=(\d+)$/);
    part[name] = parseInt(value, 10);
  }

  return part;
}

async function parseInput(inputFileName: string): Promise<Day19Input> {
  const input = await fs.readFile(inputFileName, 'utf8');
  const lines = input.split('\n');
  const workflow = new Map<string, Workflow>();
  const parts: MachinePart[] = [];
  let partsReached = false;

  for (const line of lines) {
    if (line === '') {
      partsReached = true;
    } else if (partsReached) {
      parts.push(parseParts(line));
    } else {
      const { name, wf } = parseWorkflow(line);
      workflow.set(name, wf);
    }
  }

  return { workflow, parts };
}

async function main(inputFileName: string): Promise<void> {
  const input = await parseInput(inputFileName);

  chrono<Day19Input>(part1, input, 'part1');
  chrono<Day19Input>(part2, input, 'part2');
}

main(process.argv[2]);
