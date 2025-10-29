const { PrismaClient } = require('@prisma/client');
const { Connection, Keypair, PublicKey, SystemProgram, Transaction } = require('@solana/web3.js');
const { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddress, getMinimumBalanceForRentExemptMint, MINT_SIZE, createInitializeMint2Instruction, createMintToInstruction, createSetAuthorityInstruction, AuthorityType, createAssociatedTokenAccountInstruction } = require('@solana/spl-token');
const { createMetadataAccountV3 } = require('@metaplex-foundation/mpl-token-metadata');
const { createUmi } = require('@metaplex-foundation/umi-bundle-defaults');
const { fromWeb3JsKeypair, fromWeb3JsPublicKey, toWeb3JsInstruction } = require('@metaplex-foundation/umi-web3js-adapters');
const { publicKey, signerIdentity } = require('@metaplex-foundation/umi');
const fs = require('fs');

const prisma = new PrismaClient();

const RPC_ENDPOINT = 'https://api.devnet.solana.com';
const BONDING_CURVE_PROGRAM_ID = new PublicKey('ASKaLZvuV9TW6MKxNjQoKAQihzEAaVDzMryFqgvzDswi');

const deployerKeypair = Keypair.fromSecretKey(
  new Uint8Array(JSON.parse(fs.readFileSync('/home/joey/.config/solana/id.json', 'utf-8')))
);

async function createTokenForCreator(creator) {
  console.log(`\n🔨 Creating token for ${creator.channelName}...`);
  
  const connection = new Connection(RPC_ENDPOINT, 'confirmed');
  const mintKeypair = Keypair.generate();
  const mintPubkey = mintKeypair.publicKey;

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

  const rentLamports = await getMinimumBalanceForRentExemptMint(connection);
  const transaction = new Transaction();

  transaction.add(
    SystemProgram.createAccount({
      fromPubkey: deployerKeypair.publicKey,
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
      deployerKeypair.publicKey,
      deployerKeypair.publicKey,
      TOKEN_PROGRAM_ID
    )
  );

  const TOTAL_SUPPLY = BigInt(1_000_000_000) * BigInt(1_000_000_000);
  
  transaction.add(
    createAssociatedTokenAccountInstruction(
      deployerKeypair.publicKey,
      tokenVault,
      bondingCurve,
      mintPubkey
    )
  );

  transaction.add(
    createMintToInstruction(
      mintPubkey,
      tokenVault,
      deployerKeypair.publicKey,
      TOTAL_SUPPLY,
      [],
      TOKEN_PROGRAM_ID
    )
  );

  const umi = createUmi(RPC_ENDPOINT);
  const umiSigner = fromWeb3JsKeypair(deployerKeypair);
  umi.use(signerIdentity(umiSigner));
  
  const symbol = creator.channelName
    .replace(/[^a-zA-Z0-9]/g, '')
    .toUpperCase()
    .substring(0, 10);

  const metadataInstruction = createMetadataAccountV3(umi, {
    mint: publicKey(mintPubkey.toString()),
    mintAuthority: umiSigner,
    payer: umiSigner,
    updateAuthority: umiSigner,
    data: {
      name: creator.channelName,
      symbol: symbol,
      uri: '',
      sellerFeeBasisPoints: 0,
      creators: null,
      collection: null,
      uses: null,
    },
    isMutable: true,
    collectionDetails: null,
  });

  const web3MetadataInstruction = toWeb3JsInstruction(metadataInstruction.getInstructions()[0]);
  transaction.add(web3MetadataInstruction);

  transaction.add(
    createSetAuthorityInstruction(
      mintPubkey,
      deployerKeypair.publicKey,
      AuthorityType.MintTokens,
      bondingCurve,
      [],
      TOKEN_PROGRAM_ID
    )
  );

  const initCurveData = Buffer.from([170, 84, 186, 253, 131, 149, 95, 213]);

  transaction.add({
    keys: [
      { pubkey: deployerKeypair.publicKey, isSigner: true, isWritable: true },
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

  transaction.feePayer = deployerKeypair.publicKey;
  const { blockhash } = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;

  transaction.partialSign(mintKeypair, deployerKeypair);

  const signature = await connection.sendRawTransaction(transaction.serialize());
  await connection.confirmTransaction(signature, 'confirmed');

  await prisma.creator.update({
    where: { id: creator.id },
    data: { tokenAddress: mintPubkey.toString() }
  });

  console.log(`   ✅ Token created: ${mintPubkey.toString()}`);
  console.log(`   📝 TX: ${signature}`);
  
  return mintPubkey.toString();
}

async function main() {
  console.log('🚀 Creating real Solana tokens for all creators...');
  
  const creators = await prisma.creator.findMany();
  
  for (const creator of creators) {
    try {
      await createTokenForCreator(creator);
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`   ❌ Error creating token for ${creator.channelName}:`, error.message);
    }
  }

  console.log('\n✨ All tokens created!');
  await prisma.$disconnect();
}

main().catch(console.error);

