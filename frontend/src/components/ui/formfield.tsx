import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormFieldProps {
  id: string;
  label: string;
  placeholder: string;
  className?: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  ({ id, label, placeholder, className = "", inputProps }, ref) => (
    <div className={`flex flex-col space-y-1.5 ${className}`}>
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
      </Label>
      <Input
        ref={ref}
        id={id}
        placeholder={placeholder}
        className="p-2 border rounded"
        {...inputProps}
      />
    </div>
  )
);

FormField.displayName = "FormField";

export { FormField };
