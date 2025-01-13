import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormFieldProps {
  id: string;
  label: string;
  placeholder: string;
  className?: string;
  name?: string; 
  value?: string;
  type?: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  ({ id, label, placeholder, className = "", name, value, type = "text", inputProps, onChange }, ref) => (
    <div className={`flex flex-col space-y-1.5 ${className}`}>
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
      </Label>
      <Input
        ref={ref}
        id={id}
        name={name}
        value={value}
        type={type}
        placeholder={placeholder}
        className="p-2 border rounded focus:outline-none focus:ring-0"
        onChange={onChange}
        {...inputProps}
      />
    </div>
  ),
);

FormField.displayName = "FormField";

export { FormField };
