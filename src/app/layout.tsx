import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import TanstackProvider from "../components/client/providers/TanstackProvider";
import ToastContainerProvider from "./providers/ToastContainer";
import Footer from "../components/server/Footer";
import SessionProviderWrapper from "./providers/SessionProvider";
import ReduxProvider from "./providers/ReduxProvider";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import NotificationLayout from "../components/client/NotificationLayout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Aissa",
  description: "smart shopping organic ecommerce site",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.className} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <SessionProviderWrapper>
          <TanstackProvider>
            <ReduxProvider>
              <ToastContainerProvider>
                <NotificationLayout />
                {children}
                <Analytics />
                <SpeedInsights />
                <Footer />
              </ToastContainerProvider>
            </ReduxProvider>
          </TanstackProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
