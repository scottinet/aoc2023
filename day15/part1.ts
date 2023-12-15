export function part1(input: string): void {
  const parts = input.split(',');
  let sum = 0;

  for (const part of parts) {
    let value = 0;
    for (let i = 0; i < part.length; i++) {
      value = ((value + part.charCodeAt(i)) * 17) % 256;
    }
    sum += value;
  }

  console.log(sum);
}
