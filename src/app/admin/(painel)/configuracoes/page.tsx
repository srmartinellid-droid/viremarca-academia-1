import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { requireOwner } from "@/core/auth/guards";
import { SettingsForm } from "./SettingsForm";

export default async function SettingsPage() {
  await requireOwner();
  const row = (await db.select().from(siteSettings).limit(1))[0];
  if (!row) return <p>Configurações não encontradas.</p>;
  return (
    <section>
      <div className="admin-heading">
        <span>SITE</span>
        <h1>Configurações</h1>
      </div>
      <SettingsForm
        initial={{
          name: row.name,
          slogan: row.slogan ?? "",
          accentColor: row.accentColor,
          whatsapp: row.whatsapp ?? "",
          whatsappMessage: row.whatsappMessage ?? "",
          phone: row.phone ?? "",
          email: row.email ?? "",
          street: row.address?.street ?? "",
          number: row.address?.number ?? "",
          district: row.address?.district ?? "",
          city: row.address?.city ?? "",
          state: row.address?.state ?? "",
          zip: row.address?.zip ?? "",
          mapEmbedUrl: row.mapEmbedUrl ?? "",
          notice: row.notice ?? "",
          noticeExpiresAt: row.noticeExpiresAt
            ? row.noticeExpiresAt.toISOString().slice(0, 10)
            : "",
          instagram: row.social?.instagram ?? "",
          facebook: row.social?.facebook ?? "",
          seoTitle: row.seoTitle ?? "",
          seoDescription: row.seoDescription ?? "",
          seoRegion: row.seoRegion ?? "",
          wellhubEnabled: row.wellhubEnabled,
          totalpassEnabled: row.totalpassEnabled,
          isDemo: row.isDemo,
        }}
      />
    </section>
  );
}
