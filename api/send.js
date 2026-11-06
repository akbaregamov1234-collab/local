export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  const { phone, feedback } = req.body || {};

  if (
    typeof phone !== "string" ||
    typeof feedback !== "string" ||
    !phone.trim() ||
    !feedback.trim() ||
    phone.length > 30 ||
    feedback.length > 2000
  ) {
    return res.status(400).json({
      error: "Ma'lumotlarni tekshiring"
    });
  }

  const TOKEN = 8895281536:AAH1JKyRewXvUhIbi1cg7HItCNeecqkif5E
  const CHAT_ID = 8353829424

  if (!TOKEN || !CHAT_ID) {
    return res.status(500).json({
      error: "Server sozlamalari mavjud emas"
    });
  }

  const text = [
    "📩 Yangi fikr-mulohaza",
    "",
    `📞 Telefon: ${phone.trim()}`,
    `💬 Fikr: ${feedback.trim()}`
  ].join("\n");

  try {
    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text
        })
      }
    );

    const result = await telegramResponse.json();

    if (!telegramResponse.ok || !result.ok) {
      throw new Error("Telegram yuborish xatosi");
    }

    return res.status(200).json({
      success: true
    });

  } catch {
    return res.status(500).json({
      error: "Xabar yuborilmadi"
    });
  }
}