"use client";

import { useCallback, useEffect, useState } from "react";

export function useAuthToken(storageKey = "apiAuthToken") {
  const [authToken, setAuthToken] = useState<string>("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem(storageKey);
    if (saved) setAuthToken(saved);
  }, [storageKey]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (authToken) {
      window.localStorage.setItem(storageKey, authToken);
    } else {
      window.localStorage.removeItem(storageKey);
    }
  }, [authToken, storageKey]);

  const generateDemoToken = useCallback(() => {
    const header = { alg: "HS256", typ: "JWT" };
    const now = Math.floor(Date.now() / 1000);
    const payload = { sub: "demo-user", iat: now, exp: now + 3600 };
    const base64url = (obj: any) =>
      Buffer.from(JSON.stringify(obj))
        .toString("base64")
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");
    const unsigned = `${base64url(header)}.${base64url(payload)}`;
    return `${unsigned}.demo-signature`;
  }, []);

  return { authToken, setAuthToken, generateDemoToken } as const;
}

