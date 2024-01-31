export function numberToName(num: number): string {
  let name = '';
  let remaining = num;

  if (remaining === 0) return 'A';

  for (let power = 0; remaining > 0; power++) {
    const digit = remaining % 26;
    const letter = String.fromCharCode(65 + digit);
    name = letter + name;
    remaining = Math.floor(remaining / 26);
  }

  return name;
}
