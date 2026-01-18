import { httpClient } from "@/httpClient/httpClient";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
  try {
    const auth = req.headers.get("authorization") || "";
    const body = await req.json(); 

    const res = await fetch(`${httpClient}/pay-link/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(auth ? { Authorization: auth } : {}),
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const text = await res.text();
    const data = text ? JSON.parse(text) : null;

    return NextResponse.json(data, { status: res.status });
  } catch (e: any) {
    return NextResponse.json(
      { message: e?.message ?? "Server error" },
      { status: 500 }
    );
  }
}
