const VIREMARCA_WHATSAPP = "5548991410717";
const MESSAGE = "Olá! Vi a demo de academia e quero um site assim.";

/** Gancho comercial: aparece só enquanto site_settings.is_demo = true. */
export function DemoBanner() {
  const href = `https://wa.me/${VIREMARCA_WHATSAPP}?text=${encodeURIComponent(MESSAGE)}`;
  return (
    <div className="demo-banner" role="note">
      <span>Site demonstrativo VireMarca</span>
      <a href={href} target="_blank" rel="noopener noreferrer">
        Quero um site assim →
      </a>
    </div>
  );
}
