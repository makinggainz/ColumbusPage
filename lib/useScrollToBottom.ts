"use client";

// Replaced by useScrollDepth — kept as a re-export so any stray imports
// don't break. useScrollDepth fires at 25/50/75/90% instead of just 90%.
export { useScrollDepth as useScrollToBottom } from "./useScrollDepth";
