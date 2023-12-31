import { promises as fs } from 'fs';
import { chrono } from '../utils/chrono';

type GraphNode = {
  x: number;
  y: number;
  dx: number;
  dy: number;
  value: number;
};

function printGraph(
  input: number[][],
  cameFrom: Map<string, GraphNode>,
  end: GraphNode
): void {
  const path: GraphNode[] = [];

  let current = end;
  while (current) {
    path.push(current);
    current = cameFrom.get(JSON.stringify(current));
  }

  for (let y = 0; y < input.length; y++) {
    let line = '';
    for (let x = 0; x < input[0].length; x++) {
      const node = path.find((n) => n.x === x && n.y === y);
      if (node) {
        if (node.dx === 0 && node.dy === 1) line += 'v';
        else if (node.dx === 0 && node.dy === -1) line += '^';
        else if (node.dx === 1 && node.dy === 0) line += '>';
        else if (node.dx === -1 && node.dy === 0) line += '<';
      } else {
        line += input[y][x];
      }
    }
    console.log(line);
  }
}

function bfs({
  input,
  startx,
  starty,
  endx,
  endy,
  min,
  max,
}: {
  input: number[][];
  startx: number;
  starty: number;
  endx: number;
  endy: number;
  min: number;
  max: number;
}): number {
  const closed: Set<string> = new Set();
  const queue: GraphNode[] = [{ x: startx, y: starty, dx: 0, dy: 0, value: 0 }];
  const cameFrom: Map<string, GraphNode> = new Map();

  while (queue.length > 0) {
    const node = queue.reduce(
      (acc, node) => (node.value < acc.value ? node : acc),
      queue[0]
    );
    queue.splice(queue.indexOf(node), 1);

    if (node.x === endx && node.y === endy) {
      printGraph(input, cameFrom, node);
      return node.value;
    }

    const seenKey = [node.x, node.y, node.dx, node.dy].join(',');
    if (closed.has(seenKey)) continue;
    closed.add(seenKey);

    const neighbours =
      node.x === startx && node.y === starty
        ? [
            [0, 1],
            [1, 0],
            [-1, 0],
            [0, -1],
          ]
        : [
            [node.dy, node.dx],
            [-node.dy, -node.dx],
          ];

    for (const pos of neighbours) {
      let prev = node;
      let value = node.value;
      let x = node.x;
      let y = node.y;

      for (let i = 0; i < max; i++) {
        x += pos[0];
        y += pos[1];

        if (x >= 0 && y >= 0 && x < input[0].length && y < input.length) {
          value += input[y][x];
          const newNode = { x, y, dx: pos[0], dy: pos[1], value };
          cameFrom.set(JSON.stringify(newNode), prev);
          prev = newNode;

          if (i + 1 >= min) queue.push(newNode);
        }
      }
    }
  }

  return Infinity;
}

function part1(input: number[][]): void {
  console.log(
    bfs({
      input,
      startx: 0,
      starty: 0,
      endx: input[0].length - 1,
      endy: input.length - 1,
      min: 1,
      max: 3,
    })
  );
}

function part2(input: number[][]): void {
  console.log(
    bfs({
      input,
      startx: 0,
      starty: 0,
      endx: input[0].length - 1,
      endy: input.length - 1,
      min: 4,
      max: 10,
    })
  );
}
async function main(inputFileName: string): Promise<void> {
  const input = await fs.readFile(inputFileName, 'utf8');
  const lines = input.split('\n').map((line) => line.split('').map(Number));

  chrono<number[][]>(part1, lines, 'part1');
  chrono<number[][]>(part2, lines, 'part2');
}

main(process.argv[2]);
