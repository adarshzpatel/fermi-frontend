import { AnchorProvider, BN, Program } from "@project-serum/anchor";
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { IDL } from "../idl/simple_serum";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import * as anchor from "@project-serum/anchor";
import * as spl from "@solana/spl-token";


export const getProgram = (connection: Connection, wallet: AnchorWallet) => {
  const programId = new PublicKey(
    "HTbkjiBvVXMBWRFs4L56fSWaHpX343ZQGzY4htPQ5ver"
    // 'EoTcMgcDRTJVZDMZWBoU6rhYHZfkNTVEAfz3uUJRcYGj'
  );
  const provider = new AnchorProvider(
    connection,
    wallet,
    AnchorProvider.defaultOptions()
  );

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
  console.log("created mint for ",mint.publicKey.toString(),{res})
};

const airDropSol = async (to:PublicKey) => {
  try {
    const connection = new Connection(clusterApiUrl('devnet'), "confirmed");
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
    console.log("airdropped sol to ",to.toString(),{res})
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

export const setupPDAs = async (connection: Connection, wallet: AnchorWallet) => {
  try {
    const programId = new PublicKey(
      "HTbkjiBvVXMBWRFs4L56fSWaHpX343ZQGzY4htPQ5ver"
    );
    const provider = new AnchorProvider(
      connection,
      wallet,
      AnchorProvider.defaultOptions()
    );
    const program = new Program(IDL, programId, provider);
    const coinMint = anchor.web3.Keypair.generate();
    const pcMint = anchor.web3.Keypair.generate();

    let coinVault: anchor.web3.PublicKey;
    let pcVault: anchor.web3.PublicKey;

    let marketPda: anchor.web3.PublicKey;
    let marketPdaBump: number;

    let bidsPda: anchor.web3.PublicKey;
    let bidsPdaBump: number;
    let asksPda: anchor.web3.PublicKey;
    let asksPdaBump: number;

    let reqQPda: anchor.web3.PublicKey;
    let reqQPdaBump: number;

    let eventQPda: anchor.web3.PublicKey;
    let eventQPdaBump: number;

    let openOrdersPda: anchor.web3.PublicKey;
    let openOrdersPdaBump: number;

    const authority = anchor.web3.Keypair.generate();

    let authorityCoinTokenAccount: anchor.web3.PublicKey;
    let authorityPcTokenAccount: anchor.web3.PublicKey;
    console.log(authority.publicKey.toString())


    await airDropSol(authority.publicKey)
    await createMint(provider, coinMint, 9);
    await createMint(provider, pcMint, 6);
    
    [marketPda, marketPdaBump] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from("market", "utf-8"),
        coinMint.publicKey.toBuffer(),
        pcMint.publicKey.toBuffer(),
      ],
      program.programId
      );

    [bidsPda, bidsPdaBump] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("bids", "utf-8"), marketPda.toBuffer()],
      program.programId
    );
    [asksPda, asksPdaBump] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("asks", "utf-8"), marketPda.toBuffer()],
      program.programId
    );

    [reqQPda, reqQPdaBump] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("req-q", "utf-8"), marketPda.toBuffer()],
      program.programId
    );
    [eventQPda, eventQPdaBump] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("event-q", "utf-8"), marketPda.toBuffer()],
      program.programId
    );

    [openOrdersPda, openOrdersPdaBump] =
      await anchor.web3.PublicKey.findProgramAddress(
        [
          Buffer.from("open-orders", "utf-8"),
          marketPda.toBuffer(),
          authority.publicKey.toBuffer(),
        ],
        program.programId
      );


      
    coinVault = await spl.getAssociatedTokenAddress(
      coinMint.publicKey,
      marketPda,
      true
    );
    pcVault = await spl.getAssociatedTokenAddress(
      pcMint.publicKey,
      marketPda,
      true
    );

     authorityCoinTokenAccount = await spl.getAssociatedTokenAddress(
      coinMint.publicKey,
      authority.publicKey,
      false,
    );
    authorityPcTokenAccount = await spl.getAssociatedTokenAddress(
      pcMint.publicKey,
      authority.publicKey,
      false,
    );

    await createAssociatedTokenAccount(
      provider,
      coinMint.publicKey,
      authorityCoinTokenAccount,
      authority.publicKey,
    );
    await createAssociatedTokenAccount(
      provider,
      pcMint.publicKey,
      authorityPcTokenAccount,
      authority.publicKey,
    );

    await mintTo(
      provider,
      coinMint.publicKey,
      authorityCoinTokenAccount,
      BigInt('10000000000'),
    );
    await mintTo(
      provider,
      pcMint.publicKey,
      authorityPcTokenAccount,
      BigInt('1000000000'),
    );
  
    // await airDropSol(programId)
    console.log({
      market:marketPda.toString(),
      coinVault:coinVault.toString(),
      pcVault:pcVault.toString(),
      coinMint: coinMint.publicKey.toString(),
      pcMint: pcMint.publicKey.toString(),
      bids: bidsPda.toString(),
      asks: asksPda.toString(),
      reqQ: reqQPda.toString(),
      eventQ: eventQPda.toString(),
      authority: authority.publicKey.toString(),
    })


    await program.methods
      .initializeMarket(new anchor.BN("1000000000"), new anchor.BN("1000000"))
      .accounts({
        market: marketPda,
        coinVault,
        pcVault,
        coinMint: coinMint.publicKey,
        pcMint: pcMint.publicKey,
        bids: bidsPda,
        asks: asksPda,
        reqQ: reqQPda,
        eventQ: eventQPda,
        authority: authority.publicKey,
      })
      .signers([authority])
      .rpc();

    const market = await program.account.market.fetch(marketPda);
    console.log({market})
    await program.methods
      .newOrder(
        { bid: {} },
        new anchor.BN(99),
        new anchor.BN(1),
        new anchor.BN(99).mul(new anchor.BN(1000000)),
        { limit: {} }
      )
      .accounts({
        openOrders: openOrdersPda,
        market: marketPda,
        coinVault,
        pcVault,
        coinMint: coinMint.publicKey,
        pcMint: pcMint.publicKey,
        payer: authorityPcTokenAccount,
        bids: bidsPda,
        asks: asksPda,
        reqQ: reqQPda,
        eventQ: eventQPda,
        authority: authority.publicKey,
      })
      .signers([authority])
      .rpc();

    console.log("place limit order buy price: 99");
    const openOrders = await program.account.openOrders.fetch(openOrdersPda);
    console.log(openOrders);
    const bids = await program.account.orders.fetch(bidsPda);
    console.log(bids);
    const asks = await program.account.orders.fetch(asksPda);
    console.log(asks);
    const eventQ = await program.account.eventQueue.fetch(eventQPda);
    console.log(eventQ);
  } catch (err) {
    console.log(err);
  }
  
};
