import { Connection, Node, Edge } from "@xyflow/react";
import { AppNode } from "@/store/workflowStore";

// Type definitions for handle data types
export type DataType = "text" | "image" | "video" | "any";

// Helper to determine the data type of a source handle
export function getSourceHandleType(nodeType: string, handleId: string | null): DataType {
  switch (nodeType) {
    case "text":
    case "llm":
      return "text";
    case "uploadImage":
    case "cropImage":
    case "extractFrame":
      return "image";
    case "uploadVideo":
      return "video";
    default:
      return "any";
  }
}

// Helper to determine the expected data type of a target handle
export function getTargetHandleType(nodeType: string, handleId: string | null): DataType {
  if (nodeType === "llm") {
    if (handleId === "system_prompt" || handleId === "user_message") return "text";
    if (handleId === "images") return "image";
  }
  
  if (nodeType === "cropImage") {
    if (handleId === "image_url") return "image";
    // other params like x_percent can be text/number
    return "text"; 
  }

  if (nodeType === "extractFrame") {
    if (handleId === "video_url") return "video";
    return "text"; // timestamp is text/number
  }

  return "any";
}

// The validation function for React Flow
export function isValidConnection(connection: Connection | Edge, nodes: AppNode[]): boolean {
  if (!connection.source || !connection.target) return false;

  const sourceNode = nodes.find((n) => n.id === connection.source);
  const targetNode = nodes.find((n) => n.id === connection.target);

  if (!sourceNode || !targetNode) return false;

  const sourceType = getSourceHandleType(sourceNode.type || "default", connection.sourceHandle || null);
  const targetType = getTargetHandleType(targetNode.type || "default", connection.targetHandle || null);

  if (sourceType === "any" || targetType === "any") return true;

  return sourceType === targetType;
}
