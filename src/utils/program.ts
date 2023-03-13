import { AnchorProvider, BN, Program } from "@project-serum/anchor";
import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  clusterApiUrl,
} from "@solana/web3.js";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import * as anchor from "@project-serum/anchor";
import * as spl from "@solana/spl-token";
import { PROGRAM_ADDRESS } from "./constants";
import {IDL,SimpleSerum} from "../idl/simple_serum"

export const priceFromOrderId = (orderId:anchor.BN) => {
  return Number((BigInt(orderId.toString()) >> BigInt(64)).toString()).toFixed(2);
}

export const timestampFromOrderId = (orderId:anchor.BN) => {
  const timestamp = (BigInt(orderId.toString()) << BigInt(64)).toString()
  console.log({timestamp:timestamp,date:new Date(timestamp)})
  return timestamp
}

export const getProgramId = () => new PublicKey(PROGRAM_ADDRESS)

export const getProvider = (connection:Connection,wallet:AnchorWallet) => {
  return new AnchorProvider(
    connection,
    wallet,
    anchor.AnchorProvider.defaultOptions()
  );
}
export const getProgram = (provider:AnchorProvider) => {
  const programId = getProgramId()
  const program = new Program(IDL, programId, provider);
  return program;
};

export const createMint = async (
  provider: anchor.AnchorProvider,
  mint: anchor.web3.Keypair,
  decimal: number
) => {
  //const programId = getDevPgmId();
  const tx = new anchor.web3.Transaction();
  tx.add(
    anchor.web3.SystemProgram.createAccount({
      programId: spl.TOKEN_PROGRAM_ID,
      //programId: programId,
      fromPubkey: provider.wallet.publicKey,
      newAccountPubkey: mint.publicKey,
      space: spl.MintLayout.span,
      lamports: await provider.connection.getMinimumBalanceForRentExemption(
        spl.MintLayout.span
      ),
    })
  );
  tx.add(
    spl.createInitializeMintInstruction(
      mint.publicKey,
      decimal,
      provider.wallet.publicKey,
      provider.wallet.publicKey
    )
  );
  const res = await provider.sendAndConfirm(tx, [mint]);
  console.log("created mint for ", mint.publicKey.toString(), { res });
};

export const airDropSol = async (to: PublicKey) => {
  try {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    const airdropSignature = await connection.requestAirdrop(
      to,
      2 * LAMPORTS_PER_SOL
    );

    const latestBlockHash = await connection.getLatestBlockhash();

    const res = await connection.confirmTransaction({
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: airdropSignature,
    });
    console.log("airdropped sol to ", to.toString(), { res });
  } catch (error) {
    console.error(error);
  }
};

export const createAssociatedTokenAccount = async (
  provider: anchor.AnchorProvider,
  mint: anchor.web3.PublicKey,
  ata: anchor.web3.PublicKey,
  owner: anchor.web3.PublicKey
) => {
  const tx = new anchor.web3.Transaction();
  tx.add(
    spl.createAssociatedTokenAccountInstruction(
      provider.wallet.publicKey,
      ata,
      owner,
      mint
    )
  );
  await provider.sendAndConfirm(tx, []);
};

export const mintTo = async (
  provider: anchor.AnchorProvider,
  mint: anchor.web3.PublicKey,
  ta: anchor.web3.PublicKey,
  amount: bigint
) => {
  const tx = new anchor.web3.Transaction();
  tx.add(
    spl.createMintToInstruction(mint, ta, provider.wallet.publicKey, amount, [])
  );
  await provider.sendAndConfirm(tx, []);
};
