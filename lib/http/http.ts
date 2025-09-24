import { browserTokenProvider } from "./token-browser";

const BASE_URL = process.env.BASE_URL || "";

export type TokenProvider =
  | (() => Promise<string | null> | string | null)
  | null;
  
export function createHttp(opts: {
  baseUrl?: string;              // default: same origin
  tokenProvider?: TokenProvider; // how we get the access token
}) {
  const base = opts.baseUrl ?? BASE_URL;
  const tokenProvider = opts.tokenProvider ?? browserTokenProvider;

  async function run<T>(
    method: "GET"|"POST"|"PUT"|"PATCH"|"DELETE",
    url: string,
    body?: unknown,
    init?: RequestInit
  ): Promise<T> {
    const token =
      typeof tokenProvider === "function" ? await tokenProvider() : tokenProvider;

    const headers = new Headers(init?.headers);
    headers.set("Accept", "application/json");
    const isForm = typeof FormData !== "undefined" && body instanceof FormData;
    if (!isForm) headers.set("Content-Type", "application/json");
    if (token) headers.set("Authorization", `Bearer ${token}`);

    const res = await fetch(base + url, {
      method,
      headers,
      body: body == null ? undefined : isForm ? (body as FormData) : JSON.stringify(body),
      ...init,
    });

    // Normalize errors
    if (!res.ok) {
      let err: any;
      try { err = await res.json(); } catch { err = { error: await res.text() }; }
      throw new Error(err?.error || `HTTP ${res.status}`);
    }

    // Auto parse JSON
    const ct = res.headers.get("content-type") || "";
    return (ct.includes("application/json") ? res.json() : res.text()) as Promise<T>;
  }

  return {
    get:  <T>(u: string, i?: RequestInit) => run<T>("GET", u, undefined, i),
    post: <T>(u: string, b?: unknown, i?: RequestInit) => run<T>("POST", u, b, i),
    put:  <T>(u: string, b?: unknown, i?: RequestInit) => run<T>("PUT", u, b, i),
    patch:<T>(u: string, b?: unknown, i?: RequestInit) => run<T>("PATCH", u, b, i),
    del:  <T>(u: string, i?: RequestInit) => run<T>("DELETE", u, undefined, i),
  };
}
