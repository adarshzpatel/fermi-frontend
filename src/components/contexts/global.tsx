import { createContext, useCallback, useEffect, useState } from "react";
import { Keypair, LAMPORTS_PER_SOL, PublicKey, Transaction } from "@solana/web3.js";
import * as spl from "@solana/spl-token";
import {
  AnchorWallet,
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import {
  getAsksPda,
  getBidsPda,
  getEventQPda,
  getMarketPda,
  getOpenOrdersPda,
  getProgram,
  getProgramId,
  getProvider,
  getReqQPda,
} from "src/utils/program";
import toast from "react-hot-toast";
import * as anchor from "@project-serum/anchor";
import { SimpleSerum } from "src/idl/simple_serum";

type PdasType = {
  marketPda: PublicKey | null;
  bidsPda: PublicKey | null;
  asksPda: PublicKey | null;
  reqQPda: PublicKey | null;
  eventQPda: PublicKey | null;
  openOrdersPda: PublicKey | null;
};

type GlobalContextType = {
  isConnected: boolean;
  pdas: PdasType;
  program: anchor.Program<SimpleSerum> | null;
  coinMint: Keypair | null;
  pcMint: Keypair | null;
  coinVault: PublicKey | null;
  pcVault: PublicKey | null;
  authorityCoinTokenAccount: PublicKey | null;
  authorityPcTokenAccount: PublicKey | null;
};

export const GlobalContext = createContext<GlobalContextType>({
  isConnected: false,
  pdas: {
    marketPda: null,
    bidsPda: null,
    asksPda: null,
    reqQPda: null,
    eventQPda: null,
    openOrdersPda: null,
  },
  program: null,
  coinMint: null,
  pcMint: null,
  coinVault: null,
  pcVault: null,
  authorityCoinTokenAccount: null,
  authorityPcTokenAccount: null,
});

type Props = {
  children: React.ReactNode;
};

export const GlobalStateProvider = ({ children }: Props) => {
  const [program, setProgram] = useState<anchor.Program<SimpleSerum> | null>(
    null
  );
  const [isConnected, setIsConnected] = useState(false);
  const [pdas, setPdas] = useState<PdasType>({
    asksPda: null,
    bidsPda: null,
    eventQPda: null,
    marketPda: null,
    openOrdersPda: null,
    reqQPda: null,
  });
  const [coinMint, setCoinMint] = useState<Keypair | null>(
    anchor.web3.Keypair.generate()
  );
  const [pcMint, setPcMint] = useState<Keypair | null>(
    anchor.web3.Keypair.generate()
  );

  const [coinVault, setCoinVault] = useState<PublicKey | null>(null);
  const [pcVault, setPcVault] = useState<PublicKey | null>(null);
  const [authorityPcTokenAccount, setAuthorityPcTokenAccount] = useState<PublicKey|null>(null);
  const [authorityCoinTokenAccount, setAuthorityCoinTokenAccount] =
    useState<PublicKey|null>(null);

  const { connection } = useConnection();
  const anchorWallet = useAnchorWallet();
  // get public key from wallet adatpter
  const {publicKey,signTransaction,sendTransaction} = useWallet()
  // set program
  useEffect(() => {
    if (connection && anchorWallet) {
      setProgram(getProgram(getProvider(connection, anchorWallet)));
    } else {
      setProgram(null);
    }
  }, [connection,anchorWallet ]);

  // Check wallet connection
  useEffect(() => {
    setIsConnected(!!anchorWallet?.publicKey);
  }, [anchorWallet]);

  // get pdas
  useEffect(() => {
    const getPdas = async () => {
      if (!program || !coinMint || !pcMint || !anchorWallet) return;
      try {
        // get pdas
        const marketPda = getMarketPda(coinMint, pcMint, program);
        const bidsPda = getBidsPda(marketPda, program);
        const asksPda = getAsksPda(marketPda, program);
        const eventQPda = getEventQPda(marketPda, program);
        const reqQPda = getReqQPda(marketPda, program);
        const openOrdersPda = getOpenOrdersPda(marketPda, anchorWallet, program);

        // set pdas
        setPdas({
          marketPda,
          asksPda,
          bidsPda,
          eventQPda,
          openOrdersPda,
          reqQPda,
        });
        
        // get vault addresses
        const _coinVault = await spl.getAssociatedTokenAddress(
          coinMint.publicKey,
          marketPda,
          true
        );

        const _pcVault = await spl.getAssociatedTokenAddress(
          pcMint.publicKey,
          marketPda,
          true
        );
          
        // Set vaults
        setCoinVault(_coinVault);
        setPcVault(_pcVault);
        
        // get aurhority token accounts 
        const _authorityCoinTokenAccount = await spl.getAssociatedTokenAddress(coinMint?.publicKey,anchorWallet?.publicKey,false)
        const _authorityPcTokenAccount = await spl.getAssociatedTokenAddress(pcMint?.publicKey,anchorWallet?.publicKey,false)
        setAuthorityCoinTokenAccount(_authorityCoinTokenAccount)
        setAuthorityPcTokenAccount(_authorityPcTokenAccount)
        if(!coinVault || !pcVault || !publicKey) return 
        
        console.log(coinVault,pcVault,pdas,authorityCoinTokenAccount,authorityPcTokenAccount)
        // initialize market

        
        //   await program?.methods?.initializeMarket(new anchor.BN('1000000000'), new anchor.BN('1000000')).accounts({
        //     market:marketPda,
        //     coinVault,
        //     pcVault,
        //   coinMint:coinMint.publicKey,
        //   pcMint:pcMint.publicKey,
        //   bids:bidsPda,
        //   asks:asksPda,
        //   reqQ:reqQPda,
        //   eventQ:eventQPda,
        //   authority:publicKey
        // }).signers([publicKey]).rpc()

        
      } catch (err) {
        console.log(err);
      } finally {

      }
    }
    if (program) {
      getPdas();
    }
  }, [program,publicKey]);


  return (
    <GlobalContext.Provider
      value={{
        pdas,
        authorityCoinTokenAccount,
        authorityPcTokenAccount,
        coinMint,
        coinVault,
        isConnected,
        pcMint,
        pcVault,

        program,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
