import type { Metadata } from "next";
import "../styles/globals.css";
import { ThemeProvider } from "@/components/dashboard/ThemeProvider";

export const metadata: Metadata = {
  title: "Tribe",
  description: "AI customer service",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider defaultTheme="dark" storageKey="tribe-theme">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}