import { defineConfig } from "@trigger.dev/sdk/v3";

export default defineConfig({
  project: "proj_nextflow", // This doesn't strictly matter for local dev since we have the secret key in .env
  runtime: "node",
  logLevel: "log",
  dirs: ["./src/trigger"],
});
