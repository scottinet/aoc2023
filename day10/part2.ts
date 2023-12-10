import pointInPolygon from 'point-in-polygon';
import { GridNode } from './types/grid-node.type';
import { Grid } from './types/grid.type';
import { Point } from './types/point.type';

function isEqual(a: Point, b: Point): boolean {
  return a.x === b.x && a.y === b.y;
}

function getLoopNodes(grid: Grid): GridNode[] {
  const loopNodes: GridNode[] = [grid.start];

  let previous = grid.start;
  let current = grid.start.links[0];

  while (!isEqual(current, grid.start.coords)) {
    const currentNode = grid.getNode(current);
    loopNodes.push(currentNode);

    const next = currentNode.links.find(
      (link) => !isEqual(link, previous.coords)
    );
    previous = currentNode;
    current = next;
  }

  return loopNodes;
}

export function part2(grid: Grid): void {
  const loopNodes = getLoopNodes(grid);
  const polygon = loopNodes.map((node) => [node.coords.x, node.coords.y]);
  let enclosed = 0;

  for (let y = 0; y < grid.maxY; y++) {
    for (let x = 0; x < grid.maxX; x++) {
      if (!loopNodes.some((node) => isEqual(node.coords, { x, y }))) {
        if (pointInPolygon([x, y], polygon)) enclosed++;
      }
    }
  }

  console.log(`Enclosed: ${enclosed}`);
}
