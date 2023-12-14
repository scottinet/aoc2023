function splitRow(row: number[]): number[][] {
  const sections: number[][] = [];
  row = [...row];
  let nextIndex = row.findIndex((v) => isNaN(v));

  while (nextIndex !== -1) {
    if (nextIndex === 0) {
      sections.push([row.shift()]);
    } else {
      sections.push(row.splice(0, nextIndex));
    }
    nextIndex = row.findIndex((v) => isNaN(v));
  }

  if (row.length) sections.push(row);

  return sections;
}

function tiltOne(row: number[]): number[] {
  const sections = splitRow(row);

  for (let i = 0; i < sections.length; i++) {
    if (isNaN(sections[i][0])) continue;
    const countO = sections[i].filter((v) => v === 1).length;
    sections[i] = Array(countO)
      .fill(1)
      .concat(Array(sections[i].length - countO).fill(0));
  }

  return sections.flat();
}

function tilt(platform: number[][]): number[][] {
  return platform.map(tiltOne);
}

function rotate270(platform: number[][]): number[][] {
  const rotated: number[][] = [];

  for (let i = 0; i < platform[0].length; i++) {
    rotated.push([]);
  }

  for (let i = 0; i < platform.length; i++) {
    for (let j = 0; j < platform[i].length; j++) {
      rotated[j][i] = platform[i][j];
    }
  }

  return rotated;
}

export function part1(platform: number[][]): void {
  const rotated = rotate270(platform);
  const tilted = tilt(rotated);
  let count = 0;

  for (const row of tilted) {
    for (let i = 0; i < row.length; i++) {
      if (row[i] === 1) count += tilted[0].length - i;
    }
  }

  console.log(count);
}
