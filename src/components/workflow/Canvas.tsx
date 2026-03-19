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
import { LlmNode } from "./nodes/LlmNode";
import { ImageUploadNode } from "./nodes/ImageUploadNode";
import { VideoUploadNode } from "./nodes/VideoUploadNode";
import { CropImageNode } from "./nodes/CropImageNode";
import { ExtractFrameNode } from "./nodes/ExtractFrameNode";

import { useWorkflowStore } from "@/store/workflowStore";
import { isValidConnection } from "@/lib/connectionValidation";
import { executeWorkflowLocally } from "@/lib/executionEngine";
import { saveWorkflow } from "@/app/actions/workflow";
import { useCallback, useState } from "react";
import { Connection, Edge } from "@xyflow/react";
import { Play, Save, Loader2 } from "lucide-react";

export default function Canvas() {
  const nodes = useWorkflowStore((state) => state.nodes);
  const edges = useWorkflowStore((state) => state.edges);
  const workflowId = useWorkflowStore((state) => state.workflowId);
  const workflowName = useWorkflowStore((state) => state.workflowName);
  const setWorkflowMetadata = useWorkflowStore((state) => state.setWorkflowMetadata);
  const onNodesChange = useWorkflowStore((state) => state.onNodesChange);
  const onEdgesChange = useWorkflowStore((state) => state.onEdgesChange);
  const onConnect = useWorkflowStore((state) => state.onConnect);
  const updateNodeData = useWorkflowStore((state) => state.updateNodeData);

  const nodeTypes = useMemo(() => ({
    default: DefaultNode,
    text: TextNode,
    llm: LlmNode,
    uploadImage: ImageUploadNode,
    uploadVideo: VideoUploadNode,
    cropImage: CropImageNode,
    extractFrame: ExtractFrameNode,
  }), []);

  const checkConnection = useCallback(
    (connection: Connection) => isValidConnection(connection, nodes, edges),
    [nodes, edges]
  );

  const [isSaving, setIsSaving] = useState(false);

  const handleRun = () => {
    executeWorkflowLocally(nodes, edges, updateNodeData);
  };

  const handleSave = async () => {
    setIsSaving(true);
    const res = await saveWorkflow(workflowId, workflowName, nodes, edges);
    if (res.success && res.workflowId) {
      setWorkflowMetadata(res.workflowId, workflowName);
      // Could show a toast here
    }
    setIsSaving(false);
  };

  return (
    <div className="w-full h-full relative">
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

      {/* Top Right Floating Actions */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-3">
        <div className="bg-[rgba(0,0,0,0.5)] border border-[var(--color-card-border)] backdrop-blur-md rounded-lg p-1 px-3 flex items-center shadow-lg">
          <input 
            type="text" 
            value={workflowName}
            onChange={(e) => setWorkflowMetadata(workflowId, e.target.value)}
            className="bg-transparent text-sm font-medium text-[var(--color-foreground)] outline-none w-32 focus:w-48 transition-all"
            placeholder="Untitled..."
          />
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-3 py-2 bg-[var(--color-card-background)] border border-[var(--color-card-border)] text-[var(--color-foreground)] rounded-lg font-medium shadow-lg hover:bg-[rgba(255,255,255,0.05)] transition-all active:scale-95 disabled:opacity-50"
        >
          {isSaving ? <Loader2 size={16} className="animate-spin text-zinc-400" /> : <Save size={16} className="text-zinc-400" />}
          Save
        </button>

        <button
          onClick={handleRun}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-[var(--color-primary-foreground)] rounded-lg font-semibold shadow-lg hover:bg-opacity-90 transition-all active:scale-95"
        >
          <Play size={16} className="fill-current" />
          Run
        </button>
      </div>
    </div>
  );
}
