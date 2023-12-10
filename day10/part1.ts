import { Grid } from './types/grid.type';
import { Point } from './types/point.type';

function isEqual(a: Point, b: Point): boolean {
  return a.x === b.x && a.y === b.y;
}

export function part1(grid: Grid): void {
  let previous = grid.start;
  let current = grid.start.links[0];
  let moves = 1;

  while (!isEqual(current, grid.start.coords)) {
    const currentNode = grid.getNode(current);
    const next = currentNode.links.find(
      (link) => !isEqual(link, previous.coords)
    );
    previous = currentNode;
    current = next;
    moves++;
  }

  console.log(`Moves: ${moves / 2}`);
}
