import { NextResponse } from "next/server";

const API_BASE = "https://back-texnoprom.uz";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const product_id = searchParams.get("product_id");
  const months = searchParams.get("months");

  if (!product_id || !months) {
    return NextResponse.json(
      { error: "product_id and months are required" },
      { status: 400 }
    );
  }

  const url = `${API_BASE}/installmentapi/calculate_installment/?product_id=${encodeURIComponent(
    product_id
  )}&months=${encodeURIComponent(months)}`;

  const res = await fetch(url, { cache: "no-store" });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  return NextResponse.json(data, { status: res.status });
}
