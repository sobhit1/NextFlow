import { memo, useState, useEffect } from "react";
import { Handle, Position, NodeProps, useEdges } from "@xyflow/react";
import { Film } from "lucide-react";
import { BaseNode } from "./BaseNode";
import { useWorkflowStore } from "@/store/workflowStore";

export const ExtractFrameNode = memo(function ExtractFrameNode({ id, data, selected }: NodeProps) {
  const updateNodeData = useWorkflowStore((state) => state.updateNodeData);
  const edges = useEdges();

  const isExecuting = data.isExecuting as boolean;
  const resultUrl = data.text as string;
  const errorText = data.error as string;

  const isVideoConnected = edges.some(e => e.target === id && e.targetHandle === "video_url");
  const isTimeConnected = edges.some(e => e.target === id && e.targetHandle === "timestamp");

  const [timestamp, setTimestamp] = useState(data.timestamp?.toString() || "0");

  useEffect(() => {
    updateNodeData(id, { timestamp });
  }, [timestamp, id, updateNodeData]);

  return (
    <BaseNode
      id={id}
      selected={selected}
      title="Extract Frame"
      icon={<Film size={16} />}
      isExecuting={isExecuting}
      hasInput={false}
      hasOutput={false}
    >
      <div className="flex flex-col gap-3 relative min-w-[200px]">
        {/* Handles */}
        <Handle type="target" position={Position.Left} id="video_url" style={{ top: "25%" }} className="w-3 h-3 bg-[var(--color-handle)] border-2 border-[var(--color-node-bg)] hover:bg-[var(--color-handle-connected)]" />
        <div className="text-[10px] text-zinc-400 absolute ml-[-8px]" style={{ top: "20%" }}>Video</div>

        <Handle type="target" position={Position.Left} id="timestamp" style={{ top: "60%" }} className="w-3 h-3 bg-[var(--color-handle)] border-2 border-[var(--color-node-bg)] hover:bg-[var(--color-handle-connected)]" />
        <div className="text-[10px] text-zinc-400 absolute ml-[-8px]" style={{ top: "55%" }}>Time</div>

        <Handle type="source" position={Position.Right} id="output" style={{ top: "50%" }} className="w-3 h-3 bg-[var(--color-handle)] border-2 border-[var(--color-node-bg)] hover:bg-[var(--color-handle-connected)]" />

        {/* Manual Inputs */}
        <div className="flex flex-col mt-6 pl-3">
          <label className="text-[10px] text-zinc-500">Timestamp (s or %)</label>
          <input 
            type="text" 
            disabled={isTimeConnected} 
            value={timestamp} 
            onChange={e => setTimestamp(e.target.value)} 
            className="bg-[rgba(0,0,0,0.2)] border border-[var(--color-card-border)] text-xs rounded p-1 mt-1" 
            placeholder="e.g. 5 or 50%"
          />
        </div>

        {/* Inline Output */}
        {(resultUrl || errorText || isExecuting) && (
          <div className="mt-2 p-2 rounded-md bg-[rgba(0,0,0,0.3)] border border-[var(--color-card-border)] ml-3">
            {isExecuting && <div className="text-xs text-zinc-400 animate-pulse">Extracting...</div>}
            {errorText && <div className="text-xs text-red-400 break-words">{errorText}</div>}
            {resultUrl && (
              <div className="mt-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={resultUrl} alt="Extracted Frame" className="w-full h-auto rounded border border-[var(--color-card-border)]" />
              </div>
            )}
          </div>
        )}
      </div>
    </BaseNode>
  );
});
