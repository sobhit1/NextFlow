"use client";

import { useWorkflowStore, AppNode } from "@/store/workflowStore";
import { Type, Image as ImageIcon, Video, BrainCircuit, Crop, Film, Plus, FolderOpen, Settings, LayoutGrid, Workflow } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { nanoid } from "nanoid";

const NODE_TYPES = [
  { type: "text", label: "Text", icon: Type },
  { type: "uploadImage", label: "Upload Image", icon: ImageIcon },
  { type: "uploadVideo", label: "Upload Video", icon: Video },
  { type: "llm", label: "Run Any LLM", icon: BrainCircuit },
  { type: "cropImage", label: "Crop Image", icon: Crop },
  { type: "extractFrame", label: "Extract Frame", icon: Film },
];

export default function LeftSidebar() {
  const addNode = useWorkflowStore((state) => state.addNode);

  const handleAddNode = (type: string, label: string) => {
    // Basic spread around center of canvas
    const x = Math.random() * 200 + 100;
    const y = Math.random() * 200 + 100;

    const newNode: AppNode = {
      id: `${type}-${nanoid(6)}`,
      type,
      position: { x, y },
      data: { label },
    };

    addNode(newNode);
  };

  return (
    <div className="w-64 border-r border-[var(--color-card-border)] bg-[var(--color-card-background)] flex flex-col h-full flex-shrink-0 z-10 shadow-xl">
      <div className="p-4 border-b border-[var(--color-card-border)]">
        <h2 className="text-xs font-semibold tracking-wider text-[var(--color-foreground)] opacity-70">
          QUICK ACCESS
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
        {NODE_TYPES.map((node) => (
          <button
            key={node.type}
            onClick={() => handleAddNode(node.type, node.label)}
            className="flex items-center justify-start gap-3 w-full p-3 rounded-lg border border-[var(--color-node-border)] bg-[var(--color-node-bg)] hover:border-[var(--color-primary)] hover:bg-[rgba(139,92,246,0.1)] transition-colors text-[var(--color-foreground)] hover:text-[var(--color-primary-foreground)] text-sm font-medium"
          >
            <node.icon size={18} className="opacity-80" />
            {node.label}
          </button>
        ))}
      </div>
    </div>
  );
}
