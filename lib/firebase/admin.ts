import { initializeApp, getApps, getApp, cert } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";

// Lazy init: firebase-admin's cert() throws immediately if the service
// account env vars are missing, which would crash `next build`'s route
// data collection before any request ever comes in. Deferring construction
// to first use means the build only fails loudly once someone actually
// hits an auth route without the env vars set.
let cached: Auth | undefined;

export function getAdminAuth(): Auth {
  if (cached) return cached;

  const app =
    getApps().length > 0
      ? getApp()
      : initializeApp({
          credential: cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
          }),
        });

  cached = getAuth(app);
  return cached;
}
