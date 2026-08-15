"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const POLL_INTERVAL_MS = 6000;

export function OrdersRealtimeListener() {
  const router = useRouter();
  const routerRef = useRef(router);
  routerRef.current = router;

  useEffect(() => {
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        routerRef.current.refresh();
      }
    }, POLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  return null;
}
