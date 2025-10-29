import { Connection, PublicKey, SystemProgram, Transaction, Keypair } from '@solana/web3.js';
import { 
  TOKEN_PROGRAM_ID, 
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createInitializeMint2Instruction,
  createAssociatedTokenAccountInstruction,
  getMinimumBalanceForRentExemptMint,
  MINT_SIZE,
  getAssociatedTokenAddress
} from '@solana/spl-token';
import { WalletContextState } from '@solana/wallet-adapter-react';
import * as anchor from '@coral-xyz/anchor';
import { AnchorProvider, Program, Wallet } from '@coral-xyz/anchor';

const TOKEN_FACTORY_PROGRAM_ID = new PublicKey('7yNsJvKUNgxdAHgCRY2SWb7GqsaL5HxTgSfpraHQCYdh');
const BONDING_CURVE_PROGRAM_ID = new PublicKey('ASKaLZvuV9TW6MKxNjQoKAQihzEAaVDzMryFqgvzDswi');
const RPC_ENDPOINT = 'https://api.devnet.solana.com';

interface LaunchTokenParams {
  wallet: WalletContextState;
  channelData: {
    youtubeChannelId: string;
    channelName: string;
    channelAvatar: string;
    subscribers: number;
    avgViews: number;
    videoCount: number;
  };
}

export async function launchCreatorToken({ wallet, channelData }: LaunchTokenParams): Promise<{
  tokenMint: string;
  signature: string;
}> {
  if (!wallet.publicKey || !wallet.signTransaction) {
    throw new Error('Wallet not connected');
  }

  const connection = new Connection(RPC_ENDPOINT, 'confirmed');

  const mintKeypair = Keypair.generate();
  const mintPubkey = mintKeypair.publicKey;

  const rentLamports = await getMinimumBalanceForRentExemptMint(connection);

  const [bondingCurve] = PublicKey.findProgramAddressSync(
    [Buffer.from('bonding_curve'), mintPubkey.toBuffer()],
    BONDING_CURVE_PROGRAM_ID
  );

  const [solVault] = PublicKey.findProgramAddressSync(
    [Buffer.from('sol_vault'), bondingCurve.toBuffer()],
    BONDING_CURVE_PROGRAM_ID
  );

  const tokenVault = await getAssociatedTokenAddress(
    mintPubkey,
    bondingCurve,
    true
  );

  const transaction = new Transaction();

  transaction.add(
    SystemProgram.createAccount({
      fromPubkey: wallet.publicKey,
      newAccountPubkey: mintPubkey,
      space: MINT_SIZE,
      lamports: rentLamports,
      programId: TOKEN_PROGRAM_ID,
    })
  );

  transaction.add(
    createInitializeMint2Instruction(
      mintPubkey,
      9,
      wallet.publicKey,
      wallet.publicKey,
      TOKEN_PROGRAM_ID
    )
  );

  const { createMintToInstruction, createSetAuthorityInstruction, AuthorityType, createAssociatedTokenAccountInstruction } = await import('@solana/spl-token');
  const TOTAL_SUPPLY = 1_000_000_000n * 1_000_000_000n;
  
  transaction.add(
    createAssociatedTokenAccountInstruction(
      wallet.publicKey,
      tokenVault,
      bondingCurve,
      mintPubkey
    )
  );

  transaction.add(
    createMintToInstruction(
      mintPubkey,
      tokenVault,
      wallet.publicKey,
      TOTAL_SUPPLY,
      [],
      TOKEN_PROGRAM_ID
    )
  );

  transaction.add(
    createSetAuthorityInstruction(
      mintPubkey,
      wallet.publicKey,
      AuthorityType.MintTokens,
      bondingCurve,
      [],
      TOKEN_PROGRAM_ID
    )
  );

  const initCurveData = Buffer.concat([
    Buffer.from([170, 84, 186, 253, 131, 149, 95, 213])
  ]);

  transaction.add({
    keys: [
      { pubkey: wallet.publicKey, isSigner: true, isWritable: true },
      { pubkey: bondingCurve, isSigner: false, isWritable: true },
      { pubkey: mintPubkey, isSigner: false, isWritable: false },
      { pubkey: solVault, isSigner: false, isWritable: true },
      { pubkey: tokenVault, isSigner: false, isWritable: false },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      { pubkey: ASSOCIATED_TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    ],
    programId: BONDING_CURVE_PROGRAM_ID,
    data: initCurveData,
  });

  transaction.feePayer = wallet.publicKey;
  const { blockhash } = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;

  transaction.partialSign(mintKeypair);

  const signed = await wallet.signTransaction(transaction);
  const signature = await connection.sendRawTransaction(signed.serialize());
  
  console.log('Token creation tx:', signature);
  await connection.confirmTransaction(signature, 'confirmed');

  // Give creator initial allocation (100 tokens for demo)
  console.log('Buying creator initial allocation...');
  try {
    const { buyTokens } = await import('./solana');
    const initialAllocation = 100; // Start with 100 tokens  
    const maxSol = 1.5; // 1.5 SOL max (affordable on devnet)
    
    await buyTokens(wallet, mintPubkey.toString(), initialAllocation, maxSol);
    console.log('✅ Creator received', initialAllocation, 'tokens');
  } catch (e) {
    console.error('⚠️ Creator buy failed - you can buy tokens manually:', e.message);
    // Don't fail the whole launch if creator buy fails
  }

  await fetch('http://localhost:3001/api/launch/create-token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      wallet: wallet.publicKey.toString(),
      youtubeChannelId: channelData.youtubeChannelId,
      channelName: channelData.channelName,
      channelAvatar: channelData.channelAvatar,
      subscribers: channelData.subscribers,
      avgViews: channelData.avgViews,
      videoCount: channelData.videoCount,
      tokenMint: mintPubkey.toString()
    })
  });

  return {
    tokenMint: mintPubkey.toString(),
    signature
  };
}

