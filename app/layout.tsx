import { absoluteUrl } from "@/lib/site/config";
import type { Metadata } from "next";
import "./globals.css";
import "@/components/design/design-fonts.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Atma, Inter, Roboto } from "next/font/google";
import Header from "@/components/common/header";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { ClientProviders } from "./ClientProviders";
import { Toaster } from "sonner";
import { ReactLenis } from "@/utils/lenis";
import Footer from "@/components/common/footer";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});
const atma = Atma({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-atma",
});

const landingFont = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-landing",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(absoluteUrl()),
  title: "Figart — Browser UI design & vector editor",
  description:
    "A browser-based design workspace for interfaces, vector artwork, and your next big idea. Create with an open canvas, familiar tools, and editable design files.",
  keywords: [
    "Figart",
    "browser design tool",
    "UI design",
    "vector editor",
    "design workspace",
  ],
  authors: [{ name: "Figart Team", url: absoluteUrl() }],
  robots: "index, follow",
  icons: { icon: "/icon.svg", shortcut: "/icon.svg" },
  openGraph: {
    title: "Figart — Browser UI design & vector editor",
    description:
      "Design interfaces, explore ideas, and create something your own. Right in your browser.",
    type: "website",
    url: absoluteUrl(),
    siteName: "Figart",
    images: [
      {
        url: absoluteUrl("/figart-og.png"),
        width: 1200,
        height: 630,
        alt: "Figart — Browser UI design and vector editor",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [absoluteUrl("/figart-og.png")],
    title: "Figart — Browser UI design & vector editor",
    description:
      "An open canvas with familiar tools, built to keep you in flow.",
  },
  alternates: { canonical: absoluteUrl() },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="overflow-x-hidden">
      <ReactLenis root>
        <body
          className={`${inter.className} ${atma.variable} ${landingFont.variable} antialiased `}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ClientProviders>
              <ConvexClientProvider>
                <Header />
                {children}
                <Footer />
                <Toaster />
              </ConvexClientProvider>
            </ClientProviders>
          </ThemeProvider>
        </body>
      </ReactLenis>
    </html>
  );
}
