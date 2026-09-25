import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "Dayly — Make room for what matters",
  description: "A calm personal planning surface for understanding the day and choosing what matters next.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
