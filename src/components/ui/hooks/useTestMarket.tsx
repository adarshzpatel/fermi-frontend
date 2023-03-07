import React, { useEffect, useState } from "react";
import * as anchor from "@project-serum/anchor";
import {
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import {  priceFromOrderId } from "@utils/program";
import {
  asksPda,
  bidsPda,
  coinMint,
  coinVault,
  eventQPda,
  marketPda,
  openOrdersPda,
  pcMint,
  pcVault,
  reqQPda,
} from "@utils/constants";
import { PublicKey } from "@solana/web3.js";
import { useGlobalState } from "./useGlobalState";

type ParsedOrder = {
  price: string;
  qty: string;
  orderId: anchor.BN;
  owner: PublicKey;
  ownerSlot: number;
};

const useTestMarket = () => {
  const [asks, setAsks] = useState<ParsedOrder[]>([]);
  const [bids, setBids] = useState<ParsedOrder[]>([]);
  const [openOrders, setOpenOrders] = useState<ParsedOrder[]>([]);
  const [eventQ, setEventQ] = useState<ParsedOrder[]>([]);
  const { publicKey: connectedPublicKey, signTransaction,sendTransaction} = useWallet();
  const { program } = useGlobalState();
  const {connection} = useConnection();
  useEffect(() => {
    if (program) getBids();
  }, [program]);

  useEffect(() => {
    if (program) getAsks();
  }, [program]);

  useEffect(() => {
    if (program) getOpenOrders();
  }, [program]);

  useEffect(() => {
    if (program) getEventQ();
  }, [program]);

  const getOpenOrders = async () => {
    try {
      if (!program) throw new Error("No program found!!");
      // await initializeMarket(program);
      const openOrdersResponse = await program.account.orders.fetch(bidsPda);
      console.log({ openOrdersResponse });
      setOpenOrders(
        openOrdersResponse?.sorted?.map((item) => {
          return {
            ...item,
            price: priceFromOrderId(item?.orderId),
            qty: Number(item?.qty.toString()).toFixed(2),
          } as const;
        })
      );
    } catch (err) {
      console.log(err);
    }
  };

  const getEventQ = async () => {
    try {
      if (!program) throw new Error("No program found!!");
      // await initializeMarket(program);
      const eventQResponse = await program.account.orders.fetch(bidsPda);
      setEventQ(
        eventQResponse?.sorted?.map((item) => {
          return {
            ...item,
            price: priceFromOrderId(item?.orderId),
            qty: Number(item?.qty.toString()).toFixed(2),
          } as const;
        })
      );
      console.log({ eventQ });
    } catch (err) {
      console.log(err);
    }
  };

  const getBids = async () => {
    try {
      if (!program) throw new Error("No program found!!");
      // await initializeMarket(program);
      const bidsResponse = await program.account.orders.fetch(bidsPda);
      setBids(
        bidsResponse?.sorted?.map((item) => {
          return {
            ...item,
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
      const asksResponse = await program.account.orders.fetch(asksPda);
      setAsks(
        asksResponse?.sorted?.map((item) => {
          return {
            ...item,
            price: priceFromOrderId(item?.orderId),
            qty: Number(item?.qty.toString()).toFixed(2),
          } as const;
        })
      );
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
      if (!connectedPublicKey || !signTransaction || !sendTransaction) throw Error("No connected wallet found!");

        const orderTx = await program?.methods
        .newOrder({ bid: {} }, limitPrice, maxCoinQty, maxNativePcQty, {
          limit: {},
        })
        .accounts({
          openOrders: openOrdersPda,
          market: marketPda,
          coinVault: coinVault,
          pcVault: pcVault,
          coinMint: coinMint,
          pcMint: pcMint,
          payer: connectedPublicKey?.toString(),
          bids: bidsPda,
          asks: asksPda,
          reqQ: reqQPda,
          eventQ: eventQPda,
          authority: connectedPublicKey,
        })
        .transaction();

      if (!orderTx)
        throw new Error("Something went wrong while building transaction");

      orderTx.feePayer = connectedPublicKey;
      const latestBlockhash = await connection.getLatestBlockhash();
      orderTx.feePayer = connectedPublicKey;
      orderTx.recentBlockhash = latestBlockhash.blockhash;      
      const signedTx = await signTransaction(orderTx)
      const tx = await sendTransaction(signedTx,connection)

      console.log(tx)
    } catch (err) {
      console.log(err);
    }
  };

  return { bids, asks, createNewBid };
};

export default useTestMarket;
