import { createContext, useCallback, useEffect, useState } from "react";
import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  Transaction,
} from "@solana/web3.js";
import * as spl from "@solana/spl-token";
import {
  AnchorWallet,
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import {
  airDropSol,
  createAssociatedTokenAccount,
  createMint,
  getAsksPda,
  getBidsPda,
  getEventQPda,
  getMarketPda,
  getOpenOrdersPda,
  getProgram,
  getProgramId,
  getProvider,
  getReqQPda,
  mintTo,
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
  isInitialized:boolean
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
  isInitialized:false
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
  const [authorityPcTokenAccount, setAuthorityPcTokenAccount] =
    useState<PublicKey | null>(null);
  const [authorityCoinTokenAccount, setAuthorityCoinTokenAccount] =
    useState<PublicKey | null>(null);
  const [isInitialized, setInitialized] = useState(false);

  const { connection } = useConnection();
  const anchorWallet = useAnchorWallet();
  // get public key from wallet adatpter
  const { publicKey, signTransaction, sendTransaction } = useWallet();
  // set program
  
  // Check wallet connection
  useEffect(() => {
    setIsConnected(!!anchorWallet?.publicKey);
  }, [anchorWallet]);

  useEffect(() => {
    (async () => {
      try {
        // if (!isConnected || !program) throw new Error("Wallet not connected");
        // // get pdas and vaults
        // if (!program || !coinMint || !pcMint || !anchorWallet)
        // throw new Error("Insufficient Data to get pdas.");

        // const provider = getProvider(connection, anchorWallet);
        // const marketPda = getMarketPda(coinMint, pcMint, program);
        // const bidsPda = getBidsPda(marketPda, program);
        // const asksPda = getAsksPda(marketPda, program);
        // const eventQPda = getEventQPda(marketPda, program);
        // const reqQPda = getReqQPda(marketPda, program);
        // const openOrdersPda = getOpenOrdersPda(
        //   marketPda,
        //   anchorWallet,
        //   program
        // );
        // await createMint(provider, coinMint, 9);
        // await createMint(provider, pcMint, 6);
        // // set pdas
        // setPdas({
        //   marketPda,
        //   asksPda,
        //   bidsPda,
        //   eventQPda,
        //   openOrdersPda,
        //   reqQPda,
        // });
        // console.log("Got pdas ");

        // const _coinVault = await spl.getAssociatedTokenAddress(
        //   coinMint.publicKey,
        //   marketPda,
        //   true
        // );

        // const _pcVault = await spl.getAssociatedTokenAddress(
        //   pcMint.publicKey,
        //   marketPda,
        //   true
        // );

        // console.log("got vaults",_coinVault,_pcVault);
        // // Set vaults
        // setCoinVault(_coinVault);
        // setPcVault(_pcVault);
        
        
        // const _authority = anchor.web3.Keypair.generate();
        // await airDropSol(_authority?.publicKey)
        // const _authorityCoinTokenAccount = await spl.getAssociatedTokenAddress(
        //   coinMint.publicKey,
        //   _authority?.publicKey,
        //   false
        // );

        // const _authorityPcTokenAccount = await spl.getAssociatedTokenAddress(
        //   pcMint?.publicKey,
        //   _authority?.publicKey,
        //   false
        // );
        // await createAssociatedTokenAccount(
        //   provider,
        //   coinMint.publicKey,
        //   _authorityCoinTokenAccount,
        //   _authority.publicKey
        // );
        // await createAssociatedTokenAccount(
        //   provider,
        //   pcMint.publicKey,
        //   _authorityPcTokenAccount,
        //   _authority.publicKey
        // );

        // await mintTo(
        //   provider,
        //   coinMint.publicKey,
        //   _authorityCoinTokenAccount,
        //   BigInt("10000000000")
        // );
        // await mintTo(
        //   provider,
        //   pcMint.publicKey,
        //   _authorityPcTokenAccount,
        //   BigInt("1000000000")
        // );

        // console.log("got authority accounts");
        // setAuthorityCoinTokenAccount(_authorityCoinTokenAccount);
        // setAuthorityPcTokenAccount(_authorityPcTokenAccount);
        
        // if (!_coinVault || !_pcVault) throw new Error("Vaults not found") 
        // // initialize market

        // const initTx = await program?.methods
        //   ?.initializeMarket(
        //     new anchor.BN("1000000000"),
        //     new anchor.BN("1000000")
        //   )
        //   .accounts({
        //     market: marketPda,
        //     coinVault:_coinVault,
        //     pcVault:_pcVault,
        //     coinMint: coinMint.publicKey,
        //     pcMint: pcMint.publicKey,
        //     bids: bidsPda,
        //     asks: asksPda,
        //     reqQ: reqQPda,
        //     eventQ: eventQPda,
        //     authority: _authority?.publicKey,
        //   })
        //   .signers([_authority])
        //   .rpc();
    
        // console.log(initTx);
        // setInitialized(true)
        // console.log("Market initialized successfully !");
      } catch (err) {
        console.log("Err", err);
      }
    })();
  }, [isConnected, program]);

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
        isInitialized,
        program,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
