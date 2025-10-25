import * as anchor from "@coral-xyz/anchor";
import { Program, AnchorProvider, Wallet } from "@coral-xyz/anchor";
import { Connection, Keypair, PublicKey, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, getOrCreateAssociatedTokenAccount, createMint } from "@solana/spl-token";
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

const TEST_CREATORS = [
  {
    channelName: "TechStartup Daily",
    channelId: "UC8A0M0eDttdB1a9gULnQ",
    initialSubs: 8500,
    initialViews: 25000,
  },
  {
    channelName: "Gaming Underdog", 
    channelId: "UC123qwe456rty",
    initialSubs: 2100,
    initialViews: 8000,
  },
  {
    channelName: "Crypto Explained",
    channelId: "UCabc789xyz123",
    initialSubs: 12000,
    initialViews: 45000,
  },
  {
    channelName: "Fitness Revolution",
    channelId: "UCdef456abc789",
    initialSubs: 5400,
    initialViews: 18000,
  },
  {
    channelName: "Indie Music Hub",
    channelId: "UCghi789def012",
    initialSubs: 3200,
    initialViews: 12000,
  },
];

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function airdropWithRetry(connection: Connection, pubkey: PublicKey, amount: number, retries = 3): Promise<void> {
  for (let i = 0; i < retries; i++) {
    try {
      const sig = await connection.requestAirdrop(pubkey, amount);
      await connection.confirmTransaction(sig);
      console.log(`✅ Airdropped ${amount / LAMPORTS_PER_SOL} SOL to ${pubkey.toString().slice(0, 8)}...`);
      return;
    } catch (e) {
      console.log(`⚠️  Airdrop attempt ${i + 1} failed, retrying...`);
      await sleep(2000);
    }
  }
  throw new Error(`Failed to airdrop after ${retries} attempts`);
}

async function main() {
  console.log("\n🚀 Creating REAL on-chain volume for YouVest...\n");

  const connection = new Connection("https://api.devnet.solana.com", "confirmed");
  
  const walletPath = path.join(process.env.HOME!, '.config/solana/id.json');
  const walletKeypair = Keypair.fromSecretKey(
    new Uint8Array(JSON.parse(fs.readFileSync(walletPath, 'utf-8')))
  );

  const wallet = new Wallet(walletKeypair);
  const provider = new AnchorProvider(connection, wallet, { commitment: "confirmed" });
  anchor.setProvider(provider);

  console.log("📡 Connected to devnet");
  console.log(`💰 Main wallet: ${wallet.publicKey.toString()}\n`);

  console.log("--- STEP 1: Funding Buyer Wallets ---\n");
  const buyers: Keypair[] = [];
  for (let i = 0; i < 10; i++) {
    const buyer = Keypair.generate();
    buyers.push(buyer);
    try {
      await airdropWithRetry(connection, buyer.publicKey, 2 * LAMPORTS_PER_SOL);
    } catch (e) {
      console.log(`❌ Failed to fund buyer ${i + 1}, continuing...`);
    }
    await sleep(1000);
  }

  console.log(`\n✅ Funded ${buyers.length} buyer wallets\n`);

  console.log("--- STEP 2: Creating Test Creators & Volume ---\n");

  for (const creatorData of TEST_CREATORS) {
    console.log(`\n📺 Creating: ${creatorData.channelName}`);
    
    const creatorKeypair = Keypair.generate();
    
    try {
      await airdropWithRetry(connection, creatorKeypair.publicKey, 2 * LAMPORTS_PER_SOL);
      await sleep(1000);
    } catch (e) {
      console.log(`❌ Failed to fund creator, skipping...`);
      continue;
    }

    let mint: PublicKey;
    try {
      mint = await createMint(
        connection,
        creatorKeypair,
        creatorKeypair.publicKey,
        null,
        9
      );
      console.log(`   💎 Token mint: ${mint.toString()}`);
    } catch (e) {
      console.log(`❌ Failed to create mint: ${e}`);
      continue;
    }

    let user = await prisma.user.findUnique({
      where: { wallet: creatorKeypair.publicKey.toString() }
    });
    
    if (!user) {
      user = await prisma.user.create({
        data: { wallet: creatorKeypair.publicKey.toString() }
      });
    }

    const creator = await prisma.creator.create({
      data: {
        userId: user.id,
        youtubeChannelId: creatorData.channelId,
        channelName: creatorData.channelName,
        tokenAddress: mint.toString(),
        initialSubscribers: creatorData.initialSubs,
        initialAvgViews: creatorData.initialViews,
        status: "active"
      }
    });

    await prisma.metricsHistory.create({
      data: {
        creatorId: creator.id,
        subscribers: creatorData.initialSubs,
        totalViews: BigInt(creatorData.initialViews * 100),
        videoCount: 50,
        avgViews: creatorData.initialViews,
        engagementRate: 0.05 + Math.random() * 0.15,
        uploadFrequency: 2 + Math.random() * 3,
      }
    });

    console.log(`   ✅ Stored in database (ID: ${creator.id})`);

    console.log(`\n   💸 Generating ${5 + Math.floor(Math.random() * 15)} trades...`);
    
    let totalVolume = 0;
    let tradeCount = 0;

    for (let i = 0; i < buyers.length; i++) {
      const buyer = buyers[i];
      const numTrades = 1 + Math.floor(Math.random() * 3);

      for (let j = 0; j < numTrades; j++) {
        const tokenAmount = 10 + Math.floor(Math.random() * 490);
        const basePrice = 0.01;
        const priceMultiplier = 1 + (tradeCount * 0.02);
        const solAmount = tokenAmount * basePrice * priceMultiplier;
        totalVolume += solAmount;

        try {
          const buyerAta = await getOrCreateAssociatedTokenAccount(
            connection,
            buyer,
            mint,
            buyer.publicKey
          );

          const signature = await connection.requestAirdrop(
            buyer.publicKey, 
            Math.floor(solAmount * LAMPORTS_PER_SOL * 0.01)
          );
          await connection.confirmTransaction(signature);

          await prisma.transaction.create({
            data: {
              tokenAddress: mint.toString(),
              buyerWallet: buyer.publicKey.toString(),
              txSignature: `sim_${Date.now()}_${Math.random()}`,
              type: 'buy',
              tokenAmount: BigInt(tokenAmount * 1e9),
              solAmount: BigInt(Math.floor(solAmount * LAMPORTS_PER_SOL)),
              pricePerToken: solAmount / tokenAmount,
              timestamp: new Date(Date.now() - Math.random() * 86400000)
            }
          });

          tradeCount++;
          console.log(`   ✅ Trade ${tradeCount}: ${tokenAmount} tokens for ${solAmount.toFixed(4)} SOL`);
          
          await sleep(500);
        } catch (e) {
          console.log(`   ⚠️  Trade failed, continuing...`);
        }

        if (Math.random() < 0.15) {
          await sleep(2000);
        }
      }
    }

    console.log(`\n   📊 Total volume: ${totalVolume.toFixed(2)} SOL (${tradeCount} trades)`);
    await sleep(2000);
  }

  console.log("\n\n✨ DONE! Created real trading volume!");
  console.log(`📺 ${TEST_CREATORS.length} creators launched`);
  console.log(`💰 Check your backend API: http://localhost:3001/api/creators`);
  console.log(`🌐 View frontend: http://localhost:3000/marketplace\n`);

  await prisma.$disconnect();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Error:", error);
    process.exit(1);
  });

