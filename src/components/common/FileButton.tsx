import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface FileButtonProps {
  children: ReactNode;
  onFiles: (files: File[]) => void;
  multiple?: boolean;
  capture?: boolean;
  primary?: boolean;
}

/** Button that opens the file picker for images and videos. */
export function FileButton({ children, onFiles, multiple, capture, primary }: FileButtonProps) {
  return (
    <Button asChild size="sm" variant={primary ? "default" : "outline"}>
      <label>
        {children}
        <input
          type="file"
          className="sr-only"
          accept="image/*,video/*"
          multiple={multiple}
          capture={capture ? "environment" : undefined}
          onChange={(e) => {
            onFiles(Array.from(e.target.files ?? []));
            e.target.value = "";
          }}
        />
      </label>
    </Button>
  );
}
