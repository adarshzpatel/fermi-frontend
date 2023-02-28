import { AnchorProvider, BN, Program } from "@project-serum/anchor";
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  clusterApiUrl,
} from "@solana/web3.js";
import { IDL, SimpleSerum } from "../idl/simple_serum";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import * as anchor from "@project-serum/anchor";
import * as spl from "@solana/spl-token";

export const PROGRAM_ADDRESS = "HTbkjiBvVXMBWRFs4L56fSWaHpX343ZQGzY4htPQ5ver"
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

const airDropSol = async (to: PublicKey) => {
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

export const getMarketPda = (coinMint:Keypair,pcMint:Keypair,program:Program<SimpleSerum>) => {
  return anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("market", "utf-8"),
      coinMint.publicKey.toBuffer(),
      pcMint.publicKey.toBuffer(),
    ],
    program.programId
  )[0];
};

export const getBidsPda = (marketPda:PublicKey,program:Program<SimpleSerum>) => {
  return anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from('bids', 'utf-8'), marketPda.toBuffer()],
    program.programId,
  )[0];
}

export const getAsksPda = (marketPda:PublicKey,program:Program<SimpleSerum>) => {
  return anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from('asks', 'utf-8'), marketPda.toBuffer()],
    program.programId,
  )[0];
}

export const getReqQPda = (marketPda:PublicKey,program:Program<SimpleSerum>) => {
  return anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from('req-q', 'utf-8'), marketPda.toBuffer()],
    program.programId,
  )[0];
}

export const getEventQPda = (marketPda:PublicKey,program:Program<SimpleSerum>) => {
  return anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from('event-q', 'utf-8'), marketPda.toBuffer()],
    program.programId,
  )[0];
}

export const getOpenOrdersPda = (marketPda:PublicKey,authority:Keypair,program:Program<SimpleSerum>) => {
  return anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from('open-orders', 'utf-8'),
      marketPda.toBuffer(),
      authority.publicKey.toBuffer(),
    ],
    program.programId,
  )[0];
};
