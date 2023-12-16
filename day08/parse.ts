import { promises as fs } from 'fs';
import { DesertMap } from './models/desert-map.type';

export async function parse(inputFileName: string): Promise<DesertMap> {
  const data = (await fs.readFile(inputFileName, 'utf-8')).split('\n');
  const desertMap: DesertMap = {
    instructions: data[0],
    nodes: new Map<string, string[]>(),
  };

  for (let i = 2; i < data.length; i++) {
    const nodeData = data[i].split(' = ');
    const nodeSibblings = nodeData[1].replace(/[()]/g, '').split(', ');
    desertMap.nodes.set(nodeData[0], nodeSibblings);
  }

  return desertMap;
}
