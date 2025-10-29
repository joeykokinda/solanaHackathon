const { PrismaClient } = require('@prisma/client');
const { Connection, Keypair, PublicKey, SystemProgram, Transaction } = require('@solana/web3.js');
const { 
  TOKEN_PROGRAM_ID, 
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createInitializeMint2Instruction,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
  createSetAuthorityInstruction,
  AuthorityType,
  getMinimumBalanceForRentExemptMint,
  MINT_SIZE,
  getAssociatedTokenAddress
} = require('@solana/spl-token');
const fs = require('fs');
const prisma = new PrismaClient();
const RPC_ENDPOINT = 'https://api.devnet.solana.com';
const BONDING_CURVE_PROGRAM_ID = new PublicKey('ASKaLZvuV9TW6MKxNjQoKAQihzEAaVDzMryFqgvzDswi');
async function createTokenForCreator(connection, payerKeypair, creator) {
  console.log(`\n Creating token for ${creator.channelName}...`);
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
      fromPubkey: payerKeypair.publicKey,
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
      payerKeypair.publicKey,
      payerKeypair.publicKey,
      TOKEN_PROGRAM_ID
    )
  );
  transaction.add(
    createAssociatedTokenAccountInstruction(
      payerKeypair.publicKey,
      tokenVault,
      bondingCurve,
      mintPubkey
    )
  );
  const TOTAL_SUPPLY = 1_000_000_000n * 1_000_000_000n;
  transaction.add(
    createMintToInstruction(
      mintPubkey,
      tokenVault,
      payerKeypair.publicKey,
      TOTAL_SUPPLY,
      [],
      TOKEN_PROGRAM_ID
    )
  );
  transaction.add(
    createSetAuthorityInstruction(
      mintPubkey,
      payerKeypair.publicKey,
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
      { pubkey: payerKeypair.publicKey, isSigner: true, isWritable: true },
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
  transaction.feePayer = payerKeypair.publicKey;
  const { blockhash } = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.partialSign(mintKeypair, payerKeypair);
  try {
    const signature = await connection.sendRawTransaction(transaction.serialize());
    await connection.confirmTransaction(signature, 'confirmed');
    console.log(` Token created: ${mintPubkey.toString()}`);
    console.log(`   Bonding Curve: ${bondingCurve.toString()}`);
    console.log(`   Tx: https://explorer.solana.com/tx/${signature}?cluster=devnet`);
    return mintPubkey.toString();
  } catch (error) {
    console.error(` Error creating token:`, error.message);
    throw error;
  }
}
async function main() {
  console.log(' Creating REAL tokens for mock creators...\n');
  const walletPath = '/home/joey/.config/solana/id.json';
  if (!fs.existsSync(walletPath)) {
    console.error(' Wallet not found at:', walletPath);
    console.log('Run: solana-keygen new');
    process.exit(1);
  }
  const walletData = JSON.parse(fs.readFileSync(walletPath, 'utf-8'));
  const payerKeypair = Keypair.fromSecretKey(new Uint8Array(walletData));
  console.log(` Using wallet: ${payerKeypair.publicKey.toString()}\n`);
  const connection = new Connection(RPC_ENDPOINT, 'confirmed');
  const balance = await connection.getBalance(payerKeypair.publicKey);
  console.log(`   Balance: ${(balance / 1e9).toFixed(4)} SOL\n`);
  if (balance < 0.5e9) {
    console.error(' Insufficient balance! Need at least 0.5 SOL');
    console.log('Run: solana airdrop 2');
    process.exit(1);
  }
  const mockCreators = [
    {
      youtubeChannelId: 'UCX6OQ3DkcsbYNE6H8uQQuVA',
      channelName: 'MrBeast',
      channelAvatar: 'https://yt3.ggpht.com/ytc/AIdro_mEDPNTFdXRKvhYZvNZpOhFaxwzO87d8jUY1MjPNq2s6g=s176-c-k-c0x00ffffff-no-rj',
      subscribers: 234000000,
      avgViews: 95000000,
      videoCount: 741,
      priceSOL: 0.0001,
      marketCap: 100.0,
      volume24h: 25.5,
      priceChange24h: 15.3,
      holders: 1247
    },
    {
      youtubeChannelId: 'UCsBjURrPoezykLs9EqgamOA',
      channelName: 'Fireship',
      channelAvatar: 'https://yt3.ggpht.com/ytc/AIdro_kGrQl33_1gWpVJuHqxFKYhZXFmvCmyD4i7xCr6c4DKVA=s176-c-k-c0x00ffffff-no-rj',
      subscribers: 3200000,
      avgViews: 850000,
      videoCount: 523,
      priceSOL: 0.00005,
      marketCap: 50.0,
      volume24h: 12.3,
      priceChange24h: 8.7,
      holders: 892
    },
    {
      youtubeChannelId: 'UCW5YeuERMmlnqo4oq8vwUpg',
      channelName: 'NetworkChuck',
      channelAvatar: 'https://yt3.ggpht.com/ytc/AIdro_nMZrEZ4NzXqFQRJJz8mPRnhU4s9-VbYCYbqgXYKFHOtA=s176-c-k-c0x00ffffff-no-rj',
      subscribers: 4100000,
      avgViews: 650000,
      videoCount: 312,
      priceSOL: 0.000075,
      marketCap: 75.0,
      volume24h: 18.9,
      priceChange24h: -3.2,
      holders: 634
    }
  ];
  for (const creator of mockCreators) {
    try {
      const existing = await prisma.creator.findUnique({
        where: { youtubeChannelId: creator.youtubeChannelId }
      });
      if (existing) {
        console.log(` ${creator.channelName} already exists with token: ${existing.tokenAddress}`);
        continue;
      }
      const tokenAddress = await createTokenForCreator(connection, payerKeypair, creator);
      const mockWallet = Keypair.generate().publicKey.toString();
      await prisma.creator.create({
        data: {
          youtubeChannelId: creator.youtubeChannelId,
          channelName: creator.channelName,
          channelAvatar: creator.channelAvatar,
          tokenAddress,
          initialSubscribers: creator.subscribers,
          initialAvgViews: creator.avgViews,
          user: {
            create: {
              wallet: mockWallet
            }
          }
        }
      });
      console.log(` Added ${creator.channelName} to database\n`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(` Error processing ${creator.channelName}:`, error.message);
    }
  }
  console.log('\n Done! Real tokens created for all mock creators.');
  console.log(' Users can now buy/sell these tokens on your website!');
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
