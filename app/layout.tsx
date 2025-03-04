import "./global.css";
import { Inter } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs';
import ClientWrapper from "@/components/client-wrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Connect IO",
  description: "Interact with your thought",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <ClientWrapper>{children}</ClientWrapper>
    </ClerkProvider>
  );
}