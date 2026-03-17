"use client";

import { useCallback, useState } from "react";
import { Upload } from "lucide-react";

interface DropZoneProps {
  onFile: (file: File) => void;
}

export default function DropZone({ onFile }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) onFile(file);
    },
    [onFile]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFile(file);
  };

  return (
    <label
      className={`flex flex-col items-center justify-center h-[180px] rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 ${
        isDragging
          ? "border-brand-accent bg-brand-accent/5"
          : "border-brand-border bg-brand-surface hover:border-brand-accent/40 hover:bg-brand-surface/80"
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept=".pdf,.docx,.txt"
        className="hidden"
        onChange={handleChange}
      />
      <div className="flex flex-col items-center gap-3 text-center px-4">
        <div
          className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-colors ${
            isDragging
              ? "border-brand-accent/40 bg-brand-accent/10"
              : "border-brand-border bg-brand-bg"
          }`}
        >
          <Upload
            size={20}
            className={isDragging ? "text-brand-accent" : "text-brand-muted"}
          />
        </div>
        <div>
          <p className="text-brand-text text-sm font-500 mb-0.5">
            Drop your resume here
          </p>
          <p className="text-brand-muted text-xs">
            PDF, DOCX, or TXT · Max 5MB
          </p>
        </div>
        <span className="text-xs text-brand-accent font-mono border border-brand-accent/20 bg-brand-accent/5 px-3 py-1 rounded-full">
          Browse files
        </span>
      </div>
    </label>
  );
}
