import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Notre Histoire",
    short_name: "Notre Histoire",
    description: "Un espace privé.",
    start_url: "/",
    display: "standalone",
    background_color: "#fce4e9",
    theme_color: "#fce4e9",
    icons: [{ src: "/apple-icon", sizes: "180x180", type: "image/png" }],
  };
}
