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
          background: "linear-gradient(135deg, #ece9f4 0%, #f1f0f5 45%, #f3ece4 100%)",
          color: "#191820",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 22,
            letterSpacing: 6,
            color: "#6b6974",
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
          <span>Software that</span>
          <span
            style={{
              color: "#a5763b",
              fontStyle: "italic",
              textTransform: "none",
              fontFamily: "Georgia, serif",
              fontWeight: 400,
            }}
          >
            survives real users.
          </span>
        </div>
        <div
          style={{
            marginTop: 48,
            paddingTop: 28,
            borderTop: "1px solid rgba(25,24,32,0.2)",
            fontSize: 24,
            color: "#6b6974",
            display: "flex",
          }}
        >
          working systems notebook / chessing / mockstar / moneycap
        </div>
      </div>
    ),
    { ...size },
  );
}
