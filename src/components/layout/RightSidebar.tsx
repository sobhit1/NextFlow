"use client";

import { useEffect, useState } from "react";
import { History, FileText, Loader2 } from "lucide-react";
import { getUserWorkflows, getWorkflowById } from "@/app/actions/workflow";
import { useWorkflowStore } from "@/store/workflowStore";

export default function RightSidebar() {
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const setWorkflow = useWorkflowStore((state) => state.setWorkflow);
  const setWorkflowMetadata = useWorkflowStore((state) => state.setWorkflowMetadata);

  useEffect(() => {
    async function fetchHistory() {
      const res = await getUserWorkflows();
      if (res.success && res.workflows) {
        setWorkflows(res.workflows);
      }
      setLoading(false);
    }
    fetchHistory();
  }, []);

  const loadWorkflow = async (id: string) => {
    const res = await getWorkflowById(id);
    if (res.success && res.workflow) {
      setWorkflowMetadata(res.workflow.id, res.workflow.name);
      setWorkflow(res.workflow.nodes as any, res.workflow.edges as any);
    }
  };

  return (
    <div className="w-80 border-l border-[var(--color-card-border)] bg-[var(--color-card-background)] flex flex-col h-full flex-shrink-0 z-10 shadow-xl">
      <div className="p-4 border-b border-[var(--color-card-border)]">
        <h2 className="text-zinc-100 font-semibold text-sm flex items-center gap-2">
          <History size={16} className="text-zinc-400" />
          Execution History
        </h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
        {loading ? (
          <div className="flex justify-center p-4">
            <Loader2 className="animate-spin text-zinc-500" size={24} />
          </div>
        ) : workflows.length === 0 ? (
          <div className="text-xs text-zinc-500 text-center mt-10">
            No workflows saved yet.
          </div>
        ) : (
          workflows.map((wf) => (
            <div 
              key={wf.id}
              onClick={() => loadWorkflow(wf.id)}
              className="p-3 border border-[var(--color-card-border)] rounded-md hover:border-[var(--color-primary)] hover:bg-[rgba(255,255,255,0.02)] cursor-pointer transition-colors group"
            >
              <div className="flex items-center gap-2 mb-1">
                <FileText size={14} className="text-zinc-400 group-hover:text-[var(--color-primary)]" />
                <span className="text-sm text-zinc-200 font-medium truncate">{wf.name || "Untitled Workflow"}</span>
              </div>
              <div className="flex justify-between items-center text-[10px] text-zinc-500">
                <span>{new Date(wf.updatedAt).toLocaleDateString()}</span>
                <span className="bg-[rgba(255,255,255,0.05)] px-1.5 py-0.5 rounded text-zinc-400">{wf.nodes.length} nodes</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
