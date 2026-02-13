import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Tracefinity - AI tool tracing for 3D-printable Gridfinity bins";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#0a0f1a",
          color: "#f1f5f9",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "10px",
              background: "#2475c6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              fontWeight: 700,
              color: "white",
            }}
          >
            T
          </div>
          <span style={{ fontSize: "28px", fontWeight: 600, letterSpacing: "-0.02em" }}>
            Tracefinity
          </span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "40px",
            maxWidth: "800px",
          }}
        >
          <span style={{ fontSize: "56px", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.03em" }}>
            Photograph tools.
          </span>
          <span style={{ fontSize: "56px", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.03em", color: "#2475c6" }}>
            Print storage.
          </span>
        </div>
        <div style={{ display: "flex", marginTop: "24px" }}>
          <span style={{ fontSize: "24px", color: "#94a3b8", lineHeight: 1.5 }}>
            AI-powered tool tracing for 3D-printable Gridfinity bins.
          </span>
        </div>
        <div
          style={{
            display: "flex",
            position: "absolute",
            bottom: "60px",
            right: "80px",
            fontSize: "18px",
            color: "#64748b",
          }}
        >
          tracefinity.net
        </div>
      </div>
    ),
    { ...size },
  );
}
