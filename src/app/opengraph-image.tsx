import { ImageResponse } from "next/og";

export const runtime = "edge";
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
            marginTop: "40px",
            fontSize: "56px",
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            maxWidth: "800px",
          }}
        >
          Photograph tools.
          <br />
          <span style={{ color: "#2475c6" }}>Print storage.</span>
        </div>
        <div
          style={{
            marginTop: "24px",
            fontSize: "24px",
            color: "#94a3b8",
            lineHeight: 1.5,
            maxWidth: "700px",
          }}
        >
          AI-powered tool tracing for 3D-printable Gridfinity bins.
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "60px",
            right: "80px",
            display: "flex",
            gap: "32px",
            fontSize: "18px",
            color: "#64748b",
          }}
        >
          <span>tracefinity.net</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
