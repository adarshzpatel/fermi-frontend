import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import { createContext, useEffect, useMemo, useState } from "react";
import { getProgram, getProvider } from "@utils/program";

import {
  Asks,
  Balances,
  Bids,
  EventQueue,
  GlobalContextType,
  OpenOrderItem,
  OpenOrders,
  OrderItem,
} from "./types";
import * as anchor from "@project-serum/anchor";
import * as spl from "@solana/spl-token";
import { priceFromOrderId, timestampFromOrderId } from "@utils/program";
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
  getEventQ: () => {
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
  finalizeOrder: () => {return}
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
  const [openOrders, setOpenOrders] = useState<OpenOrders>([]);
  const [eventQ, setEventQ] = useState<EventQueue>([]);
  const [balances, setBalances] = useState<Balances>({} as Balances);

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

  const getEventQ = async () => {
    try {
      if (!program) throw new Error("No program found!!");
      // await initializeMarket(program);
      const eventQResponse = await program.account.eventQueue.fetch(
        new anchor.web3.PublicKey(eventQPda)
      );

      setEventQ(
        (eventQResponse?.buf as any[])?.map((item) => {
          const price = Number((BigInt(item?.orderId.toString()) >> BigInt(64)).toString()).toFixed(2);
          return {
            ...item,
            price,
            nativeQtyPaid: item?.nativeQtyPaid.toString(),
            nativeQtyReleased: item?.nativeQtyReleased.toString(),
            orderId: item?.orderId.toString(),
            owner: item?.owner.toString(),
          } as const;
        })
      );
    } catch (err) {
      console.log(err);
    }
  };

  const finalizeOrder = async (slot1: number, slot2: number,owner:PublicKey) => {
    // slot is the index number for the matached order to event queue
    if(!connectedPublicKey || !program || !signTransaction) throw new Error("No connected account found !");
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
        program?.programId
      );

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

    const finalizeTx = await program?.methods
      .finaliseMatches(slot1, slot2, new anchor.BN(0), connectedPublicKey)
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

    try {
    } catch (err) {
      console.log(err);
    }
  };
  const getOpenOrders = async () => {
    try {
      if (!program || !connectedPublicKey || bids?.length === 0 || asks?.length === 0) return
      const authorityPCTokenAccount = await spl.getAssociatedTokenAddress(
        new anchor.web3.PublicKey(pcMint),
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

      const openOrdersResponse = await program.account.openOrders.fetch(
        openOrdersPda
      );

      setBalances({
        nativeCoinFree: openOrdersResponse.nativeCoinFree.toString(),
        nativeCoinTotal: openOrdersResponse.nativeCoinTotal.toString(),
        nativePcFree: openOrdersResponse.nativePcFree.toString(),
        nativePcTotal: openOrdersResponse.nativePcTotal.toString(),
      });

      const eventQResponse = await program.account.eventQueue.fetch(
        new anchor.web3.PublicKey(eventQPda)
      );

      let ids = openOrdersResponse?.orders.map((item) => {
        return item.toString();
      });

      // remove zero value 
      ids = ids.filter((item) => item !== "0");
      // check

      let _orders:OpenOrderItem[] = ids.map((idx)=>{
        let matched:OrderItem | undefined =  bids?.find(item=>item.orderId === idx)
        if(matched){
          return {
            orderId:matched?.orderId,
            price: matched?.price,
            qty: matched?.qty,
            type: "bid"
          } as OpenOrderItem
        }
        // if got from ask
        matched = asks?.find(item=>item.orderId === idx)
        return {
          orderId:matched?.orderId,
          price: matched?.price,
          qty: matched?.qty,
          type: "ask"
        }
      })
      _orders = _orders.filter(item=>item.orderId !== undefined)
      setOpenOrders(_orders)
    } catch (err) {
      console.log(err);
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
    } catch (err) {
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

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (program) {
      getEventQ();
      getBids();
      getAsks();
    }
  }, [program]);
  
  useEffect(()=>{
    getOpenOrders();
  },[bids,asks])

  useEffect(() => {
    // console.log("open orders", openOrders);
  }, [openOrders]);

  useEffect(() => {
    // console.log("eventQ", eventQ);
  }, [eventQ]);

  useEffect(() => {
    // console.log("bids", bids);
  }, [bids]);

  useEffect(() => {
    // console.log("asks", asks);
  }, [asks]);

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
        getEventQ,
        createNewAsk,
        createNewBid,
        finalizeOrder
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
