import React from "react";
import { cn } from "../../lib/utils";

const variants = {
  default: "ui-button--default",
  outline: "ui-button--outline",
  ghost: "ui-button--ghost",
  soft: "ui-button--soft"
};

const sizes = {
  default: "ui-button--size-default",
  lg: "ui-button--size-lg",
  icon: "ui-button--size-icon"
};

const Button = React.forwardRef(function Button(
  { className, variant = "default", size = "default", type = "button", ...props },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        "ui-button",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
});

export { Button };
