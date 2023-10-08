"use client";
import React from "react";
import { Image } from "@nextui-org/react";

export default function Images({ image_url }) {
  return <Image width={600} alt="Login Graphics" src={image_url} />;
}
