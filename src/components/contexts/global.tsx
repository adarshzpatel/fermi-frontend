import { createContext, useCallback, useEffect, useState } from "react";
import { Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import {
  AnchorWallet,
  useAnchorWallet,
  useConnection,
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
  wallet: AnchorWallet | undefined;
  pdas: PdasType;
  program: anchor.Program<SimpleSerum> | null;
  coinMint: Keypair | null;
  pcMint: Keypair | null;
  coinVault: PublicKey | null;
  pcVault: PublicKey | null;
  authority: Keypair | null;
  authorityCoinTokenAccount: PublicKey | null;
  authorityPcTokenAccount: PublicKey | null;
};

export const GlobalContext = createContext<GlobalContextType>({
  isConnected: false,
  wallet: undefined,
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
  authority: null,
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
  const [authority, setAuthority] = useState<Keypair | null>(
    anchor.web3.Keypair.generate()
  );
  const [coinVault, setCoinVault] = useState<PublicKey | null>(null);
  const [pcVault, setPcVault] = useState<PublicKey | null>(null);
  const [authorityCoinTokenAccount, setAuthorityCoinTokenAccount] =
    useState(null);
  const [authorityPcTokenAccount, setAuthorityPcTokenAccount] = useState(null);

  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  // set program
  useEffect(() => {
    if (connection && wallet) {
      setProgram(getProgram(getProvider(connection,wallet)));
    } else {
      setProgram(null);
    }
  }, [connection, wallet]);

  // Check wallet connection
  useEffect(() => {
    setIsConnected(!!wallet?.publicKey);
  }, [wallet]);

  // get pdas
  useEffect(() => {
    const getPdas = () => {
      if (!program || !coinMint || !pcMint || !authority) return;
      try {
        const marketPda = getMarketPda(coinMint, pcMint, program);
        const bidsPda = getBidsPda(marketPda, program);
        const asksPda = getAsksPda(marketPda, program);
        const eventQPda = getEventQPda(marketPda, program);
        const reqQPda = getReqQPda(marketPda, program);
        const openOrdersPda = getOpenOrdersPda(marketPda, authority, program);

        setPdas({
          marketPda,
          asksPda,
          bidsPda,
          eventQPda,
          openOrdersPda,
          reqQPda,
        });

       
      } catch (err) {
        console.log(err);
      } finally {
      }
    };
    if (!pdas?.marketPda && program) {
      getPdas();
    }
  }, [pdas, program, authority, coinMint, pcMint]);


  // const setupVaults = () => {

  // }
  // // setup vaults 
  // useEffect(()=>{
  //   coinVault = await spl.getAssociatedTokenAddress(
  //     coinMint.publicKey,
  //     marketPda,
  //     true,
  //   );
  //   pcVault = await spl.getAssociatedTokenAddress(
  //     pcMint.publicKey,
  //     marketPda,
  //     true,
  //   ); 
  // })
  // initialize market


  // TODO : get coin vault and pc vault
  const initializeMarket = async () => {
    if (!wallet) return;

    try {
      const provider = getProvider(connection, wallet);
      const program = getProgram(provider);
      const { marketPda, bidsPda, asksPda, reqQPda, eventQPda } = pdas;
      if (
        !marketPda ||
        !coinMint ||
        !coinVault ||
        !pcVault ||
        !pcMint ||
        !bidsPda ||
        !asksPda ||
        !reqQPda ||
        !eventQPda || !authority
      )
       throw new Error("Insufficient data")

      await program.methods
        .initializeMarket(new anchor.BN("1000000000"), new anchor.BN("1000000"))
        .accounts({
          market: marketPda,
          coinVault,
          pcVault,
          coinMint: coinMint?.publicKey,
          pcMint: pcMint?.publicKey,
          bids: bidsPda,
          asks: asksPda,
          reqQ: reqQPda,
          eventQ: eventQPda,
          authority: authority?.publicKey,
        })
        .signers([authority])
        .rpc();

        const market = await program.account.market.fetch(marketPda);
        console.log(market)
    } catch (err) {
      console.log(err);
    }
  };




  

  return (
    <GlobalContext.Provider
      value={{
        pdas,
        authority,
        authorityCoinTokenAccount,
        authorityPcTokenAccount,
        coinMint,
        coinVault,
        isConnected,
        pcMint,
        pcVault,
        wallet,
        program,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
