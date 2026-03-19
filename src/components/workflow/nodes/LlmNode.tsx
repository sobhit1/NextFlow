import { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { BrainCircuit } from "lucide-react";
import { BaseNode } from "./BaseNode";
import { useWorkflowStore } from "@/store/workflowStore";

const MODELS = [
  { id: "gemini-2.5-flash", label: "Gemini 2.5 Flash" },
  { id: "gemini-2.5-pro", label: "Gemini 2.5 Pro" },
  { id: "gemini-1.5-flash", label: "Gemini 1.5 Flash" },
  { id: "gemini-1.5-pro", label: "Gemini 1.5 Pro" },
];

export const LlmNode = memo(function LlmNode({ id, data, selected }: NodeProps) {
  const updateNodeData = useWorkflowStore((state) => state.updateNodeData);

  const onChangeModel = (evt: React.ChangeEvent<HTMLSelectElement>) => {
    updateNodeData(id, { model: evt.target.value });
  };

  const isExecuting = data.isExecuting as boolean;
  const resultText = data.text as string;
  const errorText = data.error as string;
  const selectedModel = (data.model as string) || "gemini-2.5-flash";

  return (
    <BaseNode
      id={id}
      selected={selected}
      title="Run Any LLM"
      icon={<BrainCircuit size={16} />}
      isExecuting={isExecuting}
      hasInput={false}
      hasOutput={false}
    >
      <div className="flex flex-col gap-3 relative">
        {/* Custom Input Handles */}
        <Handle
          type="target"
          position={Position.Left}
          id="system_prompt"
          style={{ top: "15%" }}
          className="w-3 h-3 bg-[var(--color-handle)] border-2 border-[var(--color-node-bg)] hover:bg-[var(--color-handle-connected)]"
        />
        <div className="text-[10px] text-zinc-400 absolute ml-[-8px]" style={{ top: "10%" }}>System</div>

        <Handle
          type="target"
          position={Position.Left}
          id="user_message"
          style={{ top: "45%" }}
          className="w-3 h-3 bg-[var(--color-handle)] border-2 border-[var(--color-node-bg)] hover:bg-[var(--color-handle-connected)]"
        />
        <div className="text-[10px] text-zinc-400 absolute ml-[-8px]" style={{ top: "40%" }}>Message</div>

        <Handle
          type="target"
          position={Position.Left}
          id="images"
          style={{ top: "75%" }}
          className="w-3 h-3 bg-[var(--color-handle)] border-2 border-[var(--color-node-bg)] hover:bg-[var(--color-handle-connected)]"
        />
        <div className="text-[10px] text-zinc-400 absolute ml-[-8px]" style={{ top: "70%" }}>Images</div>

        {/* Output Handle */}
        <Handle
          type="source"
          position={Position.Right}
          id="output"
          style={{ top: "50%" }}
          className="w-3 h-3 bg-[var(--color-handle)] border-2 border-[var(--color-node-bg)] hover:bg-[var(--color-handle-connected)]"
        />
        
        {/* Model Selector */}
        <div className="flex flex-col gap-1 mt-1 pl-3 pr-2">
          <label className="text-xs text-zinc-500 font-medium tracking-wide">MODEL</label>
          <select
            className="w-full bg-[rgba(0,0,0,0.2)] border border-[var(--color-card-border)] text-[var(--color-foreground)] text-xs rounded p-1.5 focus:outline-none focus:border-[var(--color-primary)]"
            value={selectedModel}
            onChange={onChangeModel}
          >
            {MODELS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        {/* Inline Output Display */}
        {(resultText || errorText || isExecuting) && (
          <div className="mt-2 p-2 rounded-md bg-[rgba(0,0,0,0.3)] border border-[var(--color-card-border)] ml-3 mr-2">
            {isExecuting && (
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Generating...
              </div>
            )}
            {errorText && (
              <div className="text-xs text-red-400 whitespace-pre-wrap">
                {errorText}
              </div>
            )}
            {resultText && (
              <div className="text-xs text-[var(--color-foreground)] whitespace-pre-wrap max-h-[150px] overflow-y-auto">
                {resultText}
              </div>
            )}
          </div>
        )}
      </div>
    </BaseNode>
  );
});
