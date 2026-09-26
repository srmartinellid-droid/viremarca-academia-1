import { DemoBanner } from "@/components/DemoBanner";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { getPublicData } from "@/lib/queries/public";

export default async function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { settings } = await getPublicData();
  const name = settings?.name || "Academia Demo";

  return (
    <>
      {settings?.isDemo !== false ? <DemoBanner /> : null}
      <Header
        name={name}
        whatsapp={settings?.whatsapp}
        whatsappMessage={settings?.whatsappMessage}
      />
      {children}
      <Footer name={name} phone={settings?.phone} email={settings?.email} />
      <WhatsAppFloat whatsapp={settings?.whatsapp} whatsappMessage={settings?.whatsappMessage} />
    </>
  );
}
