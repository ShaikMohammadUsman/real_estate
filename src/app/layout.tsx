import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "RealtorConnect – Find Top Real Estate Brokers in India",
  description: "Connect with verified real estate brokers across India. Search by location, specialization, and commission rates. India's premier broker discovery platform.",
  keywords: "real estate broker, property agent, buy house, sell property, rent apartment, India",
  openGraph: {
    title: "RealtorConnect",
    description: "India's premier real estate broker discovery platform",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
