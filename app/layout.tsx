import "./globals.css";
import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html>
      <body className="bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
        <main className="max-w-4xl mx-auto p-6">{children}</main>
      </body>
    </html>
  );
}
