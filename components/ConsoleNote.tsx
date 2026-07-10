"use client";

import { useEffect } from "react";
import { consoleNote } from "@/lib/content";

export default function ConsoleNote() {
  useEffect(() => {
    console.log(consoleNote, "font-family:monospace");
  }, []);
  return null;
}
