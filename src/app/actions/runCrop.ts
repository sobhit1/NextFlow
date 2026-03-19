"use server";

import { tasks } from "@trigger.dev/sdk/v3";
import { cropImageTask } from "@/trigger/cropImage";

export async function executeCropAction(payload: {
  imageUrl: string;
  x_percent?: number | string;
  y_percent?: number | string;
  width_percent?: number | string;
  height_percent?: number | string;
}) {
  try {
    const result = await tasks.triggerAndWait<typeof cropImageTask>("crop-image", payload);
    if (result.ok) {
      return { success: true, url: result.output.url };
    }
    return { success: false, error: "Task failed to complete" };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
