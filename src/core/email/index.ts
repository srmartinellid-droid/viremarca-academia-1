/** Envio de e-mail. Driver "console" em dev; driver real (Resend) é pendência de produção. */
export type EmailMessage = { to: string; subject: string; text: string; html?: string };

export async function sendEmail(msg: EmailMessage) {
  const driver = process.env.EMAIL_DRIVER ?? "console";
  if (driver === "console") {
    console.info(`[email:console] para=${msg.to} assunto="${msg.subject}"\n${msg.text}`);
    return;
  }
  if (driver === "resend") {
    const key = process.env.RESEND_API_KEY;
    const from = process.env.EMAIL_FROM;
    if (!key || !from) throw new Error("RESEND_API_KEY/EMAIL_FROM ausentes");
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: msg.to,
        subject: msg.subject,
        text: msg.text,
        html: msg.html,
      }),
    });
    if (!res.ok) throw new Error(`Resend falhou: ${res.status}`);
    return;
  }
  throw new Error(`EMAIL_DRIVER desconhecido: ${driver}`);
}
