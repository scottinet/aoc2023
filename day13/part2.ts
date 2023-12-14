type Border = { idx: number; str: string };

function strdiff(a: string, b: string): number {
  let count = 0;

  for (let i = 0; i < a.length && count < 2; i++) {
    if (a[i] !== b[i]) count++;
  }

  return count;
}

function repairAt(pattern: string[]): [number, number] {
  for (let max = pattern.length; max > 0; max--) {
    if (max % 2 === 0) continue;

    let toBeRepaired = null;

    for (let i = 0; i < max / 2; i++) {
      const left = i;
      const right = Math.ceil(max - i);

      if (!pattern[left] || !pattern[right]) break;
      const diff = strdiff(pattern[left], pattern[right]);

      if (diff === 1 && !toBeRepaired) {
        toBeRepaired = [left, right];
      } else if (diff) {
        toBeRepaired = null;
        break;
      }
    }

    if (toBeRepaired) return toBeRepaired;
  }

  return null;
}

function rotate90(pattern: string[]): string[] {
  const columns: string[] = [];

  for (let i = 0; i < pattern[0].length; i++) {
    columns.push(
      pattern
        .map((line) => line[i])
        .reverse()
        .join('')
    );
  }

  return columns;
}

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
  return findLinesBeforeHorizontalSeam(rotate90(pattern));
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

function repairAndMatch(pattern: string[], previousReport: number): number {
  let rotated = [...pattern];
  let toBeRepaired = null;
  let rotations = 0;

  while (rotations < 4 && !toBeRepaired) {
    if (rotations > 0) rotated = rotate90(rotated);
    toBeRepaired = repairAt(rotated);

    if (!toBeRepaired) rotations++;
  }

  const fromRight = [...rotated];
  const fromLeft = [...rotated];

  fromRight[toBeRepaired[1]] = rotated[toBeRepaired[0]];
  fromLeft[toBeRepaired[0]] = rotated[toBeRepaired[1]];

  for (let max = rotated.length; max > 0; max--) {
    for (const repaired of [fromLeft, fromRight]) {
      if (matchPattern(repaired, 0, max)) {
        let linesBefore = 0;
        linesBefore = Math.ceil(max / 2);

        if (rotations > 1) {
          linesBefore = repaired.length - linesBefore;
        }

        const result = rotations % 2 ? linesBefore : linesBefore * 100;

        if (result !== previousReport) {
          return result;
        }
      }
    }
  }

  throw new Error('OHNOES! (╯°□°）╯︵ ┻━┻');
}

export function part2(patterns: string[][]): void {
  let count = 0;
  for (const pattern of patterns) {
    const columnsBeforeVerticalSeam = findColumnsBeforeVerticalSeam(pattern);
    const linesBeforeHorizontalSeam = findLinesBeforeHorizontalSeam(pattern);
    const previousReport =
      columnsBeforeVerticalSeam + 100 * linesBeforeHorizontalSeam;

    count += repairAndMatch(pattern, previousReport);
  }
  console.log(`Total: ${count}`);
}
