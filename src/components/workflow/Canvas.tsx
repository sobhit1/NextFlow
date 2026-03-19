"use client";

import { useMemo } from "react";

import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { DefaultNode } from "./nodes/DefaultNode";
import { TextNode } from "./nodes/TextNode";

import { useWorkflowStore } from "@/store/workflowStore";
import { isValidConnection } from "@/lib/connectionValidation";
import { useCallback } from "react";
import { Connection, Edge } from "@xyflow/react";

export default function Canvas() {
  const nodes = useWorkflowStore((state) => state.nodes);
  const edges = useWorkflowStore((state) => state.edges);
  const onNodesChange = useWorkflowStore((state) => state.onNodesChange);
  const onEdgesChange = useWorkflowStore((state) => state.onEdgesChange);
  const onConnect = useWorkflowStore((state) => state.onConnect);

  const nodeTypes = useMemo(() => ({
    default: DefaultNode,
    text: TextNode,
  }), []);

  const checkConnection = useCallback(
    (connection: Connection | Edge) => isValidConnection(connection, nodes, edges),
    [nodes, edges]
  );

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        isValidConnection={checkConnection}
        fitView
        colorMode="dark"
        minZoom={0.1}
        maxZoom={1.5}
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="var(--color-card-border)" />
        <Controls 
          className="bg-[var(--color-card-background)] border-[var(--color-card-border)] fill-[var(--color-foreground)]" 
        />
        <MiniMap 
          zoomable 
          pannable 
          nodeColor="var(--color-node-bg)"
          maskColor="rgba(15, 15, 17, 0.7)"
          className="bg-[var(--color-card-background)] border border-[var(--color-card-border)] rounded-md overflow-hidden"
        />
      </ReactFlow>
    </div>
  );
}
