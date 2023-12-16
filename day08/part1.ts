import { DesertMap } from './models/desert-map.type';

export function part1(desertMap: DesertMap): void {
  let count = 0;
  let currentNode: string = 'AAA';

  while (currentNode !== 'ZZZ') {
    const sibblings = desertMap.nodes.get(currentNode);
    const instruction =
      desertMap.instructions[count % desertMap.instructions.length];
    currentNode = sibblings[instruction === 'L' ? 0 : 1];
    count++;
  }

  console.log('Necessary moves: ', count);
}
