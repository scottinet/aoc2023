import { Almanac } from './models/almanac.type';
import { MapRange } from './models/map-range.type';
import { parse } from './utils/parse';

function getDestination(ranges: MapRange[], source: number): number {
  for (const range of ranges) {
    if (range.source <= source && range.source + range.rangeLength >= source) {
      return range.destination + (source - range.source);
    }
  }

  return source;
}

function getLocation(almanac: Almanac, seed: number): number {
  let nextStep = seed;

  for (const mapCategory of almanac.maps) {
    nextStep = getDestination(mapCategory.ranges, nextStep);
  }

  return nextStep;
}

async function part1(almanac: Almanac): Promise<void> {
  let lowestLocation = Infinity;

  for (const seed of almanac.seeds) {
    const location = getLocation(almanac, seed);
    lowestLocation = Math.min(lowestLocation, location);
  }

  console.log(`(PART1) Lowest location is ${lowestLocation}`);
}

async function part2(almanac: Almanac): Promise<void> {
  let lowestLocation = Infinity;

  for (let i = 0; i < almanac.seeds.length; i += 2) {
    for (let j = 0; j < almanac.seeds[i + 1]; j++) {
      const location = getLocation(almanac, almanac.seeds[i] + j);
      lowestLocation = Math.min(lowestLocation, location);
    }
  }

  console.log(`(PART2) Lowest location is ${lowestLocation}`);
}

async function main(inputFileName: string): Promise<void> {
  const almanac = await parse(inputFileName);

  await part1(almanac);
  await part2(almanac);
}

main(process.argv[2]);
