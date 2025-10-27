import { Connection, PublicKey, SystemProgram, Transaction, Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { 
  TOKEN_PROGRAM_ID, 
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createInitializeMint2Instruction,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
  getMinimumBalanceForRentExemptMint,
  MINT_SIZE,
  getAssociatedTokenAddress
} from '@solana/spl-token';
import { WalletContextState } from '@solana/wallet-adapter-react';
import BN from 'bn.js';

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

  const creatorTokenAccount = await getAssociatedTokenAddress(
    mintPubkey,
    wallet.publicKey
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
      bondingCurve,
      bondingCurve,
      TOKEN_PROGRAM_ID
    )
  );

  transaction.add(
    createAssociatedTokenAccountInstruction(
      wallet.publicKey,
      tokenVault,
      bondingCurve,
      mintPubkey
    )
  );

  transaction.add(
    createAssociatedTokenAccountInstruction(
      wallet.publicKey,
      creatorTokenAccount,
      wallet.publicKey,
      mintPubkey
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
      { pubkey: tokenVault, isSigner: false, isWritable: true },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      { pubkey: ASSOCIATED_TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    ],
    programId: BONDING_CURVE_PROGRAM_ID,
    data: initCurveData,
  });

  const creatorSupply = new BN(20_000_000).mul(new BN(10).pow(new BN(9)));
  
  transaction.add(
    createMintToInstruction(
      mintPubkey,
      creatorTokenAccount,
      bondingCurve,
      BigInt(creatorSupply.toString())
    )
  );

  transaction.feePayer = wallet.publicKey;
  const { blockhash } = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;

  transaction.partialSign(mintKeypair);

  const signed = await wallet.signTransaction(transaction);
  const signature = await connection.sendRawTransaction(signed.serialize());
  
  await connection.confirmTransaction(signature, 'confirmed');

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

