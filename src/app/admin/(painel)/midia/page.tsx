import { desc } from "drizzle-orm";

import { MediaLibrary } from "@/components/admin/MediaLibrary";
import { requireStaff } from "@/core/auth/guards";
import { db } from "@/db";
import { galleryItems, heroSlides, instructors, media, modalities, posts, siteSettings } from "@/db/schema";

export default async function MediaPage() {
  await requireStaff();
  const [items, hero, modalityRows, instructorRows, gallery, postRows, settings] = await Promise.all([
    db.select().from(media).orderBy(desc(media.createdAt)),
    db.select({ desktop: heroSlides.imageDesktopUrl, mobile: heroSlides.imageMobileUrl, title: heroSlides.title }).from(heroSlides),
    db.select({ url: modalities.imageUrl, name: modalities.name }).from(modalities),
    db.select({ url: instructors.photoUrl, name: instructors.name }).from(instructors),
    db.select({ url: galleryItems.imageUrl, area: galleryItems.area }).from(galleryItems),
    db.select({ url: posts.coverUrl, title: posts.title }).from(posts),
    db.select({ light: siteSettings.logoLightUrl, dark: siteSettings.logoDarkUrl, monogram: siteSettings.monogramUrl }).from(siteSettings).limit(1),
  ]);
  const usage = new Map<string, string[]>();
  const add = (url: string | null, label: string) => {
    if (!url) return;
    usage.set(url, [...(usage.get(url) || []), label]);
  };
  hero.forEach((row) => {
    add(row.desktop, "Hero: " + row.title);
    add(row.mobile, "Hero mobile: " + row.title);
  });
  modalityRows.forEach((row) => add(row.url, "Modalidade: " + row.name));
  instructorRows.forEach((row) => add(row.url, "Equipe: " + row.name));
  gallery.forEach((row) => add(row.url, "Galeria: " + row.area));
  postRows.forEach((row) => add(row.url, "Publicação: " + row.title));
  add(settings[0]?.light || null, "Logo claro");
  add(settings[0]?.dark || null, "Logo escuro");
  add(settings[0]?.monogram || null, "Monograma");
  return (
    <section>
      <div className="admin-heading"><div><span>CONTEÚDO</span><h1>Mídia</h1>
        <p className="admin-page-hint">Centraliza os arquivos de mídia usados pelo conteúdo do site e mostra onde cada imagem está aplicada.</p></div></div>
      <MediaLibrary items={items.map((item) => ({ ...item, usedIn: usage.get(item.url) || [] }))} />
    </section>
  );
}
