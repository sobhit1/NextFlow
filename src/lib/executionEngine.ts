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

import { executeLlmAction } from "@/app/actions/runLlm";

export async function executeWorkflowLocally(
  nodes: AppNode[], 
  edges: Edge[],
  updateNodeData: (id: string, data: any) => void
) {
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
      updateNodeData(node.id, { isExecuting: true, error: null });

      try {
        if (node.type === "llm") {
          // Extract inputs from incoming edges
          let systemPrompt = "";
          let userMessage = "";
          const images: { mimeType: string; data: string }[] = [];

          for (const depId of deps) {
            const edge = edges.find(e => e.source === depId && e.target === node.id);
            const depNode = nodes.find(n => n.id === depId);
            if (!edge || !depNode) continue;

            if (edge.targetHandle === "system_prompt") systemPrompt = depNode.data.text as string;
            if (edge.targetHandle === "user_message") userMessage = depNode.data.text as string;
            if (edge.targetHandle === "images" && depNode.data.imageUrl) {
              // We'll pass the URL directly if we support it, or fetch and convert.
              // For now we'll assume the URL works if using base64 or transloadit URL
              // We'd need to fetch and convert to base64 if Gemini requires it, 
              // but Gemini also accepts File API. For the scope of this step, we'll map URL.
            }
          }

          const res = await executeLlmAction({
            systemPrompt: systemPrompt || undefined,
            userMessage: userMessage || "Hello", // fallback
            model: (node.data.model as string) || "gemini-2.5-flash",
          });

          if (res.success) {
            updateNodeData(node.id, { text: res.text, isExecuting: false });
          } else {
            updateNodeData(node.id, { error: res.error, isExecuting: false });
          }
        } else {
          // Mock execution delay for other nodes
          await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 500));
          updateNodeData(node.id, { isExecuting: false });
        }
      } catch (err: any) {
        updateNodeData(node.id, { error: err.message, isExecuting: false });
      }
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
