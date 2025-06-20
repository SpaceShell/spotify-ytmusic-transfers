import { Arimo, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const arimo = Arimo({
  variable: "--font-arimo",
  subsets: ["latin"],
});

export const metadata = {
  title: "MusiTransfer",
  description: "A web app to help transfer songs and playlists between Spotify and YouTube Music"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${arimo.className} ${inter.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
