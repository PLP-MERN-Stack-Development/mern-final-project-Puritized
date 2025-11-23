// src/components/ui/skeleton.jsx
import React from "react";
import clsx from "clsx";

export const Skeleton = ({ className }) => {
  return (
    <div
      className={clsx(
        "bg-muted animate-pulse rounded-md",
        className
      )}
    />
  );
};
