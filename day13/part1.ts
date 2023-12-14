type Border = { idx: number; str: string };

function matchPattern(pattern: string[], min: number, max: number): boolean {
  if ((max - min) % 2 === 0) return false;

  for (let i = 0; i < (max - min) / 2; i++) {
    const left = pattern[Math.floor(min + i)];
    const right = pattern[Math.ceil(max - i)];

    if (left !== right) return false;
  }

  return true;
}

function findColumnsBeforeVerticalSeam(pattern: string[]): number {
  const columns: string[] = [];

  for (let i = 0; i < pattern[0].length; i++) {
    columns.push(
      pattern
        .map((line) => line[i])
        .reverse()
        .join('')
    );
  }

  return findLinesBeforeHorizontalSeam(columns);
}

function findLinesBeforeHorizontalSeam(pattern: string[]): number {
  const borders: Border[] = [
    { idx: 0, str: pattern[0] },
    { idx: pattern.length - 1, str: pattern[pattern.length - 1] },
  ];

  let matchedLines = 0;

  for (const border of borders) {
    const matches = pattern
      .map((line, i) => (line === border.str && i !== border.idx ? i : 0))
      .filter(Boolean);

    for (const match of matches) {
      const min = Math.min(border.idx, match);
      const max = Math.max(border.idx, match);

      if (matchPattern(pattern, min, max)) {
        matchedLines += Math.ceil(min + (max - min) / 2);
      }
    }
  }

  return matchedLines;
}

export function part1(patterns: string[][]): void {
  let count = 0;

  for (const pattern of patterns) {
    const columnsBeforeVerticalSeam = findColumnsBeforeVerticalSeam(pattern);
    const linesBeforeHorizontalSeam = findLinesBeforeHorizontalSeam(pattern);
    const total = columnsBeforeVerticalSeam + 100 * linesBeforeHorizontalSeam;
    console.log(
      `=== ${columnsBeforeVerticalSeam + 100 * linesBeforeHorizontalSeam} ===`
    );
    pattern.forEach((line) => console.log(line));
    count += total;
  }

  console.log(`Total: ${count}`);
}
