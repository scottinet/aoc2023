import { MachinePart } from './machine-part.type';
import { Workflow } from './workflow.type';

export type Day19Input = {
  workflow: Map<string, Workflow>;
  parts: MachinePart[];
};
