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
import { 
  getCreateMetadataAccountV3InstructionDataSerializer,
  MPL_TOKEN_METADATA_PROGRAM_ID
} from '@metaplex-foundation/mpl-token-metadata';
import { SOLANA_RPC, API_URL } from './config';
const TOKEN_FACTORY_PROGRAM_ID = new PublicKey('7yNsJvKUNgxdAHgCRY2SWb7GqsaL5HxTgSfpraHQCYdh');
const BONDING_CURVE_PROGRAM_ID = new PublicKey('ASKaLZvuV9TW6MKxNjQoKAQihzEAaVDzMryFqgvzDswi');
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
  const connection = new Connection(SOLANA_RPC, 'confirmed');
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
  const [metadataPDA] = PublicKey.findProgramAddressSync(
    [
      Buffer.from('metadata'),
      new PublicKey(MPL_TOKEN_METADATA_PROGRAM_ID).toBuffer(),
      mintPubkey.toBuffer(),
    ],
    new PublicKey(MPL_TOKEN_METADATA_PROGRAM_ID)
  );
  const tokenSymbol = channelData.channelName
    .replace(/[^a-zA-Z0-9]/g, '')
    .substring(0, 10)
    .toUpperCase();
  const metadataData = getCreateMetadataAccountV3InstructionDataSerializer().serialize({
    data: {
      name: channelData.channelName.substring(0, 32),
      symbol: tokenSymbol,
      uri: '',
      sellerFeeBasisPoints: 0,
      creators: null,
      collection: null,
      uses: null,
    },
    isMutable: true,
    collectionDetails: null,
  });
  const { TransactionInstruction } = await import('@solana/web3.js');
  const SYSVAR_RENT_PUBKEY = new PublicKey('SysvarRent111111111111111111111111111111111');
  const metadataIx = new TransactionInstruction({
    keys: [
      { pubkey: metadataPDA, isSigner: false, isWritable: true },
      { pubkey: mintPubkey, isSigner: false, isWritable: false },
      { pubkey: wallet.publicKey, isSigner: false, isWritable: false },
      { pubkey: wallet.publicKey, isSigner: true, isWritable: true },
      { pubkey: wallet.publicKey, isSigner: false, isWritable: false },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
    ],
    programId: new PublicKey(MPL_TOKEN_METADATA_PROGRAM_ID),
    data: Buffer.from(metadataData),
  });
  transaction.add(metadataIx);
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
  console.log('Buying creator initial allocation...');
  try {
    const { buyTokens } = await import('./solana');
    const initialAllocation = 100; 
    const maxSol = 1.5; 
    await buyTokens(wallet, mintPubkey.toString(), initialAllocation, maxSol);
    console.log(' Creator received', initialAllocation, 'tokens');
  } catch (e: any) {
    if (e.message?.includes('already been processed')) {
      console.log(' Transaction already processed - tokens allocated');
    } else {
      console.error('️ Creator buy failed - you can buy tokens manually:', e.message);
    }
  }
  await fetch(`${API_URL}/api/launch/create-token`, {
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
