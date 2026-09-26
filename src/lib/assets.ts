import "server-only";
import fs from "node:fs";
import path from "node:path";

/** true se o caminho (/images/...) existe em public/. URLs externas contam como existentes. */
export function assetExists(src?: string | null) {
  if (!src) return false;
  if (/^https?:\/\//.test(src)) return true;
  if (!src.startsWith("/")) return false;
  return fs.existsSync(path.join(process.cwd(), "public", src.replace(/^\/+/, "")));
}
