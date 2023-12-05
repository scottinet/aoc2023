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

async function part1(inputFileName: string): Promise<void> {
  const almanac = await parse(inputFileName);
  let lowestLocation = Infinity;

  for (const seed of almanac.seeds) {
    const location = getLocation(almanac, seed);
    console.log(`Seed ${seed} ends at ${location}`);

    lowestLocation = Math.min(lowestLocation, location);
  }

  console.log(`Lowest location is ${lowestLocation}`);
}

part1(process.argv[2]);
