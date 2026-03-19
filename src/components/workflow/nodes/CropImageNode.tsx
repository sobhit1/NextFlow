import { memo, useState, useEffect } from "react";
import { Handle, Position, NodeProps, useEdges } from "@xyflow/react";
import { Crop, Play } from "lucide-react";
import { BaseNode } from "./BaseNode";
import { useWorkflowStore } from "@/store/workflowStore";

export const CropImageNode = memo(function CropImageNode({ id, data, selected }: NodeProps) {
  const updateNodeData = useWorkflowStore((state) => state.updateNodeData);
  const edges = useEdges();

  const isExecuting = data.isExecuting as boolean;
  const resultUrl = data.text as string; // Execution engine sets 'text' or we can standardize on 'url'
  const errorText = data.error as string;

  // Check if inputs are connected
  const isImageConnected = edges.some(e => e.target === id && e.targetHandle === "image_url");
  const isXConnected = edges.some(e => e.target === id && e.targetHandle === "x_percent");
  const isYConnected = edges.some(e => e.target === id && e.targetHandle === "y_percent");
  const isWConnected = edges.some(e => e.target === id && e.targetHandle === "width_percent");
  const isHConnected = edges.some(e => e.target === id && e.targetHandle === "height_percent");

  const [localX, setLocalX] = useState(data.x_percent?.toString() || "0");
  const [localY, setLocalY] = useState(data.y_percent?.toString() || "0");
  const [localW, setLocalW] = useState(data.width_percent?.toString() || "100");
  const [localH, setLocalH] = useState(data.height_percent?.toString() || "100");

  useEffect(() => {
    updateNodeData(id, { x_percent: localX, y_percent: localY, width_percent: localW, height_percent: localH });
  }, [localX, localY, localW, localH, id, updateNodeData]);

  return (
    <BaseNode
      id={id}
      selected={selected}
      title="Crop Image"
      icon={<Crop size={16} />}
      isExecuting={isExecuting}
      hasInput={false}
      hasOutput={false}
    >
      <div className="flex flex-col gap-3 relative min-w-[200px]">
        {/* Handles */}
        <Handle type="target" position={Position.Left} id="image_url" style={{ top: "15%" }} className="w-3 h-3 bg-[var(--color-handle)] border-2 border-[var(--color-node-bg)] hover:bg-[var(--color-handle-connected)]" />
        <div className="text-[10px] text-zinc-400 absolute ml-[-8px]" style={{ top: "10%" }}>Image</div>

        <Handle type="target" position={Position.Left} id="x_percent" style={{ top: "35%" }} className="w-3 h-3 bg-[var(--color-handle)] border-2 border-[var(--color-node-bg)] hover:bg-[var(--color-handle-connected)]" />
        <Handle type="target" position={Position.Left} id="y_percent" style={{ top: "55%" }} className="w-3 h-3 bg-[var(--color-handle)] border-2 border-[var(--color-node-bg)] hover:bg-[var(--color-handle-connected)]" />
        <Handle type="target" position={Position.Left} id="width_percent" style={{ top: "75%" }} className="w-3 h-3 bg-[var(--color-handle)] border-2 border-[var(--color-node-bg)] hover:bg-[var(--color-handle-connected)]" />
        <Handle type="target" position={Position.Left} id="height_percent" style={{ top: "95%" }} className="w-3 h-3 bg-[var(--color-handle)] border-2 border-[var(--color-node-bg)] hover:bg-[var(--color-handle-connected)]" />

        <Handle type="source" position={Position.Right} id="output" style={{ top: "50%" }} className="w-3 h-3 bg-[var(--color-handle)] border-2 border-[var(--color-node-bg)] hover:bg-[var(--color-handle-connected)]" />

        {/* Manual Inputs */}
        <div className="grid grid-cols-2 gap-2 mt-4 pl-3">
          <div className="flex flex-col">
            <label className="text-[10px] text-zinc-500">X (%)</label>
            <input type="number" disabled={isXConnected} value={localX} onChange={e => setLocalX(e.target.value)} className="bg-[rgba(0,0,0,0.2)] border border-[var(--color-card-border)] text-xs rounded p-1" />
          </div>
          <div className="flex flex-col">
            <label className="text-[10px] text-zinc-500">Y (%)</label>
            <input type="number" disabled={isYConnected} value={localY} onChange={e => setLocalY(e.target.value)} className="bg-[rgba(0,0,0,0.2)] border border-[var(--color-card-border)] text-xs rounded p-1" />
          </div>
          <div className="flex flex-col">
            <label className="text-[10px] text-zinc-500">Width (%)</label>
            <input type="number" disabled={isWConnected} value={localW} onChange={e => setLocalW(e.target.value)} className="bg-[rgba(0,0,0,0.2)] border border-[var(--color-card-border)] text-xs rounded p-1" />
          </div>
          <div className="flex flex-col">
            <label className="text-[10px] text-zinc-500">Height (%)</label>
            <input type="number" disabled={isHConnected} value={localH} onChange={e => setLocalH(e.target.value)} className="bg-[rgba(0,0,0,0.2)] border border-[var(--color-card-border)] text-xs rounded p-1" />
          </div>
        </div>

        {/* Inline Output */}
        {(resultUrl || errorText || isExecuting) && (
          <div className="mt-2 p-2 rounded-md bg-[rgba(0,0,0,0.3)] border border-[var(--color-card-border)] ml-3">
            {isExecuting && <div className="text-xs text-zinc-400 animate-pulse">Cropping...</div>}
            {errorText && <div className="text-xs text-red-400 break-words">{errorText}</div>}
            {resultUrl && (
              <div className="mt-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={resultUrl} alt="Cropped" className="w-full h-auto rounded border border-[var(--color-card-border)]" />
              </div>
            )}
          </div>
        )}
      </div>
    </BaseNode>
  );
});
