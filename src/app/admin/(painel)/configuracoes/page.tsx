import { getImageChoices } from "@/lib/media/public-images";
import { requireOwner } from "@/core/auth/guards";
import { db } from "@/db";
import { openingExceptions, siteSettings, type OpeningHours } from "@/db/schema";
import { SettingsForm } from "./SettingsForm";

export default async function SettingsPage() {
  await requireOwner();
  const [rows, exceptions, choices] = await Promise.all([
    db.select().from(siteSettings).limit(1),
    db.select().from(openingExceptions),
    getImageChoices(),
  ]);
  const settings = rows[0];
  if (!settings) return <p>Configurações não encontradas.</p>;

  return (
    <section>
      <div className="admin-heading"><div><span>SITE</span><h1>Configurações</h1>
        <p className="admin-page-hint">Controla identidade, contato, endereço, funcionamento, redes e opções gerais do site.</p></div></div>
      <SettingsForm choices={choices} initial={{
        name: settings.name,
        slogan: settings.slogan || "",
        accentColor: settings.accentColor,
        whatsapp: settings.whatsapp || "",
        whatsappMessage: settings.whatsappMessage || "",
        phone: settings.phone || "",
        email: settings.email || "",
        street: settings.address?.street || "",
        number: settings.address?.number || "",
        district: settings.address?.district || "",
        city: settings.address?.city || "",
        state: settings.address?.state || "",
        zip: settings.address?.zip || "",
        mapEmbedUrl: settings.mapEmbedUrl || "",
        logoLightUrl: settings.logoLightUrl || "",
        logoDarkUrl: settings.logoDarkUrl || "",
        monogramUrl: settings.monogramUrl || "",
        instagram: settings.social?.instagram || "",
        facebook: settings.social?.facebook || "",
        seoTitle: settings.seoTitle || "",
        seoDescription: settings.seoDescription || "",
        seoRegion: settings.seoRegion || "",
        wellhubEnabled: settings.wellhubEnabled,
        totalpassEnabled: settings.totalpassEnabled,
        isDemo: settings.isDemo,
        openingHours: settings.openingHours || ({} as OpeningHours),
        openingExceptions: exceptions.map((item) => ({ date: item.date, label: item.label, closed: item.closed, open: item.open?.slice(0, 5) || "", close: item.close?.slice(0, 5) || "" })),
      }} />
    </section>
  );
}
