import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Fleet Payload Dashboard",
  description: "Minimalistic logistics dashboard for tracking truck payload assignments."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
