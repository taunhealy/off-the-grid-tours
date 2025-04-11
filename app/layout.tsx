import "./globals.css";
import Providers from "./providers";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-primary" });

export const metadata = {
  title: "My Next.js App",
  description: "Created with Next.js 14",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-primary`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
