import React from "react";
import { cn } from "../../lib/utils";

const Input = React.forwardRef(function Input({ className, type = "text", ...props }, ref) {
  return (
    <input
      ref={ref}
      type={type}
      className={cn("ui-input", className)}
      {...props}
    />
  );
});

export { Input };
