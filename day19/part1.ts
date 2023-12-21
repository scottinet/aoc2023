import { Day19Input } from './types/day19-input.type';
import { MachinePart } from './types/machine-part.type';
import { Workflow } from './types/workflow.type';

function getPartValue(part: MachinePart): number {
  return part.x + part.m + part.a + part.s;
}

function executeWorkflow(
  workflow: Map<string, Workflow>,
  part: MachinePart,
  name: string
): number {
  const wf = workflow.get(name);
  let destination = wf.destIfRejected;

  for (const op of wf.operations) {
    const value = part[op.part];
    const pass = op.operator === '<' ? value < op.value : value > op.value;

    if (pass) {
      destination = op.destIfTrue;
      break;
    }
  }

  if (destination === 'R') return 0;
  if (destination === 'A') return getPartValue(part);
  return executeWorkflow(workflow, part, destination);
}

export function part1(input: Day19Input): void {
  let sum = 0;
  for (const part of input.parts) {
    sum += executeWorkflow(input.workflow, part, 'in');
  }

  console.log(sum);
}
