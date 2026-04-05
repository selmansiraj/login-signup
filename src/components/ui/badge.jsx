import React from "react";
import { cn } from "../../lib/utils";

function Badge({ className, ...props }) {
  return (
    <span
      className={cn("ui-badge", className)}
      {...props}
    />
  );
}

export { Badge };
