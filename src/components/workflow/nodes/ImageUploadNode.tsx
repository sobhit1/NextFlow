import { memo, useRef, useState } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { Image as ImageIcon, Upload, Loader2 } from "lucide-react";
import { BaseNode } from "./BaseNode";
import { useWorkflowStore } from "@/store/workflowStore";
import { uploadToTransloadit } from "@/app/actions/uploadTransloadit";

export const ImageUploadNode = memo(function ImageUploadNode({ id, data, selected }: NodeProps) {
  const updateNodeData = useWorkflowStore((state) => state.updateNodeData);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const imageUrl = data.imageUrl as string;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file.");
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      
      const result = await uploadToTransloadit(formData);
      
      if (result.success && result.url) {
        // Update store with the new URL
        updateNodeData(id, { imageUrl: result.url });
      } else {
        setError(result.error || "Upload failed");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong during upload");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <BaseNode
      id={id}
      selected={selected}
      title="Upload Image"
      icon={<ImageIcon size={16} />}
      hasOutput
      outputHandleId="output"
    >
      <div className="flex flex-col gap-2 min-h-[80px]">
        {error && <div className="text-xs text-red-400 mb-1">{error}</div>}
        
        {!imageUrl && !isUploading && (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center border-2 border-dashed border-[var(--color-card-border)] hover:border-[var(--color-primary)] rounded-lg p-6 cursor-pointer transition-colors bg-[rgba(0,0,0,0.1)] group text-[var(--color-foreground)] opacity-70 hover:opacity-100"
          >
            <Upload size={20} className="mb-2 text-zinc-400 group-hover:text-[var(--color-primary)] transition-colors" />
            <span className="text-xs text-center font-medium">Click to upload image</span>
            <span className="text-[10px] text-zinc-500 mt-1">JPG, PNG, WEBP, GIF</span>
          </div>
        )}

        {isUploading && (
          <div className="flex flex-col items-center justify-center border border-[var(--color-card-border)] rounded-lg p-6 bg-[rgba(0,0,0,0.1)]">
            <Loader2 size={24} className="animate-spin text-[var(--color-primary)] mb-2" />
            <span className="text-xs text-zinc-400">Uploading to Transloadit...</span>
          </div>
        )}

        {imageUrl && !isUploading && (
          <div className="relative group rounded-lg overflow-hidden border border-[var(--color-card-border)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={imageUrl} 
              alt="Uploaded preview" 
              className="w-full h-[150px] object-cover"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button 
                onClick={() => updateNodeData(id, { imageUrl: null })}
                className="text-xs font-semibold bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-full backdrop-blur-sm transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        )}

        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/jpeg, image/png, image/webp, image/gif"
          onChange={handleFileChange} 
        />
      </div>
    </BaseNode>
  );
});
