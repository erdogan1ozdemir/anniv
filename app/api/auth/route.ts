import { NextResponse } from "next/server";

const COOKIE_NAME = "bahce_session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 yıl

export async function POST(request: Request) {
  const expected = process.env.BAHCE_PASSWORD ?? "yarim";
  const sessionValue = process.env.BAHCE_SECRET ?? "yarim";

  let body: { password?: string } = {};
  try {
    body = (await request.json()) as { password?: string };
  } catch {
    body = {};
  }

  if (!body.password || body.password !== expected) {
    return NextResponse.json(
      { ok: false, message: "yanlış şifre" },
      { status: 401 },
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE_NAME, sessionValue, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
    secure: process.env.NODE_ENV === "production",
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete(COOKIE_NAME);
  return response;
}
