import "./globals.css";
import { DM_Sans, Inter } from "next/font/google";
import { Providers } from "./providers";
import { cn } from "@/lib/utils";

const inter = DM_Sans({ subsets: ["latin"] });

export const metadata = {
  title: "Open-DevLink",
  description:
    "Open-DevLink: A cosmic adventure to explore the universe of open source projects related to space and astronomy. Join us on a journey to discover new worlds, solve galactic mysteries, and make a meaningful impact on the future of space exploration.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={cn("dark", inter.className)}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
