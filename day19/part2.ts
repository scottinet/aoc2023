import { Day19Input } from './types/day19-input.type';
import { Workflow } from './types/workflow.type';

const MIN_RATING = 1;
const MAX_RATING = 4000;

type Range = { min: number; max: number };
type PercolatedPart = { x: Range; m: Range; a: Range; s: Range };

function diffRange(range: Range): number {
  return range.max - range.min + 1;
}

function getPartValue(part: PercolatedPart): number {
  return (
    diffRange(part.x) *
    diffRange(part.m) *
    diffRange(part.a) *
    diffRange(part.s)
  );
}

function cut(
  range: Range,
  value: number,
  sign: string
): { truthy: Range; falsey: Range } {
  let result: { truthy: Range; falsey: Range };

  if (sign === '<') {
    result = {
      truthy: { min: range.min, max: value - 1 },
      falsey: { min: value, max: range.max },
    };
  } else {
    result = {
      truthy: { min: value + 1, max: range.max },
      falsey: { min: range.min, max: value },
    };
  }

  if (result.truthy.min >= result.truthy.max) result.truthy = null;
  if (result.falsey.min >= result.falsey.max) result.falsey = null;

  return result;
}

function percolate(
  workflow: Map<string, Workflow>,
  node: PercolatedPart,
  name: string
): number {
  if (name === 'R') return 0;
  if (name === 'A') return getPartValue(node);

  const wf = workflow.get(name);
  let combinations = 0;

  for (const op of wf.operations) {
    const { truthy, falsey } = cut(node[op.part], op.value, op.operator);

    if (truthy) {
      combinations += percolate(
        workflow,
        { ...node, [op.part]: truthy },
        op.destIfTrue
      );
    }
    node = { ...node, [op.part]: falsey };
  }

  return combinations + percolate(workflow, node, wf.destIfRejected);
}

export function part2(input: Day19Input): void {
  const start: PercolatedPart = {
    x: { min: MIN_RATING, max: MAX_RATING },
    m: { min: MIN_RATING, max: MAX_RATING },
    a: { min: MIN_RATING, max: MAX_RATING },
    s: { min: MIN_RATING, max: MAX_RATING },
  };

  console.log(percolate(input.workflow, start, 'in'));
}
