import * as anchor from "@coral-xyz/anchor";
import { Program, AnchorProvider, Wallet } from "@coral-xyz/anchor";
import { Connection, Keypair, PublicKey, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { 
  TOKEN_PROGRAM_ID, 
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createInitializeMint2Instruction,
  createAssociatedTokenAccountInstruction,
  getMinimumBalanceForRentExemptMint,
  MINT_SIZE,
  getAssociatedTokenAddress
} from "@solana/spl-token";
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import idl from '../target/idl/bonding_curve.json';

const prisma = new PrismaClient();

const BONDING_CURVE_PROGRAM_ID = new PublicKey('ASKaLZvuV9TW6MKxNjQoKAQihzEAaVDzMryFqgvzDswi');
const RPC_ENDPOINT = 'https://api.devnet.solana.com';

async function deployTokenForCreator(
  connection: Connection,
  program: Program,
  payer: Keypair,
  creatorId: string,
  channelName: string
) {
  console.log(`\n🚀 Deploying token for: ${channelName}`);
  
  const mintKeypair = Keypair.generate();
  console.log(`   Token Mint: ${mintKeypair.publicKey.toString()}`);

  const [bondingCurve] = PublicKey.findProgramAddressSync(
    [Buffer.from('bonding_curve'), mintKeypair.publicKey.toBuffer()],
    program.programId
  );

  const [solVault] = PublicKey.findProgramAddressSync(
    [Buffer.from('sol_vault'), bondingCurve.toBuffer()],
    program.programId
  );

  const tokenVault = await getAssociatedTokenAddress(
    mintKeypair.publicKey,
    bondingCurve,
    true
  );

  const rentLamports = await getMinimumBalanceForRentExemptMint(connection);

  const createMintTx = new anchor.web3.Transaction();
  createMintTx.add(
    SystemProgram.createAccount({
      fromPubkey: payer.publicKey,
      newAccountPubkey: mintKeypair.publicKey,
      space: MINT_SIZE,
      lamports: rentLamports,
      programId: TOKEN_PROGRAM_ID,
    })
  );
  createMintTx.add(
    createInitializeMint2Instruction(
      mintKeypair.publicKey,
      9,
      bondingCurve,
      bondingCurve,
      TOKEN_PROGRAM_ID
    )
  );

  const { blockhash: blockhash1 } = await connection.getLatestBlockhash();
  createMintTx.recentBlockhash = blockhash1;
  createMintTx.feePayer = payer.publicKey;
  createMintTx.partialSign(mintKeypair, payer);

  const sig1 = await connection.sendRawTransaction(createMintTx.serialize());
  await connection.confirmTransaction(sig1, 'confirmed');
  console.log(`   ✅ Mint created`);

  const tx = await program.methods
    .initializeCurve()
    .accounts({
      authority: payer.publicKey,
      bondingCurve: bondingCurve,
      tokenMint: mintKeypair.publicKey,
      solVault: solVault,
      tokenVault: tokenVault,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
    } as any)
    .rpc();

  console.log(`   ✅ Bonding curve initialized`);
  console.log(`   🔗 Explorer: https://explorer.solana.com/tx/${tx}?cluster=devnet`);

  await prisma.creator.update({
    where: { id: creatorId },
    data: { tokenAddress: mintKeypair.publicKey.toString() }
  });

  console.log(`   ✅ Updated database`);

  return mintKeypair.publicKey.toString();
}

async function main() {
  console.log('🔥 Deploying REAL tokens for all creators on Solana Devnet\n');

  const connection = new Connection(RPC_ENDPOINT, 'confirmed');

  let payerKeypair: Keypair;
  const keypairPath = process.env.HOME + '/.config/solana/id.json';
  
  if (fs.existsSync(keypairPath)) {
    const keypairData = JSON.parse(fs.readFileSync(keypairPath, 'utf-8'));
    payerKeypair = Keypair.fromSecretKey(Uint8Array.from(keypairData));
    console.log(`Using keypair: ${payerKeypair.publicKey.toString()}`);
  } else {
    throw new Error('Keypair not found. Run: solana-keygen new');
  }

  const balance = await connection.getBalance(payerKeypair.publicKey);
  console.log(`Balance: ${balance / LAMPORTS_PER_SOL} SOL\n`);

  if (balance < 0.5 * LAMPORTS_PER_SOL) {
    console.log('⚠️  Low balance! Run: solana airdrop 2 --url devnet\n');
    return;
  }

  const creators = await prisma.creator.findMany({
    where: {
      tokenAddress: { startsWith: 'TOKEN' }
    }
  });

  console.log(`Found ${creators.length} creators to deploy\n`);
  console.log('='.repeat(60));

  const provider = new AnchorProvider(
    connection,
    new Wallet(payerKeypair),
    { commitment: 'confirmed' }
  );
  
  const program = new Program(idl as any, provider);

  for (const creator of creators) {
    try {
      await deployTokenForCreator(
        connection,
        program,
        payerKeypair,
        creator.id,
        creator.channelName
      );
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`❌ Failed to deploy for ${creator.channelName}:`, error);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ ALL TOKENS DEPLOYED!');
  console.log('\n🎉 All creators now have REAL Solana tokens with bonding curves!');
  
  await prisma.$disconnect();
}

main();

