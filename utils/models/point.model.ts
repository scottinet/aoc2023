export class Point {
  constructor(
    public readonly x: number,
    public readonly y: number
  ) {}

  clone(): Point {
    return new Point(this.x, this.y);
  }

  equals(other: Point): boolean {
    return this.x === other.x && this.y === other.y;
  }

  toString() {
    return `${this.x},${this.y}`;
  }

  getNeighbours(
    {
      minX,
      maxX,
      minY,
      maxY,
    }: { minX: number; maxX: number; minY: number; maxY: number } = {
      minX: -Infinity,
      minY: -Infinity,
      maxX: Infinity,
      maxY: Infinity,
    }
  ): Point[] {
    const neighbours = [
      new Point(this.x - 1, this.y),
      new Point(this.x + 1, this.y),
      new Point(this.x, this.y - 1),
      new Point(this.x, this.y + 1),
    ];

    return neighbours.filter(
      ({ x, y }) => x >= minX && x < maxX && y >= minY && y < maxY
    );
  }
}
