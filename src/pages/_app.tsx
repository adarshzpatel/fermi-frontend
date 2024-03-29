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
import { Toaster } from "react-hot-toast";
import { GlobalStateProvider } from "@components/contexts/global";
import firebase_app from "src/db/firebase";

const RPC_ENDPOINT =
  "https://solana-devnet.g.alchemy.com/v2/3Ryr3JTOoA9OXvc_5lpw5gn2YOZ-ukJG";
// const RPC_ENDPOINT = "http://localhost:8899"

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
        <WalletProvider wallets={wallets}  >
          <WalletModalProvider>
            {mounted && (
              <GlobalStateProvider>
                <AppContainer>
                  <Toaster position="bottom-left" />
                  <Component {...pageProps} />
                </AppContainer>
              </GlobalStateProvider>
            )}
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </>
  );
}
