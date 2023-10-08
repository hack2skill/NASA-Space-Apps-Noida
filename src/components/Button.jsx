"use client";
import React from "react";
import { Button } from "@nextui-org/react";
import { cn } from "@/lib/utils";

export default function Buttons({
  icon,
  text,
  color,
  fn,
  className,
  variant = "ghost",
}) {
  return (
    <Button
      color={color}
      className={cn("text-lg mr-2 shadow-xl", className)}
      variant={variant}
      onPress={fn}
      startContent={icon}
    >
      {text}
    </Button>
  );
}
