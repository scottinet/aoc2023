type Lens = { label: string; focusingPower: number };

function HASH(str: string): number {
  let value = 0;
  for (let i = 0; i < str.length; i++) {
    value = ((value + str.charCodeAt(i)) * 17) % 256;
  }
  return value;
}

function removeLens(box: Lens[], label: string): void {
  const index = box.findIndex((lens) => lens.label === label);
  if (index !== -1) {
    box.splice(index, 1);
  }
}

function addLens(box: Lens[], lens: Lens): void {
  const index = box.findIndex((l) => l.label === lens.label);
  if (index === -1) {
    box.push(lens);
  } else {
    box[index].focusingPower = lens.focusingPower;
  }
}

function getTotalFocusingPower(boxes: Lens[][]): number {
  let total = 0;

  for (let i = 0; i < boxes.length; i++) {
    for (let j = 0; j < boxes[i].length; j++) {
      total += (i + 1) * (j + 1) * boxes[i][j].focusingPower;
    }
  }

  return total;
}

export function part2(input: string): void {
  const boxes: Lens[][] = Array.from({ length: 256 }, () => []);
  const instructions = input.split(',');

  for (const instruction of instructions) {
    const [label, num] = instruction.split(/[-=]/);
    const box = HASH(label);
    const focusingPower = parseInt(num, 10);

    if (isNaN(focusingPower)) {
      removeLens(boxes[box], label);
    } else {
      addLens(boxes[box], { label, focusingPower });
    }
  }

  console.log(getTotalFocusingPower(boxes));
}
