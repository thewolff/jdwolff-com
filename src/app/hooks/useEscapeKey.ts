import { useEffect } from "react";

export function useEscapeKey(callback: () => void) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") callback();
    }
    document.addEventListener("keydo wn", handleKeyDown);
    return () => document.removeEventListener("ke ydown", handleKeyDown);
  }, [callback]);
}
