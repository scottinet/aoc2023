import { SpringRow } from './types/spring-record.type';

type Range = { min: number; max: number };

function unfold(springRows: SpringRow[]): SpringRow[] {
  const unfolded: SpringRow[] = [];

  for (const row of springRows) {
    let record = row.record.slice();
    let damaged = row.damaged.slice();

    for (let i = 0; i < 4; i++) {
      record.push(NaN, ...row.record);
      damaged.push(...row.damaged);
    }

    unfolded.push({ record, damaged });
  }

  return unfolded;
}

function remaining(availableRanges: Range[], start: number): number {
  const available = availableRanges.filter(
    (range) => range.min <= start && start < range.max
  );

  if (available.length > 1) throw new Error('Too many available ranges');

  return available.length === 1 ? available[0].max - start : 0;
}

function countAllowedRanges({
  springRow,
  availableRanges,
  damagedRanges,
  damagedIdx,
  minStart,
}: {
  springRow: SpringRow;
  availableRanges: Range[];
  damagedRanges: Range[];
  damagedIdx: number;
  minStart: number;
}): number {
  if (damagedIdx === springRow.damaged.length) {
    for (let i = minStart; i < springRow.record.length; i++) {
      if (springRow.record[i] === 1) return 0;
    }
    return 1;
  }

  let count = 0;

  for (
    let i = Math.max(minStart, damagedRanges[damagedIdx].min);
    i < damagedRanges[damagedIdx].max;
    i++
  ) {
    const r = remaining(availableRanges, i);
    if (springRow.record[i - 1] === 1) return count;
    if (r < springRow.damaged[damagedIdx]) continue;
    if (springRow.record[i + springRow.damaged[damagedIdx]] === 1) continue;

    count += countAllowedRanges({
      springRow,
      availableRanges,
      damagedRanges,
      damagedIdx: damagedIdx + 1,
      minStart: i + springRow.damaged[damagedIdx] + 1,
    });
  }

  return count;
}

function findRangeCombinations(springRow: SpringRow): number {
  const reduced = { ...springRow, record: reduce(springRow.record) };

  return countAllowedRanges({
    springRow: reduced,
    availableRanges: getAvailableRanges(reduced.record),
    damagedRanges: computeDamagedRanges(reduced),
    damagedIdx: 0,
    minStart: 0,
  });
}

function reduce(record: number[]): number[] {
  const start = record.findIndex((n) => n !== 0);
  const end = record.findLastIndex((n) => n !== 0);
  const reduced: number[] = [];
  let last0 = -1;

  for (let i = start; i <= end; i++) {
    if (record[i] === 0) {
      if (last0 !== i - 1) reduced.push(0);
      last0 = i;
    } else {
      reduced.push(record[i]);
    }
  }

  return reduced;
}

function getAvailableRanges(record: number[]): Range[] {
  const ranges: Range[] = [];

  for (let i = 0; i < record.length; i++) {
    if (record[i] !== 0) {
      const start = i;
      while (record[i] !== 0 && i < record.length) i++;
      ranges.push({ min: start, max: i });
    }
  }

  return ranges;
}

function computeDamagedRanges(springRow: SpringRow): Range[] {
  const ranges: Range[] = [];
  const minTakenSpaces = springRow.damaged.reduce(
    (acc, cur) => acc + cur + 1,
    -1
  );
  const availableSpaces = springRow.record.length - minTakenSpaces;

  for (let i = 0; i < springRow.damaged.length; i++) {
    const start =
      springRow.damaged.slice(0, i).reduce((acc, cur) => acc + cur + 1, 1) - 1;
    const end = start + availableSpaces + 1;
    ranges.push({ min: start, max: end });
  }
  return ranges;
}

export function part2(springRows: SpringRow[]): void {
  const unfoldedRows = unfold(springRows);
  let count = 0;

  for (let i = 0; i < unfoldedRows.length; i++) {
    const comb = findRangeCombinations(unfoldedRows[i]);
    console.log(`Row ${i + 1}: ${comb}`);
    count += comb;
  }

  console.log(`There are ${count} combinations`);
}
