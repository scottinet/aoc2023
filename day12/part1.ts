import { SpringRecord } from './types/spring-record.type';

function getGroups(record: number[]): number[] {
  let inGroup = false;
  const groups = [];
  let groupIndex = -1;

  for (let i = 0; i < record.length; i++) {
    if (record[i] === 1) {
      if (!inGroup) {
        inGroup = true;
        groupIndex++;
        groups[groupIndex] = 1;
      } else {
        groups[groupIndex]++;
      }
    } else {
      inGroup = false;
    }
  }

  return groups;
}

function testCombination(
  springs: SpringRecord,
  combination: number[]
): boolean {
  const newRecord = springs.record.slice();
  let index = 0;

  for (let i = 0; i < newRecord.length; i++) {
    if (isNaN(newRecord[i])) {
      newRecord[i] = combination[index];
      index++;
    }
  }

  const groups = getGroups(newRecord);

  if (groups.length !== springs.damaged.length) return false;

  for (let i = 0; i < groups.length; i++) {
    if (groups[i] !== springs.damaged[i]) return false;
  }

  return true;
}

function combinations(springRecord: SpringRecord): number[][] {
  const combinations: number[][] = [];
  const nanCount = springRecord.record.filter((n) => isNaN(n)).length;

  for (let i = 0; i < 2 ** nanCount; i++) {
    let binary = i.toString(2).padStart(nanCount, '0');
    const combination: number[] = binary.split('').map(Number);

    if (testCombination(springRecord, combination)) {
      combinations.push(combination);
    }
  }

  return combinations;
}

export function part1(records: SpringRecord[]): void {
  let count = 0;
  for (const record of records) {
    const comb = combinations(record);
    count += comb.length;
  }

  console.log(`There are ${count} combinations`);
}
