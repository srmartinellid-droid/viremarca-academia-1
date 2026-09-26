type WhatsAppFloatProps = {
  whatsapp?: string | null;
  whatsappMessage?: string | null;
};

export function WhatsAppFloat({ whatsapp, whatsappMessage }: WhatsAppFloatProps) {
  const phone = (whatsapp ?? "").replace(/\D/g, "");
  const href = phone
    ? `https://wa.me/${phone}${
        whatsappMessage ? `?text=${encodeURIComponent(whatsappMessage)}` : ""
      }`
    : "/aula-experimental";

  return (
    <a className="whatsapp-float" href={href} aria-label="Falar no WhatsApp">
      WhatsApp
    </a>
  );
}
