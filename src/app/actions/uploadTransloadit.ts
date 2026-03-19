"use server";

import Transloadit from "transloadit";

export async function uploadToTransloadit(formData: FormData): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const file = formData.get("file") as File;
    if (!file) {
      throw new Error("No file provided");
    }

    const transloadit = new Transloadit({
      authKey: process.env.TRANSLOADIT_KEY || "",
      authSecret: process.env.TRANSLOADIT_SECRET || "",
    });

    // Write file to a buffer and pass it to Transloadit
    const buffer = Buffer.from(await file.arrayBuffer());
    transloadit.addStream("file", buffer, file.name || "upload");

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

    return new Promise((resolve, reject) => {
      transloadit.createAssembly(options, (err: any, result: any) => {
        if (err) {
          console.error("Transloadit error:", err);
          return resolve({ success: false, error: err.message });
        }
        
        // Find the SSL URL of the uploaded original file
        const storedUrls = result.results?.store || result.results?.[":original"];
        if (storedUrls && storedUrls.length > 0) {
          return resolve({ success: true, url: storedUrls[0].ssl_url });
        }
        
        // Fallback if not found in store
        resolve({ success: false, error: "Upload succeeded but could not retrieve URL" });
      });
    });

  } catch (error: any) {
    console.error("Upload error:", error);
    return { success: false, error: error.message };
  }
}
