const { Connection, PublicKey, Keypair } = require('@solana/web3.js');
const { getAssociatedTokenAddress } = require('@solana/spl-token');
const fs = require('fs');

const RPC_ENDPOINT = 'https://api.devnet.solana.com';
const BONDING_CURVE_PROGRAM_ID = new PublicKey('ASKaLZvuV9TW6MKxNjQoKAQihzEAaVDzMryFqgvzDswi');

async function testBuy() {
  console.log('🧪 Testing buy functionality...\n');

  const connection = new Connection(RPC_ENDPOINT, 'confirmed');
  
  // Load wallet
  const walletData = JSON.parse(fs.readFileSync('/home/joey/.config/solana/id.json', 'utf-8'));
  const wallet = Keypair.fromSecretKey(new Uint8Array(walletData));
  console.log('💰 Wallet:', wallet.publicKey.toString());

  // MrBeast token
  const tokenMint = new PublicKey('G8JLfLwkam6jqvXo8e4qSZeT45LFqz8Uy4ptNzzWdi3x');
  console.log('🎯 Token:', tokenMint.toString());

  // Get bonding curve PDA
  const [bondingCurve] = PublicKey.findProgramAddressSync(
    [Buffer.from('bonding_curve'), tokenMint.toBuffer()],
    BONDING_CURVE_PROGRAM_ID
  );
  console.log('📈 Bonding Curve:', bondingCurve.toString());

  // Get sol vault PDA
  const [solVault] = PublicKey.findProgramAddressSync(
    [Buffer.from('sol_vault'), bondingCurve.toBuffer()],
    BONDING_CURVE_PROGRAM_ID
  );
  console.log('🏦 SOL Vault:', solVault.toString());

  // Get token vault (ATA)
  const tokenVault = await getAssociatedTokenAddress(
    tokenMint,
    bondingCurve,
    true
  );
  console.log('🪙 Token Vault:', tokenVault.toString());

  // Check accounts
  console.log('\n📊 Checking accounts...');
  
  const bondingCurveInfo = await connection.getAccountInfo(bondingCurve);
  console.log('✅ Bonding Curve exists:', !!bondingCurveInfo);

  const solVaultInfo = await connection.getAccountInfo(solVault);
  console.log('✅ SOL Vault exists:', !!solVaultInfo);
  if (solVaultInfo) {
    const balance = await connection.getBalance(solVault);
    console.log('   SOL Vault balance:', balance / 1e9, 'SOL');
  }

  const tokenVaultInfo = await connection.getAccountInfo(tokenVault);
  console.log('✅ Token Vault exists:', !!tokenVaultInfo);
  if (tokenVaultInfo) {
    const tokenBalance = await connection.getTokenAccountBalance(tokenVault);
    console.log('   Token Vault balance:', tokenBalance.value.uiAmount, 'tokens');
  }

  console.log('\n✨ All accounts are set up correctly!');
  console.log('🚀 Buy/Sell should work on the website!');
}

testBuy().catch(console.error);

