import { PartNumber } from './part-number.type';

export type Schematic = {
  parts: Array<PartNumber>;
  content: Array<string>;
};
