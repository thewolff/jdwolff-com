"use client";

import {
  createContext,
  useContext,
  useLayoutEffect,
  useRef,
} from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useReducedMotion } from "@/app/hooks/useReducedMotion";

// ── Context ────────────────────────────────────────────────────────────────

type NavigateFn = (href: string) => void;

const NavigateContext = createContext<NavigateFn | null>(null);

/**
 * Watches pathname changes with useLayoutEffect so the view transition
 * promise resolves exactly when React has committed the new page to the DOM —
 * before the browser has painted it. This gives the View Transitions API a
 * clean "new state" snapshot.
 *
 * Add <ViewTransitionProvider> once, wrapping the layout body.
 */
export function ViewTransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const resolveRef = useRef<(() => void) | null>(null);
  const reducedMotion = useReducedMotion();

  // Fires synchronously after React commits the new tree but before paint.
  // Resolves the pending transition promise so the browser captures the
  // freshly-rendered new-page DOM as the "end" snapshot.
  useLayoutEffect(() => {
    if (resolveRef.current) {
      resolveRef.current();
      resolveRef.current = null;
    }
  }, [pathname]);

  function navigate(href: string) {
    if (reducedMotion || !document.startViewTransition) {
      router.push(href);
      return;
    }

    document.startViewTransition(() => {
      return new Promise<void>((resolve) => {
        resolveRef.current = resolve;
        router.push(href);
      });
    });
  }

  return (
    <NavigateContext.Provider value={navigate}>
      {children}
    </NavigateContext.Provider>
  );
}

// ── TransitionLink ─────────────────────────────────────────────────────────

interface TransitionLinkProps {
  href: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

/**
 * Drop-in for Next.js <Link> that morphs via the View Transitions API.
 * Requires <ViewTransitionProvider> somewhere above in the tree.
 */
export default function TransitionLink({
  href,
  className,
  style,
  children,
}: TransitionLinkProps) {
  const navigate = useContext(NavigateContext);

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (!navigate) return;
    e.preventDefault();
    navigate(href);
  }

  return (
    <Link href={href} className={className} style={style} onClick={handleClick}>
      {children}
    </Link>
  );
}
