import { readdir } from "node:fs/promises";
import path from "node:path";

const PORTRAIT_EXTENSIONS = new Set([
  ".avif",
  ".jpeg",
  ".jpg",
  ".png",
  ".svg",
  ".webp",
]);

export async function GET() {
  const portraitDirectory = path.join(
    process.cwd(),
    "public",
    "images",
    "operator-portraits",
  );
  const entries = await readdir(portraitDirectory, { withFileTypes: true });
  const files = entries
    .filter(
      (entry) =>
        entry.isFile() &&
        PORTRAIT_EXTENSIONS.has(path.extname(entry.name).toLowerCase()),
    )
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right));

  return Response.json(
    { files },
    { headers: { "Cache-Control": "no-store" } },
  );
}
