import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import "./globals.css";

const sans = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600"],
});

const display = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Divya Kashi Yatra — WanderMate | Upcoming departures from NCR",
  description:
    "Log off Friday, reset in Kashi. Divya Kashi Yatra runs most weekends and long vacations year-round from NCR. Upcoming batches confirmed on WhatsApp. Kashi Vishwanath, ghats, Ganga Aarti, Sarnath. From ₹8,999.",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#001533",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable}`}>
      <body
        className="min-h-screen touch-manipulation antialiased [-webkit-tap-highlight-color:transparent]"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
