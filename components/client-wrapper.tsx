"use client";

import { useUser } from '@clerk/nextjs';
import Layout from "@/components/layout";
import { TopicProvider } from "@/contexts/topic-context";
import { ThoughtProvider } from "@/contexts/thought-context";
import { ChainProvider } from "@/contexts/chain-context";

const ClientWrapper = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn, user } = useUser();

  return isSignedIn ? (
    <html lang="en">
      <body>
        <ChainProvider>
          <TopicProvider>
            <ThoughtProvider>
              <Layout user={user}>{children}</Layout>
            </ThoughtProvider>
          </TopicProvider>
        </ChainProvider>
      </body>
    </html>
  ) : (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
};

export default ClientWrapper;