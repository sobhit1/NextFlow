import { Connection, Edge, getOutgoers, Node } from "@xyflow/react";

/**
 * Checks if adding the new connection would create a cycle in the graph.
 * We do this by checking if the target node can already reach the source node.
 * If Target -> ... -> Source exists, then Source -> Target creates a cycle.
 */
export function hasCycle(
  connection: Connection | Edge,
  nodes: Node[],
  edges: Edge[]
): boolean {
  if (!connection.source || !connection.target) return false;

  const targetNode = nodes.find((n) => n.id === connection.target);
  if (!targetNode) return false;

  // DFS to check if we can reach the source node from the target node
  const visited = new Set<string>();
  const stack = [targetNode];

  while (stack.length > 0) {
    const current = stack.pop()!;
    if (current.id === connection.source) {
      // We reached the source node from the target node! Cycle detected.
      return true;
    }

    if (!visited.has(current.id)) {
      visited.add(current.id);
      const outgoers = getOutgoers(current, nodes, edges);
      stack.push(...outgoers);
    }
  }

  return false;
}
