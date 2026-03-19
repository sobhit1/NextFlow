"use server";

import { tasks } from "@trigger.dev/sdk/v3";
import { extractFrameTask } from "@/trigger/extractFrame";

export async function executeExtractAction(payload: {
  videoUrl: string;
  timestamp?: number | string;
}) {
  try {
    const result = await tasks.triggerAndWait<typeof extractFrameTask>("extract-frame", payload);
    if (result.ok) {
      return { success: true, url: result.output.url };
    }
    return { success: false, error: "Task failed to complete" };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
