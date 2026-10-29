import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Imagem de compartilhamento (WhatsApp, Instagram, X…) gerada no build. */
export default async function OpengraphImage() {
  const logo = await readFile(path.join(process.cwd(), "public/brand/logo.jpg"));
  const logoSrc = `data:image/jpeg;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "80px",
          background: "#080808",
          color: "#F2F0EB",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 22, letterSpacing: 8, color: "#B8B8B8", textTransform: "uppercase" }}>
            {`${site.city} — ${site.state}`}
          </div>
          <div style={{ fontSize: 132, fontWeight: 800, letterSpacing: -4, lineHeight: 1, marginTop: 24 }}>B-GOD</div>
          <div style={{ fontSize: 40, letterSpacing: 24, color: "#B8B8B8", marginTop: 8 }}>STORE</div>
          <div style={{ fontSize: 28, marginTop: 48, color: "#F2F0EB", opacity: 0.8 }}>{site.tagline}</div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={360} height={360} alt="" style={{ borderRadius: 4 }} />
      </div>
    ),
    size,
  );
}
