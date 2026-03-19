import React from "react";
import { Handle, Position } from "@xyflow/react";
import { cn } from "@/lib/utils";

export interface BaseNodeProps {
  id: string;
  selected?: boolean;
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  isExecuting?: boolean;
  className?: string;
  hasInput?: boolean;
  hasOutput?: boolean;
  inputHandleId?: string;
  outputHandleId?: string;
}

export function BaseNode({
  selected,
  title,
  children,
  icon,
  isExecuting,
  className,
  hasInput = false,
  hasOutput = false,
  inputHandleId = "in",
  outputHandleId = "out",
}: BaseNodeProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col min-w-[280px] rounded-xl border bg-[var(--color-node-bg)] shadow-md transition-all duration-200",
        selected
          ? "border-[var(--color-node-border-active)] shadow-[0_0_0_1px_var(--color-node-border-active)]"
          : "border-[var(--color-node-border)] hover:border-[var(--color-node-border-active)]",
        isExecuting && "ring-2 ring-primary ring-offset-2 ring-offset-[var(--color-background)] animate-pulse shadow-[0_0_15px_rgba(139,92,246,0.5)]",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-[var(--color-node-border)] bg-[rgba(255,255,255,0.02)] rounded-t-xl">
        {icon && <div className="text-[var(--color-foreground)] opacity-70">{icon}</div>}
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-foreground)] opacity-90">
          {title}
        </span>
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col gap-3">
        {children}
      </div>

      {/* Handles */}
      {hasInput && (
        <Handle
          type="target"
          position={Position.Left}
          id={inputHandleId}
          className="w-3 h-3 bg-[var(--color-handle)] border-2 border-[var(--color-node-bg)] transition-colors hover:bg-[var(--color-handle-connected)]"
        />
      )}
      {hasOutput && (
        <Handle
          type="source"
          position={Position.Right}
          id={outputHandleId}
          className="w-3 h-3 bg-[var(--color-handle)] border-2 border-[var(--color-node-bg)] transition-colors hover:bg-[var(--color-handle-connected)]"
        />
      )}
    </div>
  );
}
