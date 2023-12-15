function getNextValue(value: number, char: string): number {
  value += char.charCodeAt(0);
  return (value * 17) % 256;
}

export function part1(input: string): void {
  const parts = input.split(',');
  let sum = 0;

  for (const part of parts) {
    let value = 0;
    for (const char of part) {
      value = getNextValue(value, char);
    }
    sum += value;
  }

  console.log(sum);
}
