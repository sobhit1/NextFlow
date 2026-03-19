import { create } from 'zustand';
import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  addEdge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react';

export type AppNode = Node & { data: Record<string, unknown>; };

export interface WorkflowState {
  workflowId: string | null;
  workflowName: string;
  nodes: AppNode[];
  edges: Edge[];
  onNodesChange: OnNodesChange<AppNode>;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  addNode: (node: AppNode) => void;
  updateNodeData: (id: string, data: Partial<AppNode["data"]>) => void;
  setWorkflowMetadata: (id: string | null, name: string) => void;
  setWorkflow: (nodes: AppNode[], edges: Edge[]) => void;
};

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  workflowId: null,
  workflowName: '',
  nodes: [],
  edges: [],
  onNodesChange: (changes: NodeChange<AppNode>[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (connection: Connection) => {
    set({
      edges: addEdge(connection, get().edges),
    });
  },
  addNode: (node: AppNode) => {
    set({
      nodes: [...get().nodes, node],
    });
  },
  updateNodeData: (nodeId: string, data: any) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          return { ...node, data: { ...node.data, ...data } };
        }
        return node;
      }),
    });
  },
  
  setWorkflowMetadata: (id, name) => {
    set({ workflowId: id, workflowName: name });
  },

  setWorkflow: (nodes, edges) => {
    set({ nodes, edges });
  }
}));
