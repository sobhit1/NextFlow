"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { AppNode } from "@/store/workflowStore";
import { Edge } from "@xyflow/react";

export async function saveWorkflow(
  id: string | null,
  name: string,
  nodes: AppNode[],
  edges: Edge[]
) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    if (id) {
      // Update existing
      const existing = await prisma.workflow.findUnique({ where: { id } });
      if (!existing || existing.userId !== userId) throw new Error("Workflow not found or unauthorized");

      const updated = await prisma.workflow.update({
        where: { id },
        data: { name, nodes: nodes as any, edges: edges as any },
      });
      return { success: true, workflowId: updated.id };
    } else {
      // Create new
      const created = await prisma.workflow.create({
        data: {
          userId,
          name,
          nodes: nodes as any,
          edges: edges as any,
        },
      });
      return { success: true, workflowId: created.id };
    }
  } catch (err: any) {
    console.error("Failed to save workflow:", err);
    return { success: false, error: err.message };
  }
}

export async function getUserWorkflows() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const workflows = await prisma.workflow.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    });
    return { success: true, workflows };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function getWorkflowById(id: string) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const workflow = await prisma.workflow.findUnique({ where: { id } });
    if (!workflow || workflow.userId !== userId) throw new Error("Workflow not found");

    return { success: true, workflow };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
