import { chrono } from '@utils/chrono';
import { readFile } from 'fs/promises';
import { GraphNode } from './models/graph-node';
import { part1 } from './part1';
import { part2 } from './part2';

async function parse(inputFileName: string): Promise<Map<string, GraphNode>> {
  const input = await readFile(inputFileName, 'utf-8');
  const graph: Map<string, GraphNode> = new Map();

  for (const line of input.split('\n')) {
    const [name, neighbours] = line.split(': ');
    const node = graph.get(name) ?? { name, neighbours: [] };

    for (const neighbour of neighbours.split(' ')) {
      const neighbourNode = graph.get(neighbour) || {
        name: neighbour,
        neighbours: [],
      };

      node.neighbours.push(neighbourNode.name);
      neighbourNode.neighbours.push(node.name);
      graph.set(neighbourNode.name, neighbourNode);
    }

    graph.set(node.name, node);
  }

  return graph;
}

async function main(inputFileName: string): Promise<void> {
  const input = await parse(inputFileName);

  chrono<Map<string, GraphNode>>(part1, input, 'part1');
  chrono<Map<string, GraphNode>>(part2, input, 'part2');
}

main(process.argv[2]);
