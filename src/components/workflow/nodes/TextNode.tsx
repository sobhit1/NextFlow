import { memo, useEffect, useRef } from "react";
import { NodeProps } from "@xyflow/react";
import { Type } from "lucide-react";
import { BaseNode } from "./BaseNode";
import { useWorkflowStore } from "@/store/workflowStore";

export const TextNode = memo(function TextNode({ id, data, selected }: NodeProps) {
  const updateNodeData = useWorkflowStore((state) => state.updateNodeData);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [data.text]);

  const onChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateNodeData(id, { text: evt.target.value });
  };

  return (
    <BaseNode
      id={id}
      selected={selected}
      title="Text"
      icon={<Type size={16} />}
      hasOutput
      outputHandleId="output"
    >
      <div className="flex flex-col gap-2">
        <textarea
          ref={textareaRef}
          className="w-full min-h-[60px] max-h-[300px] resize-none overflow-hidden rounded-md border border-[var(--color-card-border)] bg-[rgba(0,0,0,0.2)] p-2 text-sm text-[var(--color-foreground)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] transition-colors placeholder:text-zinc-500"
          placeholder="Enter text..."
          value={(data.text as string) || ""}
          onChange={onChange}
        />
      </div>
    </BaseNode>
  );
});
