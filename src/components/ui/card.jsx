import React from "react";
import { cn } from "../../lib/utils";

const Card = React.forwardRef(function Card({ className, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={cn("ui-card", className)}
      {...props}
    />
  );
});

const CardHeader = React.forwardRef(function CardHeader({ className, ...props }, ref) {
  return <div ref={ref} className={cn("ui-card-header", className)} {...props} />;
});

const CardTitle = React.forwardRef(function CardTitle({ className, children, ...props }, ref) {
  return (
    <h2
      ref={ref}
      className={cn("ui-card-title", className)}
      {...props}
    >
      {children}
    </h2>
  );
});

const CardDescription = React.forwardRef(function CardDescription({ className, ...props }, ref) {
  return (
    <p
      ref={ref}
      className={cn("ui-card-description", className)}
      {...props}
    />
  );
});

const CardContent = React.forwardRef(function CardContent({ className, ...props }, ref) {
  return <div ref={ref} className={cn("ui-card-content", className)} {...props} />;
});

export { Card, CardContent, CardDescription, CardHeader, CardTitle };
