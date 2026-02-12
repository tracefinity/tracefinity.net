import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Tracefinity",
  description:
    "Photograph your tools, trace their outlines with AI, and generate 3D-printable Gridfinity bins.",
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
