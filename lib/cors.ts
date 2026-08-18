import { NextResponse } from "next/server";

/**
 * Dipakai API route yang diakses Chrome extension (chrome-extension://...
 * origin) selain web app. Extension dengan host_permissions biasanya udah
 * lolos CORS otomatis, tapi header ini jaga-jaga untuk permintaan yang
 * tetap kena preflight (mis. karena header Authorization).
 */
export const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export function corsJson(body: unknown, init?: { status?: number }) {
  return NextResponse.json(body, { ...init, headers: CORS_HEADERS });
}

export function handleOptions() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}
