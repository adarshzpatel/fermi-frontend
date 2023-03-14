import { Address } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";

type GlobalContextType = {
  program: Program<SimpleSerum> | null;
  bids: Bids;
  asks: Asks;
  openOrders: string[] | null;
  eventQ: any;
  balances: Balances;
  getOpenOrders: () => void;
  getBids: () => void;
  getAsks: () => void;
  createNewAsk: (
    limitPrice: anchor.BN,
    maxCoinQty: anchor.BN,
    maxNativePcQty: anchor.BN
  ) => void;
  createNewBid: (
    limitPrice: anchor.BN,
    maxCoinQty: anchor.BN,
    maxNativePcQty: anchor.BN
  ) => void;
  finalizeOrder: ( 
    owner_slot:number,
    cpty_event_slot:number,
    orderId:string,
    authority_cpty:PublicKey,
    owner:PublicKey,
    owner_side:'Ask' | "Bid"
  ) => Promise<void> | unknown
};

export type OrderItem = {
  price: string;
  qty: string;
  orderId: string;
  owner: PublicKey;
  ownerSlot: number;
};

export type EventQueueItem = {
  price: number;
  owner: string;
  ownerSlot: string;
  orderId: string;
  nativeQtyReleased: string;
  nativeQtyPaid: string;
};

export type OpenOrderItem = {
  price?: string;
  orderId?: anchor.BN;
  type: "Ask" | "Bid";
  qty?: string;
  owner?:string 
  ownerSlot?:string
};

export type Balances = {
  nativeCoinFree: string;
  nativeCoinTotal: string;
  nativePcFree: string;
  nativePcTotal: string;
};

export type OpenOrders = OpenOrderItem[] | null;
export type EventQueue = EventQueueItem[] | null;
export type Asks = OrderItem[] | null;
export type Bids = OrderItem[] | null;
