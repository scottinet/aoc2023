import { GridNode } from './grid-node.type';
import { Point } from './point.type';

export class Grid {
  public start: GridNode;
  private readonly content: GridNode[][];
  private readonly niceGrid: string[];

  constructor(input: string[]) {
    this.niceGrid = this.convertToNiceGrid(input);
    this.content = this.convertToNodes(this.niceGrid);
    this.replaceStartNode();
    this.linkNode(this.start);
  }

  private convertToNiceGrid(input: string[]): string[] {
    return input.map((row) =>
      row
        .replace(/\|/g, '║')
        .replace(/-/g, '═')
        .replace(/F/g, '╔')
        .replace(/L/g, '╚')
        .replace(/7/g, '╗')
        .replace(/J/g, '╝')
    );
  }

  public getNode(coords: Point): GridNode {
    const gridNode = this.content[coords.y][coords.x];

    if (gridNode.links.length === 0) {
      this.linkNode(gridNode);
    }

    return gridNode;
  }

  private convertToNodes(grid: string[]): GridNode[][] {
    const nodes: GridNode[][] = [];

    grid.forEach((row, y) => {
      nodes[y] = [];

      row.split('').forEach((str, x) => {
        nodes[y][x] = {
          str,
          coords: { x, y },
          links: [],
        };

        if (str === 'S') {
          this.start = nodes[y][x];
        }
      });
    });

    return nodes;
  }

  private replaceStartNode(): void {
    // north, east, south, west
    const connectsTo = [0, 0, 0, 0];

    if (this.start.coords.y > 0) {
      const north = this.content[this.start.coords.y - 1][this.start.coords.x];
      if (['║', '╔', '╗'].includes(north.str)) connectsTo[0] = 1;
    }

    if (this.start.coords.x < this.content[this.start.coords.y].length - 1) {
      const east = this.content[this.start.coords.y][this.start.coords.x + 1];
      if (['═', '╗', '╝'].includes(east.str)) connectsTo[1] = 1;
    }

    if (this.start.coords.y < this.content.length - 1) {
      const south = this.content[this.start.coords.y + 1][this.start.coords.x];
      if (['║', '╚', '╝'].includes(south.str)) connectsTo[2] = 1;
    }

    if (this.start.coords.x > 0) {
      const west = this.content[this.start.coords.y][this.start.coords.x - 1];
      if (['═', '╔', '╚'].includes(west.str)) connectsTo[3] = 1;
    }

    if (connectsTo.reduce((acc, curr) => acc + curr, 0) !== 2) {
      throw new Error('Start node has invalid connections');
    }

    if (connectsTo[0] === 1 && connectsTo[1] === 1) {
      this.start.str = '╚';
    } else if (connectsTo[1] === 1 && connectsTo[2] === 1) {
      this.start.str = '╔';
    } else if (connectsTo[2] === 1 && connectsTo[3] === 1) {
      this.start.str = '╗';
    } else if (connectsTo[3] === 1 && connectsTo[0] === 1) {
      this.start.str = '╝';
    } else if (connectsTo[0] === 1 && connectsTo[2] === 1) {
      this.start.str = '║';
    } else if (connectsTo[1] === 1 && connectsTo[3] === 1) {
      this.start.str = '═';
    }
  }

  private linkNode(node: GridNode): void {
    if (node.links.length > 0) return;

    const { x, y } = node.coords;

    if (x > 0 && ['═', '╝', '╗'].includes(node.str)) {
      node.links.push(this.content[y][x - 1].coords);
    }

    if (x < this.content[y].length - 1 && ['═', '╚', '╔'].includes(node.str)) {
      node.links.push(this.content[y][x + 1].coords);
    }

    if (y > 0 && ['║', '╚', '╝'].includes(node.str)) {
      node.links.push(this.content[y - 1][x].coords);
    }

    if (y < this.content.length - 1 && ['║', '╗', '╔'].includes(node.str)) {
      node.links.push(this.content[y + 1][x].coords);
    }
  }
}
