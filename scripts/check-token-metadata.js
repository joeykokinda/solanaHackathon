const { Connection, PublicKey } = require('@solana/web3.js');

const SOLANA_RPC = 'https://api.devnet.solana.com';
const MPL_TOKEN_METADATA_PROGRAM_ID = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s';

async function checkTokenMetadata(tokenMintAddress) {
  const connection = new Connection(SOLANA_RPC, 'confirmed');
  
  try {
    const mintPubkey = new PublicKey(tokenMintAddress);
    
    const [metadataPDA] = PublicKey.findProgramAddressSync(
      [
        Buffer.from('metadata'),
        new PublicKey(MPL_TOKEN_METADATA_PROGRAM_ID).toBuffer(),
        mintPubkey.toBuffer(),
      ],
      new PublicKey(MPL_TOKEN_METADATA_PROGRAM_ID)
    );
    
    console.log(`\nChecking metadata for token: ${tokenMintAddress}`);
    console.log(`Metadata PDA: ${metadataPDA.toString()}\n`);
    
    const accountInfo = await connection.getAccountInfo(metadataPDA);
    
    if (!accountInfo) {
      console.log('❌ NO METADATA FOUND');
      console.log('This token was created without Metaplex metadata.');
      console.log('\nTo fix:');
      console.log('1. Manually add token to Phantom using mint address');
      console.log('2. Or create metadata for this token (requires authority)');
      return;
    }
    
    console.log('✅ METADATA EXISTS');
    console.log(`Data length: ${accountInfo.data.length} bytes`);
    
    const nameStart = 1 + 32 + 32 + 4;
    const name = accountInfo.data.slice(nameStart, nameStart + 32).toString('utf8').replace(/\0/g, '').trim();
    
    const symbolStart = nameStart + 32 + 4;
    const symbol = accountInfo.data.slice(symbolStart, symbolStart + 10).toString('utf8').replace(/\0/g, '').trim();
    
    console.log(`\nToken Name: "${name}"`);
    console.log(`Token Symbol: "${symbol}"`);
    
    if (!name || name.length === 0) {
      console.log('\n⚠️  WARNING: Metadata exists but name is empty!');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

const tokenAddress = process.argv[2];

if (!tokenAddress) {
  console.log('Usage: node check-token-metadata.js <TOKEN_MINT_ADDRESS>');
  console.log('\nExample:');
  console.log('node check-token-metadata.js G8JLfWdl3x...(full address)');
  process.exit(1);
}

checkTokenMetadata(tokenAddress);

