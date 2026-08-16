import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebase/admin";
import { signSession, cookieOptions, COOKIE_NAME } from "@/lib/auth/session";
import { upsertUserFromFirebase } from "@/lib/usersRepo";

export const runtime = "nodejs";

// POST /api/auth/session — dipanggil client setelah signInWithPopup(Firebase)
// sukses, dengan { idToken } di body. Verifikasi token, upsert user, dan
// pasang cookie sesi kita sendiri (bukan cookie Firebase).
export async function POST(req: NextRequest) {
  try {
    const { idToken } = await req.json();
    if (!idToken) {
      return NextResponse.json({ error: "idToken wajib diisi." }, { status: 400 });
    }

    const decoded = await getAdminAuth().verifyIdToken(idToken);

    // decoded.email kosong untuk sign-in anonim (tamu) — itu wajar, bukan
    // error. upsertUserFromFirebase menyimpan baris user walau tanpa email.
    const user = await upsertUserFromFirebase({
      firebaseUid: decoded.uid,
      email: decoded.email,
      name: decoded.name || decoded.email,
    });

    const sessionToken = signSession(user.id);
    const response = NextResponse.json({ ok: true });
    response.cookies.set(COOKIE_NAME, sessionToken, cookieOptions());
    return response;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[auth] Firebase session verification failed:", err);
    return NextResponse.json({ error: "Verifikasi token gagal." }, { status: 401 });
  }
}
