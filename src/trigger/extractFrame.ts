import { task } from "@trigger.dev/sdk/v3";
import ffmpeg from "fluent-ffmpeg";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import path from "path";
import os from "os";
import fs from "fs/promises";
// @ts-ignore
import Transloadit from "transloadit";

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

export const extractFrameTask = task({
  id: "extract-frame",
  run: async (payload: {
    videoUrl: string;
    timestamp?: number | string; // e.g., 5 or "50%"
  }) => {
    const { videoUrl, timestamp = 0 } = payload;

    const tmpDir = os.tmpdir();
    const outputFile = path.join(tmpDir, `frame-${Date.now()}.jpg`);

    await new Promise((resolve, reject) => {
      // @ts-ignore: ffmpeg takes strings or numbers but typed as numbers mostly
      ffmpeg(videoUrl)
        .screenshots({
          timestamps: [typeof timestamp === 'string' ? timestamp : Number(timestamp)],
          folder: tmpDir,
          filename: path.basename(outputFile),
          size: '100%'
        }).on("end", resolve)
        .on("error", reject);
    });

    // Upload to Transloadit
    const transloadit = new Transloadit({
      authKey: process.env.TRANSLOADIT_KEY || "",
      authSecret: process.env.TRANSLOADIT_SECRET || "",
    });

    transloadit.addFile("file", outputFile);
    
    const options = {
      params: {
        steps: {
          store: {
            use: ":original",
            robot: "/s3/store",
          },
        },
      },
    };

    const url = await new Promise<string>((resolve, reject) => {
      transloadit.createAssembly(options, (err: any, result: any) => {
        if (err) return reject(err);
        const storedUrls = result.results?.store || result.results?.[":original"];
        if (storedUrls && storedUrls.length > 0) {
          resolve(storedUrls[0].ssl_url);
        } else {
          reject(new Error("Upload succeeded but could not retrieve URL"));
        }
      });
    });

    // Cleanup
    await fs.unlink(outputFile).catch(() => {});

    return { success: true, url };
  },
});
