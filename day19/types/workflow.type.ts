import { Operation } from './operation.type';

export type Workflow = {
  operations: Operation[];
  destIfRejected: string;
};
