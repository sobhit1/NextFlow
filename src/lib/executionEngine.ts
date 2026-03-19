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
    
    // Map to store the execution Promise for each node
    const executionPromises = new Map<string, Promise<void>>();
    
    // Build an adjacency list for incoming edges (dependencies)
    const incomingEdges: Record<string, string[]> = {};
    for (const node of nodes) {
      incomingEdges[node.id] = [];
    }
    for (const edge of edges) {
      if (edge.source && edge.target) {
        incomingEdges[edge.target].push(edge.source);
      }
    }

    // Function to execute a single node
    const executeNode = async (nodeId: string) => {
      const node = nodes.find(n => n.id === nodeId);
      if (!node) return;

      // 1. Await all Dependencies
      const deps = incomingEdges[nodeId];
      if (deps.length > 0) {
        const depPromises = deps
          .map(depId => executionPromises.get(depId))
          .filter(Boolean) as Promise<void>[];
        await Promise.all(depPromises);
      }

      // 2. Execute this node
      console.log(`[START] Executing node: ${node.id} (${node.type})`);
      // Mock execution delay
      await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 500));
      console.log(`[DONE] Finished node: ${node.id}`);
    };

    // Start execution for all nodes
    for (const nodeId of sortedNodeIds) {
      const promise = executeNode(nodeId);
      executionPromises.set(nodeId, promise);
    }

    // Await all nodes to finish
    await Promise.all(executionPromises.values());
    
    console.log("Workflow execution complete");
  } catch (error) {
    console.error("Workflow execution failed:", error);
  }
}
