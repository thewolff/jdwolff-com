import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const title = searchParams.get("title") ?? "Jo Wolff — Frontend Engineer";
  const eyebrow = searchParams.get("eyebrow") ?? "";

  return new ImageResponse(
    <div
      style={{
        background: "#0f0e0d",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        padding: "64px",
        fontFamily: "serif",
        border: "1px solid #2a2520",
      }}
    >
      {eyebrow && (
        <p
          style={{
            fontSize: 24,
            color: "#9e9890",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: 16,
            fontFamily: "monospace",
          }}
        >
          {eyebrow}
        </p>
      )}
      <h1
        style={{
          fontSize: title.length > 50 ? 48 : 64,
          color: "#e8e4de",
          lineHeight: 1.1,
          margin: "0 0 48px",
          maxWidth: 900,
        }}
      >
        {title}
      </h1>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: "1px solid #2a2520",
          paddingTop: 32,
        }}
      >
        <span style={{ color: "#e8e4de", fontSize: 28, fontWeight: 700 }}>
          Jo Wolff
        </span>
        <span
          style={{
            color: "#9b7fc4",
            fontSize: 20,
            fontFamily: "monospace",
            letterSpacing: "0.06em",
          }}
        >
          jdwolff.com
        </span>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    },
  );
}
