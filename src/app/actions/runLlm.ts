"use server";

import { tasks } from "@trigger.dev/sdk/v3";
import { runLlmTask } from "@/trigger/llm";

export async function executeLlmAction(payload: {
  systemPrompt?: string;
  userMessage: string;
  images?: { mimeType: string; data: string }[];
  model: string;
}) {
  try {
    // We use triggerAndWait to block until the task is complete to show the result on UI
    const result = await tasks.triggerAndWait<typeof runLlmTask>("llm-execution", payload);
    
    if (result.ok) {
      return { success: true, text: result.output.text };
    } else {
      console.error("Task failed:", result.error);
      return { success: false, error: "Task failed to complete" };
    }
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
