const CYCLE_COUNT = 1000000000;

type FoundCycleRepetition = {
  state: number[][];
  min: number;
  max: number;
};

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

function rotate90(platform: number[][]): number[][] {
  let rotated: number[][] = [];

  for (let i = 0; i < platform[0].length; i++) {
    rotated.push(platform.map((line) => line[i]).reverse());
  }

  return rotated;
}

function rotate270(platform: number[][]): number[][] {
  let rotated: number[][] = [];

  for (let i = platform[0].length - 1; i >= 0; i--) {
    rotated.push(platform.map((line) => line[i]));
  }

  return rotated;
}

function cyclePlatform(platform: number[][]): number[][] {
  let cycled = platform;

  for (let i = 0; i < 4; i++) {
    cycled = rotate90(tilt(cycled));
  }

  return cycled;
}

function searchRepetitons(platform: number[][]): FoundCycleRepetition {
  let count = 0;
  let cycle = platform;
  const seen: string[] = [JSON.stringify(cycle)];

  while (count < 1000000) {
    count++;
    cycle = cyclePlatform(cycle);
    const s = JSON.stringify(cycle);

    let seenAt = seen.findIndex((v) => v === s);
    if (seenAt !== -1) {
      console.log(`Found between ${seenAt} and ${count}!`);
      return {
        state: cycle,
        min: seenAt,
        max: count,
      };
    }

    seen.push(s);
  }

  throw new Error('OHNOES! (╯°□°）╯︵ ┻━┻');
}

export function part2(platform: number[][]): void {
  let cycled = rotate270(platform);
  const repetition = searchRepetitons(cycled);
  const remainingCycles =
    (CYCLE_COUNT - repetition.max) % (repetition.max - repetition.min);

  cycled = repetition.state;
  for (let i = 0; i < remainingCycles; i++) {
    cycled = cyclePlatform(cycled);
  }

  let count = 0;
  for (const row of cycled) {
    for (let i = 0; i < row.length; i++) {
      if (row[i] === 1) count += cycled[0].length - i;
    }
  }

  console.log(count);
}
