import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { yearsOfExperience } from "@/data/profile";
import { getExperienceContent } from "@/lib/content";

export async function generateMetadata() {
  const { careerStart } = await getExperienceContent();
  return {
    title: "Vignesh Vaithiyanathan | AI Lead Product Designer",
    description: `AI Lead Product Designer with ${yearsOfExperience(careerStart)} years of experience across AI, SaaS and enterprise products. View selected work, experience and resume.`,
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
