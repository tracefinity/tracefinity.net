import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const siteUrl = "https://tracefinity.net";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Tracefinity - AI tool tracing for 3D-printable Gridfinity bins",
    template: "%s - Tracefinity",
  },
  description:
    "Photograph your tools, trace their outlines with AI, and generate 3D-printable Gridfinity bins that fit them perfectly.",
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: siteUrl,
    siteName: "Tracefinity",
    title: "Tracefinity - AI tool tracing for 3D-printable Gridfinity bins",
    description:
      "Photograph your tools, trace their outlines with AI, and generate 3D-printable Gridfinity bins that fit them perfectly.",
  },
  twitter: {
    card: "summary",
    title: "Tracefinity - AI tool tracing for 3D-printable Gridfinity bins",
    description:
      "Photograph your tools, trace their outlines with AI, and generate 3D-printable Gridfinity bins that fit them perfectly.",
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="mx-auto max-w-3xl px-6">
          <Header />
          <div className="pt-14">
            {children}
          </div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
