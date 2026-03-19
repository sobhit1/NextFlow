"use client";

import { useCallback } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

const initialNodes = [];
const initialEdges = [];

export default function Canvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
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
