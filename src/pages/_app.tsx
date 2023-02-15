import React, { use, useEffect, useMemo } from "react";
import AppContainer from "@components/layout/AppLayout";
import type { AppProps } from "next/app";
import "@solana/wallet-adapter-react-ui/styles.css";
import "../styles/globals.css";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";

const RPC_ENDPOINT = "https://solana-devnet.g.alchemy.com/v2/3Ryr3JTOoA9OXvc_5lpw5gn2YOZ-ukJG";

export default function App({ Component, pageProps }: AppProps) {
  const [mounted, setMounted] = React.useState<boolean>(false);
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <ConnectionProvider
        endpoint={RPC_ENDPOINT}
        config={{ commitment: "confirmed" }}
      >
        <WalletProvider wallets={wallets}>
          <WalletModalProvider>
            {mounted && (
              <AppContainer>
                <Component {...pageProps} />
              </AppContainer>
            )}
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </>
  );
}
