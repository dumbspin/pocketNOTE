import type { Metadata } from "next";
import { Inter, Fredoka } from "next/font/google"; // Import Google Fonts
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-fredoka",
});

export const metadata: Metadata = {
  title: "PocketNote",
  description: "Your daily retro journal",
};

// import { Providers } from './providers'; // Removed

// ... imports

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${fredoka.variable} antialiased min-h-screen p-4 md:p-8`}
      >
        <div className="w-full max-w-7xl mx-auto h-full min-h-[calc(100dvh-2rem)] md:min-h-[calc(100dvh-4rem)] relative">
          {children}
        </div>
      </body>
    </html>
  );
}
