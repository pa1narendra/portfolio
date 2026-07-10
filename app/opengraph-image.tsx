import { ImageResponse } from "next/og";
import { site } from "@/lib/content";

export const alt = site.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "90px",
          background: "#0F0E0C",
          color: "#E9E6DF",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 22,
            letterSpacing: 6,
            color: "#8A857A",
            marginBottom: 28,
            textTransform: "uppercase",
          }}
        >
          pavan narendra peela · full-stack engineer
        </div>
        <div
          style={{
            fontSize: 96,
            lineHeight: 1.05,
            fontWeight: 800,
            display: "flex",
            flexDirection: "column",
            textTransform: "uppercase",
          }}
        >
          <span>I build</span>
          <span style={{ color: "#C9A36A", fontStyle: "italic", textTransform: "none", fontFamily: "Georgia, serif", fontWeight: 400 }}>
            real software.
          </span>
        </div>
        <div
          style={{
            marginTop: 48,
            paddingTop: 28,
            borderTop: "1px solid rgba(233,230,223,0.2)",
            fontSize: 24,
            color: "#8A857A",
            display: "flex",
          }}
        >
          mockstar · moneycap · chessing
        </div>
      </div>
    ),
    { ...size },
  );
}
