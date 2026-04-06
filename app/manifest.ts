import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "LeadFlow",
    short_name: "LeadFlow",
    description: "Lead follow-up + kalendarz + przypomnienia",
    start_url: "/today",
    display: "standalone",
    background_color: "#0d0d0d",
    theme_color: "#f59e0b",
    lang: "pl",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  }
}
