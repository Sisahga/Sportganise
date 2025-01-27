import React, { forwardRef } from "react";

interface FileInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  children: React.ReactNode;
}

const FileInput = forwardRef<HTMLInputElement, FileInputProps>(
  ({ children, ...props }, ref) => (
    <label className="relative cursor-pointer">
      <input type="file" ref={ref} {...props} className="hidden" />
      {children}
    </label>
  ),
);

FileInput.displayName = "FileInput";

export default FileInput;
