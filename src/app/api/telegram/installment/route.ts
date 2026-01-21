import { NextResponse } from "next/server";

type InstallmentService = { title: string; monthly_payment: number };

type CartItem = {
  id: string;
  title: string;
  quantity: number;
  price: number;
  installment?: number;
  installmentService?: InstallmentService;
};

type Body = {
  name?: string;
  phone_number: string;
  district: string;
  delivery_address: string;
  items: CartItem[];
  totalPrice: number;
  totalMonthly?: number;
};

function formatUZS(value: number) {
  return Math.round(value).toLocaleString("ru-RU");
}

export async function POST(req: Request) {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      return NextResponse.json(
        { message: "Telegram env vars not set" },
        { status: 500 }
      );
    }

    const body = (await req.json()) as Body;

    if (!body?.phone_number || !body?.district || !body?.delivery_address) {
      return NextResponse.json(
        { message: "Заполните телефон, район и адрес" },
        { status: 400 }
      );
    }

    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json({ message: "Корзина пустая" }, { status: 400 });
    }

    const lines = body.items.map((i, idx) => {
      const hasInst =
        !!i.installment &&
        !!i.installmentService?.title &&
        typeof i.installmentService?.monthly_payment === "number";

      const instLine = hasInst
        ? `\nРассрочка: ${i.installmentService!.title} • ${
            i.installment
          } мес • ${formatUZS(i.installmentService!.monthly_payment)} сум/мес`
        : "";

      return (
        `${idx + 1}) ${i.title}` +
        `\nКол-во: ${i.quantity}` +
        `\nЦена: ${formatUZS(i.price)} сум` +
        instLine +
        `\n------`
      );
    });

    const text =
      `🟡 Заявка: РАССРОЧКА\n` +
      `${body.name ? `👤 Имя: ${body.name}\n` : ""}` +
      `📞 Телефон: ${body.phone_number}\n` +
      `📍 Район: ${body.district}\n` +
      `🏠 Адрес: ${body.delivery_address}\n\n` +
      `🛒 Товары:\n${lines.join("\n")}\n\n` +
      `💰 Итого: ${formatUZS(body.totalPrice)} сум\n` +
      (body.totalMonthly
        ? `📆 Итого в месяц: ${formatUZS(body.totalMonthly)} сум/мес\n`
        : "");

    const tgRes = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: "HTML",
        }),
      }
    );

    const tgData = await tgRes.json().catch(() => null);

    if (!tgRes.ok) {
      return NextResponse.json(
        { message: "Telegram error", details: tgData },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json(
      { message: e?.message ?? "Server error" },
      { status: 500 }
    );
  }
}
