import { GraphNode } from './models/graph-node';

interface ContractedGraphNode extends GraphNode {
  contractions: number;
}

function duplicateGraph(
  graph: Map<string, GraphNode>
): Map<string, ContractedGraphNode> {
  const newGraph: Map<string, ContractedGraphNode> = new Map();

  for (const [name, node] of graph) {
    newGraph.set(name, {
      name,
      contractions: 0,
      neighbours: Array.from(node.neighbours),
    });
  }

  return newGraph;
}

// Karger's probabilistic algorithm
function mincut(
  graph: Map<string, GraphNode>
): Map<string, ContractedGraphNode> {
  const cgraph = duplicateGraph(graph);

  while (cgraph.size > 2) {
    let node1Name = Array.from(cgraph.keys())[
      Math.floor(Math.random() * cgraph.size)
    ];
    let node1 = cgraph.get(node1Name);
    let node2Name =
      node1.neighbours[Math.floor(Math.random() * node1.neighbours.length)];
    let node2 = cgraph.get(node2Name);

    node1.contractions += node2.contractions + 1;

    for (const neighbour of node2.neighbours) {
      const neighbourNode = cgraph.get(neighbour);

      if (neighbour !== node1Name) {
        node1.neighbours.push(neighbour);
        neighbourNode.neighbours.push(node1Name);
      }

      neighbourNode.neighbours = neighbourNode.neighbours.filter(
        (n) => n !== node2Name
      );
    }

    cgraph.delete(node2Name);
  }

  for (const node of cgraph.values()) {
    node.contractions++;
  }

  return cgraph;
}

export function part1(input: Map<string, GraphNode>): void {
  const cardinality = 3;
  let cuts = 0;

  while (cuts !== cardinality) {
    const result = mincut(input);
    const [node1, node2] = Array.from(result.values());

    cuts = node1.neighbours.filter((n) => n === node2.name).length;

    if (cuts === cardinality) {
      console.log(
        `${node1.contractions} * ${node2.contractions} = ${
          node1.contractions * node2.contractions
        }`
      );
    }
  }
}
