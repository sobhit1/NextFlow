import { task } from "@trigger.dev/sdk/v3";
import ffmpeg from "fluent-ffmpeg";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import path from "path";
import os from "os";
import fs from "fs/promises";
// @ts-ignore
import Transloadit from "transloadit";

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

export const cropImageTask = task({
  id: "crop-image",
  run: async (payload: {
    imageUrl: string;
    x_percent?: number | string;
    y_percent?: number | string;
    width_percent?: number | string;
    height_percent?: number | string;
  }) => {
    const { 
      imageUrl, 
      x_percent = 0, 
      y_percent = 0, 
      width_percent = 100, 
      height_percent = 100 
    } = payload;

    const tmpDir = os.tmpdir();
    const outputFile = path.join(tmpDir, `cropped-${Date.now()}.jpg`);

    // We can use ffmpeg's ability to read from URL directly
    // and use expression evaluation in crop filter: iw (input width), ih (input height)
    const cropFilter = `crop=iw*${width_percent}/100:ih*${height_percent}/100:iw*${x_percent}/100:ih*${y_percent}/100`;

    await new Promise((resolve, reject) => {
      ffmpeg(imageUrl)
        .videoFilters(cropFilter)
        .outputOptions('-frames:v 1') // It's an image
        .output(outputFile)
        .on("end", resolve)
        .on("error", reject)
        .run();
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
