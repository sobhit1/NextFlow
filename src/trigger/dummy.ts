import { task } from "@trigger.dev/sdk/v3";

export const dummyTask = task({
  id: "dummy-task",
  run: async (payload: { message: string }) => {
    console.log("Dummy task running with payload:", payload);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return { success: true, received: payload.message };
  },
});
