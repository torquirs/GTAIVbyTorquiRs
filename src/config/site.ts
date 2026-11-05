const configuredUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() ?? "https://example.com";

function parseSiteUrl(value: string): URL {
  try {
    const url = new URL(value);

    if (url.protocol !== "https:" && url.protocol !== "http:") {
      throw new Error("The site URL must use HTTP or HTTPS.");
    }

    if (url.pathname !== "/" || url.search || url.hash) {
      throw new Error("The site URL must be an origin without a path or query.");
    }

    return url;
  } catch (error) {
    throw new Error(
      `Invalid NEXT_PUBLIC_SITE_URL value: "${value}". Provide an absolute HTTP(S) URL.`,
      { cause: error },
    );
  }
}

export const siteConfig = {
  name: "GTA VI Release Countdown",
  title: "Grand Theft Auto VI — Release Countdown",
  description:
    "An independent, fan-made countdown to Grand Theft Auto VI. The wait is almost over.",
  url: parseSiteUrl(configuredUrl),
  locale: "en_US",
  language: "en",
  releaseDate: "2026-11-19T00:00:00Z",
  releaseLabel: "November 19, 2026",
  socialImage: "/images/Jason_and_Lucia_01.jpg",
  keywords: [
    "Grand Theft Auto VI",
    "GTA 6 countdown",
    "GTA VI release date",
    "Vice City",
    "Leonida",
  ],
} as const;
