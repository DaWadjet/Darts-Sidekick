import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { cn } from "@/lib/utils";
import GameProvider from "@/store/GameProvider";
import JotaiStoreProvider from "@/store/JotaiStoreProvider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const dynamic = "auto";

export const metadata: Metadata = {
  title: "Darts Sidekick",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <JotaiStoreProvider>
        <GameProvider>
          <body className={cn(inter.className, "antialiased")}>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster />
            </ThemeProvider>
          </body>
        </GameProvider>
      </JotaiStoreProvider>
    </html>
  );
}
