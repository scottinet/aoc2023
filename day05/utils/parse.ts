import { promises as fs } from 'fs';
import { Almanac } from '../models/almanac.type';
import { MapCategory } from '../models/map-category.type';

export async function parse(inputFileName: string): Promise<Almanac> {
  const almanac: Almanac = { seeds: [], maps: [] };
  const data = await fs.readFile(inputFileName, 'utf-8');
  const lines = data.split('\n');

  almanac.seeds = lines
    .shift()
    .replace(/seeds: /, '')
    .split(' ')
    .map((seed) => parseInt(seed, 10));

  let mapCategory: MapCategory = null;
  for (const line of lines
    .map((line) => line.trim())
    .filter((line) => line.length > 0)) {
    if (line.match('map:')) {
      const mapName = line.replace(/map:/, '').trim();
      mapCategory = { name: mapName, ranges: [] };
      almanac.maps.push(mapCategory);
    } else {
      const [destination, source, rangeLength] = line
        .split(' ')
        .map((value) => parseInt(value, 10));
      mapCategory.ranges.push({ source, destination, count: rangeLength });
    }
  }

  return almanac;
}
