import { BaseNode } from "./BaseNode";
import { CircleDot } from "lucide-react";
import { NodeProps } from "@xyflow/react";

export function DefaultNode(props: NodeProps) {
  return (
    <BaseNode
      id={props.id}
      selected={props.selected}
      title="Default Node"
      icon={<CircleDot size={16} />}
      hasInput
      hasOutput
    >
      <div className="text-sm text-[var(--color-foreground)] opacity-80">
        Default node content
      </div>
    </BaseNode>
  );
}
