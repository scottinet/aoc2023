import { Almanac } from './models/almanac.type';
import { MapRange } from './models/map-range.type';
import { parse } from './utils/parse';

export type NumberRange = { start: number; count: number };

function isIntersecting(a: NumberRange, b: NumberRange): boolean {
  return (
    (a.start >= b.start && a.start < b.start + b.count) ||
    (b.start >= a.start && b.start < a.start + a.count)
  );
}

function isIncluded(a: NumberRange, b: NumberRange): boolean {
  return a.start >= b.start && a.start + a.count <= b.start + b.count;
}

function getDestinations(
  ranges: MapRange[],
  source: NumberRange
): NumberRange[] {
  let currentSource: NumberRange = { ...source };
  const destinations: NumberRange[] = [];

  for (let i = 0; i < ranges.length && currentSource !== null; i++) {
    const range: NumberRange = {
      start: ranges[i].source,
      count: ranges[i].count,
    };
    const destination = ranges[i].destination;

    if (isIntersecting(currentSource, range)) {
      const start =
        destination + Math.max(currentSource.start - range.start, 0);

      // current source range completely included in range
      if (isIncluded(currentSource, range)) {
        destinations.push({ start, count: currentSource.count });
        currentSource = null;
      } else if (isIncluded(range, currentSource)) {
        destinations.push({
          start: currentSource.start,
          count: range.start - currentSource.start + 1,
        });
        destinations.push({ start: destination, count: range.count });
        currentSource = {
          start: range.start + range.count,
          count:
            currentSource.count -
            range.count -
            (range.start - currentSource.start),
        };
      } else if (range.start <= currentSource.start) {
        const count = range.start + range.count - currentSource.start;
        destinations.push({ start, count });
        currentSource = {
          start: start + count,
          count: currentSource.count - count,
        };
      } else {
        const count =
          currentSource.start + currentSource.count - range.start + 1;
        destinations.push({ start, count });
        currentSource = {
          start: currentSource.start,
          count: currentSource.count - count,
        };
      }
    }
  }

  if (currentSource !== null) destinations.push(currentSource);

  return destinations;
}

function getLocations(almanac: Almanac, range: NumberRange): number[] {
  let nextSteps: NumberRange[] = [range];

  for (const mapCategory of almanac.maps) {
    const destinations: NumberRange[] = [];
    for (const nextStep of nextSteps) {
      destinations.push(...getDestinations(mapCategory.ranges, nextStep));
    }

    nextSteps = destinations;
  }

  return nextSteps.map((step) => step.start);
}

function part2(almanac: Almanac): void {
  let lowestLocation = Infinity;

  for (let i = 0; i < almanac.seeds.length; i += 2) {
    const locations = getLocations(almanac, {
      start: almanac.seeds[i],
      count: almanac.seeds[i + 1],
    });

    lowestLocation = locations.reduce(
      (acc, curr) => Math.min(acc, curr),
      lowestLocation
    );
  }

  console.log(`(PART2) Lowest location is ${lowestLocation}`);
}

async function main(inputFileName: string): Promise<void> {
  const almanac = await parse(inputFileName);
  part2(almanac);
}

main(process.argv[2]);
