import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Lazy init: getAuth() validates the config immediately and throws if it's
// missing/placeholder, which would otherwise blow up Next's static prerender
// of any page that imports a client component using this (even though the
// prerendered HTML never actually calls auth methods).
let cached: Auth | undefined;

export function getClientAuth(): Auth {
  if (cached) return cached;
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  cached = getAuth(app);
  return cached;
}
