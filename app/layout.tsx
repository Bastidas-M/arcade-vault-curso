import type { Metadata } from "next";
import { Suspense } from "react";
import { Press_Start_2P, JetBrains_Mono } from "next/font/google";
import { UserProvider } from "@/context/UserContext";
import Nav from "@/components/Nav";
import "./globals.css";

const pressStart2P = Press_Start_2P({
  variable: "--font-press-start-2p",
  weight: "400",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Arcade Vault",
  description: "Play games and compete for the highest score",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${pressStart2P.variable} ${jetbrainsMono.variable}`}>
      <body>
        <UserProvider>
          <div className="av-bg" />
          <div className="av-noise" />
          <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Suspense fallback={null}><Nav /></Suspense>
            <main className="av-main">{children}</main>
            <footer style={{
              borderTop: '1px solid var(--line)',
              padding: '20px 32px',
              textAlign: 'center',
              color: 'var(--ink-faint)',
              fontFamily: 'var(--mono)',
              fontSize: 11,
              letterSpacing: '0.16em',
            }}>
              © 2026 ARCADE VAULT · HECHO CON PIXELES Y NEÓN · v2.6.0
            </footer>
          </div>
        </UserProvider>
      </body>
    </html>
  );
}
