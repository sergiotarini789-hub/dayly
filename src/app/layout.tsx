import type { Metadata, Viewport } from "next";
import { ProductApplicationFrame, ProductSessionProvider } from "@/components/product";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "Dayly — Make room for what matters",
  description: "A calm personal planning surface for understanding the day and choosing what matters next.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body><ProductSessionProvider><ProductApplicationFrame>{children}</ProductApplicationFrame></ProductSessionProvider></body>
    </html>
  );
}
