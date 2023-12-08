import lcm from 'compute-lcm';
import { DesertMap } from './models/desert-map.type';
import { NodeFrequency } from './models/node-frequency.type';

function getPeriod(desertMap: DesertMap, startingNode: string): NodeFrequency {
  const freq: NodeFrequency = {
    node: startingNode,
    periodStartIn: 0,
    period: 0,
    subperiods: [],
  };
  const zs: { node: string; encounteredAt: number }[] = [];
  let currentNode = startingNode;
  let nodeIndex = 0;

  for (
    ;
    (freq.periodStartIn = zs.findIndex((z) => z.node === currentNode)) === -1;
    nodeIndex++
  ) {
    const sibblings = desertMap.nodes.get(currentNode);
    const instruction =
      desertMap.instructions[nodeIndex % desertMap.instructions.length];
    currentNode = sibblings[instruction === 'L' ? 0 : 1];

    if (currentNode[currentNode.length - 1] === 'Z') {
      zs.push({ node: currentNode, encounteredAt: nodeIndex });
    }
  }

  freq.node = currentNode;
  freq.period = nodeIndex - freq.periodStartIn;
  freq.subperiods = zs
    .filter((z) => z.node !== freq.node)
    .map((z) => z.encounteredAt - freq.periodStartIn);

  return freq;
}

export function part2(desertMap: DesertMap): void {
  let nodes: string[] = Array.from(desertMap.nodes.keys()).filter(
    (key) => key[key.length - 1] === 'A'
  );

  const frequencies = nodes.map((node) => getPeriod(desertMap, node));

  // ...Ok. I printed the frequencies to have a look at the complexity of the problem... only to see that
  // all periods start at 0, and that there are no subperiods (no "Z" nodes encountered during the period).
  // So, the answer is simply the least common multiple of all periods.
  // (LOL)
  console.dir(frequencies, { depth: null });

  console.log('Necessary moves: ', lcm(...frequencies.map((f) => f.period)));
}
