import { DigInstruction } from './types/dig-instruction.type';

enum Direction {
  RIGHT,
  DOWN,
  LEFT,
  UP,
}
type Point = { x: number; y: number };
type Segment = { start: Point; end: Point; direction: Direction };

function shoelaceFormula(figure: Segment[]): number {
  let area = 0;

  for (let i = 0; i < figure.length; i++) {
    area +=
      figure[i].start.x * figure[i].end.y - figure[i].end.x * figure[i].start.y;
  }

  return Math.abs(area / 2);
}

export function part2(input: DigInstruction[]): void {
  const figure: Segment[] = [];
  let last: Point = { x: 0, y: 0 };
  const points: Point[] = [last];
  let dug = 0;

  for (let instruction of input) {
    const distance = parseInt(instruction.rgb.substring(0, 5), 16);
    let direction = parseInt(instruction.rgb.substring(5, 6), 16);
    const diff = [Direction.LEFT, Direction.DOWN].includes(direction) ? -1 : 1;
    let current: Point = { ...last };

    if ([Direction.UP, Direction.DOWN].includes(direction)) {
      current.y += diff * distance;
    } else {
      current.x += diff * distance;
    }
    points.push(current);
    figure.push({ start: last, end: current, direction });
    last = current;
    dug += distance;
  }

  console.log(dug / 2 + shoelaceFormula(figure) + 1);
}
