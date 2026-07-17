import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import TanstackProvider from "../components/client/providers/TanstackProvider";
import ToastContainerProvider from "./providers/ToastContainer";
import Footer from "../components/server/Footer";
import NotificationLayout from "../components/client/NotificationLayout";
import AuthContextProvider from "../context/AuthContext";

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
        <AuthContextProvider>
          <TanstackProvider>
            <ToastContainerProvider>
              <NotificationLayout />
              {children}
              <Footer />
            </ToastContainerProvider>
          </TanstackProvider>
        </AuthContextProvider>
      </body>
    </html>
  );
}
