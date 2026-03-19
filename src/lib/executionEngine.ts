import { Edge } from "@xyflow/react";
import { AppNode } from "@/store/workflowStore";

/**
 * Returns a topologically sorted array of node IDs.
 * Uses Kahn's algorithm.
 */
export function topologicalSort(nodes: AppNode[], edges: Edge[]): string[] {
  const inDegree: Record<string, number> = {};
  const adjList: Record<string, string[]> = {};

  // Initialize data structures
  for (const node of nodes) {
    inDegree[node.id] = 0;
    adjList[node.id] = [];
  }

  // Build adjacency list and compute in-degrees
  for (const edge of edges) {
    if (!edge.source || !edge.target) continue;
    adjList[edge.source].push(edge.target);
    inDegree[edge.target] = (inDegree[edge.target] || 0) + 1;
  }

  // Find all nodes with 0 in-degree
  const queue: string[] = [];
  for (const node of nodes) {
    if (inDegree[node.id] === 0) {
      queue.push(node.id);
    }
  }

  const sorted: string[] = [];

  while (queue.length > 0) {
    const current = queue.shift()!;
    sorted.push(current);

    for (const neighbor of adjList[current]) {
      inDegree[neighbor] -= 1;
      if (inDegree[neighbor] === 0) {
        queue.push(neighbor);
      }
    }
  }

  // If sorted doesn't contain all nodes, there's a cycle (which shouldn't happen due to our DAG validation)
  if (sorted.length !== nodes.length) {
    throw new Error("Cycle detected during topological sort");
  }

  return sorted;
}

export async function executeWorkflowLocally(nodes: AppNode[], edges: Edge[]) {
  try {
    const sortedNodeIds = topologicalSort(nodes, edges);
    console.log("Execution order:", sortedNodeIds);
    
    // Simulate sequential execution
    for (const nodeId of sortedNodeIds) {
      const node = nodes.find(n => n.id === nodeId);
      console.log(`Executing node: ${node?.id} (${node?.type})`);
      // Mock execution delay
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    console.log("Workflow execution complete");
  } catch (error) {
    console.error("Workflow execution failed:", error);
  }
}
