import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import { createContext, useEffect, useMemo, useState } from "react";
import { getProgram, getProvider } from "@utils/program";
import {useCollection, useCollectionData} from "react-firebase-hooks/firestore"
import {
  Asks,
  Balances,
  Bids,
  GlobalContextType,
  OpenOrderItem,
  OpenOrders,
  OrderItem,
} from "./types";
import * as anchor from "@project-serum/anchor";
import * as spl from "@solana/spl-token";
import { priceFromOrderId } from "@utils/program";
import {
  asksPda,
  bidsPda,
  coinMint,
  coinVault,
  eventQPda,
  marketPda,
  pcMint,
  pcVault,
  reqQPda,
} from "@utils/constants";
import { toast } from "react-hot-toast";
import { PublicKey } from "@solana/web3.js";
import { collection } from "@firebase/firestore";
import { db } from "src/db/firebase";
import { saveEventToDb } from "@utils/events";

export const GlobalContext = createContext<GlobalContextType>({
  program: null,
  bids: null,
  asks: null,
  eventQ: null,
  balances: {
    nativeCoinFree: "0",
    nativeCoinTotal: "0",
    nativePcFree: "0",
    nativePcTotal: "0",
  },
  openOrders: null,
  getAsks: () => {
    return;
  },
  getBids: () => {
    return;
  },

  getOpenOrders: () => {
    return;
  },
  createNewBid: () => {
    return;
  },
  createNewAsk: () => {
    return;
  },
  finalizeOrder: () => {}
});

type Props = {
  children: React.ReactNode;
};

// TODO :
// - Get program

