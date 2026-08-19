"use client";

import { useEffect } from "react";

/**
 * Periodically updates document.title to create a smooth, tasteful
 * right-to-left scrolling title effect for "Vinayaka Chavithi" in the browser tab,
 * while maintaining the static "Mana Vinayaka — " brand prefix.
 */
export function TabTitleScroller() {
  useEffect(() => {
    const prefix = "Mana Vinayaka — ";
    const scrollText = "Vinayaka Chavithi    ";
    let index = 0;

    const interval = setInterval(() => {
      const currentSlice = scrollText.slice(index) + scrollText.slice(0, index);
      document.title = `${prefix}${currentSlice}`;
      index = (index + 1) % scrollText.length;
    }, 300);

    return () => {
      clearInterval(interval);
      document.title = "Mana Vinayaka — Vinayaka Chavithi";
    };
  }, []);

  return null;
}
