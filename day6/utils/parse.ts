import { promises as fs } from 'fs';
import { RaceRecord } from '../models/race-record.type';

export async function parse(inputFileName: string): Promise<RaceRecord[]> {
  const races: RaceRecord[] = [];
  const data = await fs.readFile(inputFileName, 'utf-8');
  const [times, distances] = data.split('\n').map((line) =>
    line
      .replace(/.*:\s+/, '')
      .split(/\s+/)
      .map((value) => parseInt(value, 10))
      .filter((value) => !isNaN(value))
  );

  if (times.length !== distances.length) throw new Error('Parsing error');

  for (let i = 0; i < times.length; i++) {
    races.push({ time: times[i], distance: distances[i] });
  }

  return races;
}