export const GlobalStateProvider = ({ children }: Props) => {
  const { connection } = useConnection();
  const anchorWallet = useAnchorWallet();
  const [asks, setAsks] = useState<Asks>([]);
  const [bids, setBids] = useState<Bids>([]);
  const [openOrders, setOpenOrders] = useState<any>([]);
  const [balances, setBalances] = useState<Balances>({} as Balances);
  const [eventQ,eventQLoading,eventQerror] = useCollectionData(
    collection(db,'events')
  )
  const {
    publicKey: connectedPublicKey,
    sendTransaction,
    signTransaction,
  } = useWallet();

  const program = useMemo(() => {
    if (connection && anchorWallet) {
      const provider = getProvider(connection, anchorWallet);
      const program = getProgram(provider);
      return program;
    } else {
      return null;
    }
  }, [connection, anchorWallet]);


  const finalizeOrder = async (owner_slot:number,cpty_event_slot:number,orderId:string,authority_cpty:PublicKey,owner:PublicKey,owner_side:"Ask"|"Bid") => {
    // slot is the index number for the matached order to event queue
    if(!connectedPublicKey || !program || !signTransaction) throw new Error("No connected account found !");


    let openOrdersCounterpartyPda;
    let openOrdersCounterpartyPdaBump ;

    [openOrdersCounterpartyPda,openOrdersCounterpartyPdaBump] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from("open-orders", "utf-8"),
        new anchor.web3.PublicKey(marketPda).toBuffer(),
        owner.toBuffer(),
      ],
      program?.programId
    );

    //@ts-ignore
    const finalizeTx = await program?.methods.finaliseMatches(owner_slot, cpty_event_slot, orderId,authority_cpty,owner,owner_side)
      .accounts({
        reqQ: new anchor.web3.PublicKey(reqQPda),
        asks: new anchor.web3.PublicKey(asksPda),
        bids:new anchor.web3.PublicKey(bidsPda),
        authority:connectedPublicKey,
        coinMint: new anchor.web3.PublicKey(coinMint),
        pcMint: new anchor.web3.PublicKey(pcMint),
        coinVault: new anchor.web3.PublicKey(coinVault),
        pcVault: new anchor.web3.PublicKey(pcVault),
        eventQ:new anchor.web3.PublicKey(eventQPda),
        market: new anchor.web3.PublicKey(marketPda),
        openOrdersCounterparty: openOrdersCounterpartyPda,
        openOrdersOwner:owner,
      })
      .transaction();

    if (!finalizeTx) throw new Error("Something went wrong while building transaction");
    finalizeTx.feePayer = connectedPublicKey;

    const latestBlockhash = await connection.getLatestBlockhash();
    finalizeTx.feePayer = connectedPublicKey;
    finalizeTx.recentBlockhash = latestBlockhash.blockhash;
    const signedTx = await signTransaction(finalizeTx);
    toast.success("Signed Tx");
    const signature = await sendTransaction(signedTx, connection);
    console.log("Tx sent : " + signature);
    await connection.confirmTransaction({
      blockhash:latestBlockhash.blockhash,
      lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
      signature
    })
    toast.success("Order finalized !!")
    try {
    } catch (err) {
      console.log(err);
    }
  };
  const getOpenOrders = async () => {
    try {
      if (!program || !connectedPublicKey) return 
    
      let openOrdersPda;
      let openOrdersPdaBump;
      [openOrdersPda, openOrdersPdaBump] =
        await anchor.web3.PublicKey.findProgramAddress(
          [
            Buffer.from("open-orders", "utf-8"),
            new anchor.web3.PublicKey(marketPda).toBuffer(),
            connectedPublicKey.toBuffer(),
          ],
          program.programId
        );

      const openOrdersResponse = await program.account.openOrders.fetch(
        openOrdersPda
      );

      setBalances({
        nativeCoinFree: openOrdersResponse.nativeCoinFree.toString(),
        nativeCoinTotal: openOrdersResponse.nativeCoinTotal.toString(),
        nativePcFree: openOrdersResponse.nativePcFree.toString(),
        nativePcTotal: openOrdersResponse.nativePcTotal.toString(),
      });

      let ids = openOrdersResponse?.orders.map((item) => {
        return item.toString();
      });

      // remove zero value 
      ids = ids.filter((item) => item !== "0");
      // // match with eventQueue
      // const orders = ids.map((idx) => {
      //   let match:OrderItem | undefined; 
      //   match = bids?.find((b)=>b.orderId === idx)
      //   if(match){

      //     return {...match,type:"Bid",owner:match?.owner.toString(),orderId:match?.orderId}
      //   }
      //   match = asks?.find(a => a.orderId === idx)
      //   if(!match) return
      //   return {...match,type:"Ask",owner:match?.owner.toString(),orderId:match?.orderId}
      // })
      // console.log(orders);
      setOpenOrders(ids)
    } catch (err:any) {
      console.log(err.toString()?.split(" "));
    }
  };

  const getBids = async () => {
    try {
      if (!program) throw new Error("No program found!!");
      // await initializeMarket(program);
      const bidsResponse = await program.account.orders.fetch(
        new anchor.web3.PublicKey(bidsPda)
      );
      setBids(
        bidsResponse?.sorted?.map((item) => {
          return {
            ...item,
            orderId: item.orderId.toString(),
            price: priceFromOrderId(item?.orderId),
            qty: Number(item?.qty.toString()).toFixed(2),
          } as const;
        })
      );

    } catch (err) {
      console.log(err);
    }
  };

  const getAsks = async () => {
    try {
      if (!program) throw new Error("No program found!!");
      // await initializeMarket(program);
      const asksResponse = await program.account.orders.fetch(
        new anchor.web3.PublicKey(asksPda)
      );
      setAsks(
        asksResponse?.sorted?.map((item) => {
          return {
            ...item,
            orderId: item.orderId.toString(),
            price: priceFromOrderId(item?.orderId),
            qty: Number(item?.qty.toString()).toFixed(2),
          } as const;
        })
      );
    } catch (err) {
      console.log(err);
    }
  };

  const createNewAsk = async (
    limitPrice: anchor.BN,
    maxCoinQty: anchor.BN,
    maxNativePcQty: anchor.BN
  ) => {
    try {
      if (!connectedPublicKey || !signTransaction || !sendTransaction)
        throw Error("No connected wallet found!");
      if (!program) throw new Error("No program found!!");
      const authorityCoinTokenAccount = await spl.getAssociatedTokenAddress(
        new anchor.web3.PublicKey(coinMint),
        connectedPublicKey,
        false
      );
      let openOrdersPda;
      let openOrdersPdaBump;

      [openOrdersPda, openOrdersPdaBump] =
        await anchor.web3.PublicKey.findProgramAddress(
          [
            Buffer.from("open-orders", "utf-8"),
            new anchor.web3.PublicKey(marketPda).toBuffer(),
            connectedPublicKey.toBuffer(),
          ],
          program.programId
        );


      const orderTx = await program.methods
        .newOrder({ bid: {} }, limitPrice, maxCoinQty, maxNativePcQty, {
          limit: {},
        })
        .accounts({
          openOrders: openOrdersPda,
          market: new anchor.web3.PublicKey(marketPda),
          coinVault: new anchor.web3.PublicKey(coinVault),
          pcVault: new anchor.web3.PublicKey(pcVault),
          coinMint: new anchor.web3.PublicKey(coinMint),
          pcMint: new anchor.web3.PublicKey(pcMint),
          payer: authorityCoinTokenAccount,
          bids: new anchor.web3.PublicKey(bidsPda),
          asks: new anchor.web3.PublicKey(asksPda),
          reqQ: new anchor.
          web3.PublicKey(reqQPda),
          eventQ: new anchor.web3.PublicKey(eventQPda),
          authority: connectedPublicKey.toString(),
        })
        .transaction();

      if (!orderTx)
        throw new Error("Something went wrong while building transaction");
      orderTx.feePayer = connectedPublicKey;

      const latestBlockhash = await connection.getLatestBlockhash();
      orderTx.feePayer = connectedPublicKey;
      orderTx.recentBlockhash = latestBlockhash.blockhash;
      const signedTx = await signTransaction(orderTx);
      toast.success("Signed Tx");
      const signature = await sendTransaction(signedTx, connection);
      console.log("Tx sent : " + signature);
      await connection.confirmTransaction({
        blockhash:latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
        signature
      })
      await saveEventToDb(signature,connection)
      toast.success("Tx confirmed!")
      getAsks();
      getOpenOrders();
    } catch (err) {
      toast("Insufficient Balance ")
      console.log(err);
    }
  };

  const createNewBid = async (
    limitPrice: anchor.BN,
    maxCoinQty: anchor.BN,
    maxNativePcQty: anchor.BN
  ) => {
    try {
      if (!connectedPublicKey || !signTransaction || !sendTransaction)
        throw Error("No connected wallet found!");
      if (!program) throw new Error("No program found!!");
      const authorityPCTokenAccount = await spl.getAssociatedTokenAddress(
        new anchor.web3.PublicKey(pcMint),
        connectedPublicKey,
        false
      );
      let openOrdersPda;
      [openOrdersPda] = await anchor.web3.PublicKey.findProgramAddress(
        [
          Buffer.from("open-orders", "utf-8"),
          new anchor.web3.PublicKey(marketPda).toBuffer(),
          connectedPublicKey.toBuffer(),
        ],
        program.programId
      );
      const orderTx = await program.methods
        .newOrder({ bid: {} }, limitPrice, maxCoinQty, maxNativePcQty, {
          limit: {},
        })
        .accounts({
          openOrders: openOrdersPda,
          market: new anchor.web3.PublicKey(marketPda),
          coinVault: new anchor.web3.PublicKey(coinVault),
          pcVault: new anchor.web3.PublicKey(pcVault),
          coinMint: new anchor.web3.PublicKey(coinMint),
          pcMint: new anchor.web3.PublicKey(pcMint),
          payer: authorityPCTokenAccount,
          bids: new anchor.web3.PublicKey(bidsPda),
          asks: new anchor.web3.PublicKey(asksPda),
          reqQ: new anchor.web3.PublicKey(reqQPda),
          eventQ: new anchor.web3.PublicKey(eventQPda),
          authority: connectedPublicKey.toString(),
        })
        .transaction();

      if (!orderTx)
        throw new Error("Something went wrong while building transaction");
      orderTx.feePayer = connectedPublicKey;
      const latestBlockhash = await connection.getLatestBlockhash();
      console.log(latestBlockhash);
      orderTx.feePayer = connectedPublicKey;
      orderTx.recentBlockhash = latestBlockhash.blockhash;
      const signedTx = await signTransaction(orderTx);
      toast.success("Signed Tx");
      const signature = await sendTransaction(signedTx, connection);
      console.log("Tx sent : " + signature);
      await connection.confirmTransaction({
        blockhash:latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
        signature
      })
      toast.success("Tx confirmed!")
      getBids();
    } catch (err) {
      toast("Insufficient Balance ")
      console.log(err);
    }
  };

  useEffect(() => {
    if (program) {
      getBids();
      getAsks();
    }
  }, [program]);
  
  useEffect(()=>{
    if(connectedPublicKey && program && eventQ) getOpenOrders();
  },[connectedPublicKey,program,eventQ])



  return (
    <GlobalContext.Provider
      value={{
        program,
        bids,
        asks,
        balances,
        eventQ,
        openOrders,
        getAsks,
        getBids,
        getOpenOrders,
        createNewAsk,
        createNewBid,
        finalizeOrder
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
