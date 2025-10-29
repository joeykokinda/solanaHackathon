import { Connection, PublicKey, SystemProgram, Transaction, TransactionInstruction, LAMPORTS_PER_SOL, ComputeBudgetProgram } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from '@solana/spl-token';
import { WalletContextState } from '@solana/wallet-adapter-react';
import BN from 'bn.js';

const BONDING_CURVE_PROGRAM_ID = new PublicKey('ASKaLZvuV9TW6MKxNjQoKAQihzEAaVDzMryFqgvzDswi');
const RPC_ENDPOINT = 'https://api.devnet.solana.com';

const bondingCurveIDL = {
  "address": "ASKaLZvuV9TW6MKxNjQoKAQihzEAaVDzMryFqgvzDswi",
  "metadata": {
    "name": "bonding_curve",
    "version": "0.1.0",
    "spec": "0.1.0"
  },
  "instructions": [
    {
      "name": "buy_tokens",
      "discriminator": [189, 21, 230, 133, 247, 2, 110, 42],
      "accounts": [
        { "name": "buyer", "writable": true, "signer": true },
        { "name": "bonding_curve", "writable": true },
        { "name": "sol_vault", "writable": true },
        { "name": "token_vault", "writable": true },
        { "name": "buyer_token_account", "writable": true },
        { "name": "token_program" },
        { "name": "associated_token_program" },
        { "name": "system_program" }
      ],
      "args": [
        { "name": "token_amount", "type": "u64" },
        { "name": "max_sol", "type": "u64" }
      ]
    },
    {
      "name": "sell_tokens",
      "discriminator": [114, 242, 25, 12, 62, 126, 92, 2],
      "accounts": [
        { "name": "seller", "writable": true, "signer": true },
        { "name": "bonding_curve", "writable": true },
        { "name": "sol_vault", "writable": true },
        { "name": "token_vault", "writable": true },
        { "name": "seller_token_account", "writable": true },
        { "name": "token_program" },
        { "name": "system_program" }
      ],
      "args": [
        { "name": "token_amount", "type": "u64" },
        { "name": "min_sol", "type": "u64" }
      ]
    }
  ],
  "accounts": [
    {
      "name": "BondingCurve",
      "discriminator": [23, 183, 248, 55, 96, 216, 172, 96]
    }
  ],
  "types": [
    {
      "name": "BondingCurve",
      "type": {
        "kind": "struct",
        "fields": [
          { "name": "token_mint", "type": "pubkey" },
          { "name": "sol_vault", "type": "pubkey" },
          { "name": "token_vault", "type": "pubkey" },
          { "name": "tokens_bought", "type": "u64" },
          { "name": "base_price", "type": "u64" },
          { "name": "engagement_multiplier", "type": "u64" },
          { "name": "bump", "type": "u8" }
        ]
      }
    }
  ]
};

export async function getBondingCurveAddress(tokenMint: PublicKey): Promise<[PublicKey, number]> {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('bonding_curve'), tokenMint.toBuffer()],
    BONDING_CURVE_PROGRAM_ID
  );
}

function calculateBuyCost(
  currentSupply: bigint,
  amount: bigint,
  basePrice: bigint,
  engagementMultiplier: bigint
): bigint {
  const SCALE_FACTOR = BigInt(1_000_000_000);
  
  const supplyBeforeTokens = currentSupply / SCALE_FACTOR;
  let amountTokens = amount / SCALE_FACTOR;
  if (amountTokens === BigInt(0)) {
    amountTokens = BigInt(1);
  }
  const supplyAfterTokens = supplyBeforeTokens + amountTokens;
  
  const curveBefore = (supplyBeforeTokens * supplyBeforeTokens) / BigInt(10_000);
  const curveAfter = (supplyAfterTokens * supplyAfterTokens) / BigInt(10_000);
  
  const priceBefore = basePrice + curveBefore;
  const priceAfter = basePrice + curveAfter;
  const avgPrice = (priceBefore + priceAfter) / BigInt(2);
  
  const totalCost = (avgPrice * amount) / SCALE_FACTOR;
  const finalCost = (totalCost * engagementMultiplier) / SCALE_FACTOR;
  
  return finalCost;
}

function calculateSellReturn(
  currentSupply: bigint,
  amount: bigint,
  basePrice: bigint,
  engagementMultiplier: bigint
): bigint {
  const SCALE_FACTOR = BigInt(1_000_000_000);
  
  const supplyBeforeTokens = currentSupply / SCALE_FACTOR;
  let amountTokens = amount / SCALE_FACTOR;
  if (amountTokens === BigInt(0)) {
    amountTokens = BigInt(1);
  }
  const supplyAfterTokens = supplyBeforeTokens > amountTokens 
    ? supplyBeforeTokens - amountTokens 
    : BigInt(0);
  
  const curveBefore = (supplyBeforeTokens * supplyBeforeTokens) / BigInt(10_000);
  const curveAfter = (supplyAfterTokens * supplyAfterTokens) / BigInt(10_000);
  
  const priceBefore = basePrice + curveBefore;
  const priceAfter = basePrice + curveAfter;
  const avgPrice = (priceBefore + priceAfter) / BigInt(2);
  
  const totalReturn = (avgPrice * amount) / SCALE_FACTOR;
  const finalReturn = (totalReturn * engagementMultiplier) / SCALE_FACTOR;
  
  return finalReturn;
}

export async function getConnection(): Promise<Connection> {
  return new Connection(RPC_ENDPOINT, 'confirmed');
}

export async function getUserTokenBalance(
  walletPublicKey: string,
  tokenMintAddress: string
): Promise<number> {
  try {
    const connection = await getConnection();
    const tokenMint = new PublicKey(tokenMintAddress);
    const walletPubkey = new PublicKey(walletPublicKey);
    
    const tokenAccount = await getAssociatedTokenAddress(
      tokenMint,
      walletPubkey,
      false
    );
    
    const accountInfo = await connection.getTokenAccountBalance(tokenAccount);
    return Number(accountInfo.value.amount) / 1e9;
  } catch (error) {
    return 0;
  }
}

export async function getTokensFromSolBuy(
  tokenMintAddress: string,
  solAmount: number
): Promise<number> {
  try {
    const connection = await getConnection();
    const tokenMint = new PublicKey(tokenMintAddress);
    const [bondingCurve] = await getBondingCurveAddress(tokenMint);
    
    const bondingCurveAccount = await connection.getAccountInfo(bondingCurve);
    if (!bondingCurveAccount) {
      throw new Error('Bonding curve not initialized');
    }
    
    const bondingCurveData = deserializeBondingCurve(bondingCurveAccount.data);
    
    const targetSolLamports = BigInt(Math.floor(solAmount * LAMPORTS_PER_SOL));
    
    let low = BigInt(1_000_000);
    let high = BigInt(1_000_000_000) * BigInt(1_000_000_000);
    let bestTokens = BigInt(0);
    
    for (let i = 0; i < 60; i++) {
      const mid = (low + high) / BigInt(2);
      const cost = calculateBuyCost(
        BigInt(bondingCurveData.tokens_bought.toString()),
        mid,
        BigInt(bondingCurveData.base_price.toString()),
        BigInt(bondingCurveData.engagement_multiplier.toString())
      );
      
      if (cost <= targetSolLamports) {
        bestTokens = mid;
        low = mid + BigInt(1);
      } else {
        high = mid - BigInt(1);
      }
      
      if (high <= low) break;
    }
    
    if (bestTokens === BigInt(0)) {
      const directCalc = (targetSolLamports * BigInt(1e9)) / BigInt(bondingCurveData.base_price.toString());
      return Math.max(1, Number(directCalc) / 1e9);
    }
    
    return Math.max(1, Number(bestTokens) / 1e9);
  } catch (error) {
    console.error('Error calculating tokens from SOL:', error);
    return Math.floor(solAmount / 0.000001);
  }
}

export async function getTokensFromSolSell(
  tokenMintAddress: string,
  solAmount: number
): Promise<number> {
  try {
    const connection = await getConnection();
    const tokenMint = new PublicKey(tokenMintAddress);
    const [bondingCurve] = await getBondingCurveAddress(tokenMint);
    
    const bondingCurveAccount = await connection.getAccountInfo(bondingCurve);
    if (!bondingCurveAccount) {
      throw new Error('Bonding curve not initialized');
    }
    
    const bondingCurveData = deserializeBondingCurve(bondingCurveAccount.data);
    
    const targetSolLamports = BigInt(Math.floor(solAmount * LAMPORTS_PER_SOL));
    const maxTokens = BigInt(bondingCurveData.tokens_bought.toString());
    
    if (maxTokens === BigInt(0)) {
      return 0;
    }
    
    let low = BigInt(1_000_000);
    let high = maxTokens;
    let bestTokens = BigInt(0);
    
    for (let i = 0; i < 60; i++) {
      const mid = (low + high) / BigInt(2);
      const returnAmount = calculateSellReturn(
        BigInt(bondingCurveData.tokens_bought.toString()),
        mid,
        BigInt(bondingCurveData.base_price.toString()),
        BigInt(bondingCurveData.engagement_multiplier.toString())
      );
      
      if (returnAmount <= targetSolLamports) {
        bestTokens = mid;
        low = mid + BigInt(1);
      } else {
        high = mid - BigInt(1);
      }
      
      if (high <= low) break;
    }
    
    return Math.max(0.001, Number(bestTokens) / 1e9);
  } catch (error) {
    console.error('Error calculating tokens from SOL sell:', error);
    return 0;
  }
}

export async function getActualBuyCost(
  tokenMintAddress: string,
  amount: number
): Promise<number> {
  const connection = await getConnection();
  const tokenMint = new PublicKey(tokenMintAddress);
  const [bondingCurve] = await getBondingCurveAddress(tokenMint);
  
  const bondingCurveAccount = await connection.getAccountInfo(bondingCurve);
  if (!bondingCurveAccount) {
    throw new Error('Bonding curve not initialized');
  }
  
  const bondingCurveData = deserializeBondingCurve(bondingCurveAccount.data);
  
  const actualCost = calculateBuyCost(
    BigInt(bondingCurveData.tokens_bought.toString()),
    BigInt(Math.floor(amount * 1e9)),
    BigInt(bondingCurveData.base_price.toString()),
    BigInt(bondingCurveData.engagement_multiplier.toString())
  );
  
  return Number(actualCost) / LAMPORTS_PER_SOL;
}

export async function getActualSellReturn(
  tokenMintAddress: string,
  amount: number
): Promise<number> {
  const connection = await getConnection();
  const tokenMint = new PublicKey(tokenMintAddress);
  const [bondingCurve] = await getBondingCurveAddress(tokenMint);
  
  const bondingCurveAccount = await connection.getAccountInfo(bondingCurve);
  if (!bondingCurveAccount) {
    throw new Error('Bonding curve not initialized');
  }
  
  const bondingCurveData = deserializeBondingCurve(bondingCurveAccount.data);
  
  const actualReturn = calculateSellReturn(
    BigInt(bondingCurveData.tokens_bought.toString()),
    BigInt(Math.floor(amount * 1e9)),
    BigInt(bondingCurveData.base_price.toString()),
    BigInt(bondingCurveData.engagement_multiplier.toString())
  );
  
  return Number(actualReturn) / LAMPORTS_PER_SOL;
}

export async function buyTokens(
  wallet: WalletContextState,
  tokenMintAddress: string,
  amount: number,
  maxSolAmount: number
): Promise<string> {
  if (!wallet.publicKey || !wallet.signTransaction) {
    throw new Error('Wallet not connected');
  }

  const connection = await getConnection();
  const tokenMint = new PublicKey(tokenMintAddress);
  const [bondingCurve] = await getBondingCurveAddress(tokenMint);

  const bondingCurveAccount = await connection.getAccountInfo(bondingCurve);
  if (!bondingCurveAccount) {
    throw new Error('Bonding curve not initialized for this token');
  }

  const bondingCurveData = deserializeBondingCurve(bondingCurveAccount.data);
  const solVault = bondingCurveData.sol_vault;
  const tokenVault = bondingCurveData.token_vault;

  const buyerTokenAccount = await getAssociatedTokenAddress(
    tokenMint,
    wallet.publicKey,
    false,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );

  const transaction = new Transaction();

  transaction.add(
    ComputeBudgetProgram.setComputeUnitLimit({ units: 1_400_000 })
  );
  transaction.add(
    ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 100 })
  );

  // Check if buyer's token account exists, if not, create it
  const buyerAccountInfo = await connection.getAccountInfo(buyerTokenAccount);
  if (!buyerAccountInfo) {
    const { createAssociatedTokenAccountInstruction } = await import('@solana/spl-token');
    transaction.add(
      createAssociatedTokenAccountInstruction(
        wallet.publicKey,
        buyerTokenAccount,
        wallet.publicKey,
        tokenMint
      )
    );
  }

  const tokenAmountBN = new BN(amount * 1e9);
  
  const actualCost = calculateBuyCost(
    BigInt(bondingCurveData.tokens_bought.toString()),
    BigInt(Math.floor(amount * 1e9)),
    BigInt(bondingCurveData.base_price.toString()),
    BigInt(bondingCurveData.engagement_multiplier.toString())
  );
  
  const slippageFactor = BigInt(Math.floor(1.2 * 1e9));
  const maxSolLamports = (actualCost * slippageFactor) / BigInt(1e9);
  const maxSolBN = new BN(maxSolLamports.toString());

  const instruction = createBuyInstruction(
    wallet.publicKey,
    bondingCurve,
    solVault,
    tokenVault,
    buyerTokenAccount,
    tokenAmountBN,
    maxSolBN
  );

  transaction.add(instruction);
  transaction.feePayer = wallet.publicKey;
  transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

  const signed = await wallet.signTransaction(transaction);
  const signature = await connection.sendRawTransaction(signed.serialize());
  await connection.confirmTransaction(signature, 'confirmed');

  const actualMaxSol = Number(maxSolLamports) / LAMPORTS_PER_SOL;
  await recordTransaction(signature, wallet.publicKey.toString(), tokenMintAddress, 'buy', amount, actualMaxSol);

  return signature;
}

export async function sellTokens(
  wallet: WalletContextState,
  tokenMintAddress: string,
  amount: number,
  minSolAmount: number
): Promise<string> {
  if (!wallet.publicKey || !wallet.signTransaction) {
    throw new Error('Wallet not connected');
  }

  const connection = await getConnection();
  const tokenMint = new PublicKey(tokenMintAddress);
  const [bondingCurve] = await getBondingCurveAddress(tokenMint);

  const bondingCurveAccount = await connection.getAccountInfo(bondingCurve);
  if (!bondingCurveAccount) {
    throw new Error('Bonding curve not initialized for this token');
  }

  const bondingCurveData = deserializeBondingCurve(bondingCurveAccount.data);
  const solVault = bondingCurveData.sol_vault;
  const tokenVault = bondingCurveData.token_vault;

  const sellerTokenAccount = await getAssociatedTokenAddress(
    tokenMint,
    wallet.publicKey,
    false,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );

  const tokenAmountBN = new BN(amount * 1e9);
  
  const actualReturn = calculateSellReturn(
    BigInt(bondingCurveData.tokens_bought.toString()),
    BigInt(Math.floor(amount * 1e9)),
    BigInt(bondingCurveData.base_price.toString()),
    BigInt(bondingCurveData.engagement_multiplier.toString())
  );
  
  const slippageFactor = BigInt(Math.floor(0.8 * 1e9));
  const minSolLamports = (actualReturn * slippageFactor) / BigInt(1e9);
  const minSolBN = new BN(minSolLamports.toString());

  const transaction = new Transaction();

  transaction.add(
    ComputeBudgetProgram.setComputeUnitLimit({ units: 1_400_000 })
  );
  transaction.add(
    ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 100 })
  );

  const instruction = createSellInstruction(
    wallet.publicKey,
    bondingCurve,
    solVault,
    tokenVault,
    sellerTokenAccount,
    tokenAmountBN,
    minSolBN
  );

  transaction.add(instruction);
  transaction.feePayer = wallet.publicKey;
  transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

  const signed = await wallet.signTransaction(transaction);
  const signature = await connection.sendRawTransaction(signed.serialize());
  await connection.confirmTransaction(signature, 'confirmed');

  const actualMinSol = Number(minSolLamports) / LAMPORTS_PER_SOL;
  await recordTransaction(signature, wallet.publicKey.toString(), tokenMintAddress, 'sell', amount, actualMinSol);

  return signature;
}

function createBuyInstruction(
  buyer: PublicKey,
  bondingCurve: PublicKey,
  solVault: PublicKey,
  tokenVault: PublicKey,
  buyerTokenAccount: PublicKey,
  tokenAmount: BN,
  maxSol: BN
): TransactionInstruction {
  const discriminator = Buffer.from([189, 21, 230, 133, 247, 2, 110, 42]);
  const tokenAmountBytes = tokenAmount.toArrayLike(Buffer, 'le', 8);
  const maxSolBytes = maxSol.toArrayLike(Buffer, 'le', 8);
  const data = Buffer.concat([discriminator, tokenAmountBytes, maxSolBytes]);

  return new TransactionInstruction({
    keys: [
      { pubkey: buyer, isSigner: true, isWritable: true },
      { pubkey: bondingCurve, isSigner: false, isWritable: true },
      { pubkey: solVault, isSigner: false, isWritable: true },
      { pubkey: tokenVault, isSigner: false, isWritable: true },
      { pubkey: buyerTokenAccount, isSigner: false, isWritable: true },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      { pubkey: ASSOCIATED_TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    ],
    programId: BONDING_CURVE_PROGRAM_ID,
    data,
  });
}

function createSellInstruction(
  seller: PublicKey,
  bondingCurve: PublicKey,
  solVault: PublicKey,
  tokenVault: PublicKey,
  sellerTokenAccount: PublicKey,
  tokenAmount: BN,
  minSol: BN
): TransactionInstruction {
  const discriminator = Buffer.from([114, 242, 25, 12, 62, 126, 92, 2]);
  const tokenAmountBytes = tokenAmount.toArrayLike(Buffer, 'le', 8);
  const minSolBytes = minSol.toArrayLike(Buffer, 'le', 8);
  const data = Buffer.concat([discriminator, tokenAmountBytes, minSolBytes]);

  return new TransactionInstruction({
    keys: [
      { pubkey: seller, isSigner: true, isWritable: true },
      { pubkey: bondingCurve, isSigner: false, isWritable: true },
      { pubkey: solVault, isSigner: false, isWritable: true },
      { pubkey: tokenVault, isSigner: false, isWritable: true },
      { pubkey: sellerTokenAccount, isSigner: false, isWritable: true },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    ],
    programId: BONDING_CURVE_PROGRAM_ID,
    data,
  });
}

function deserializeBondingCurve(data: Buffer): {
  token_mint: PublicKey;
  sol_vault: PublicKey;
  token_vault: PublicKey;
  tokens_bought: BN;
  base_price: BN;
  engagement_multiplier: BN;
  bump: number;
} {
  const discriminator = data.slice(0, 8);
  const token_mint = new PublicKey(data.slice(8, 40));
  const sol_vault = new PublicKey(data.slice(40, 72));
  const token_vault = new PublicKey(data.slice(72, 104));
  const tokens_bought = new BN(data.slice(104, 112), 'le');
  const base_price = new BN(data.slice(112, 120), 'le');
  const engagement_multiplier = new BN(data.slice(120, 128), 'le');
  const bump = data[128];

  return {
    token_mint,
    sol_vault,
    token_vault,
    tokens_bought,
    base_price,
    engagement_multiplier,
    bump,
  };
}

async function recordTransaction(
  signature: string,
  wallet: string,
  tokenAddress: string,
  type: 'buy' | 'sell',
  tokenAmount: number,
  solAmount: number
): Promise<void> {
  try {
    await fetch('http://localhost:3001/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        signature,
        wallet,
        tokenAddress,
        type,
        tokenAmount,
        solAmount,
      }),
    });
  } catch (error) {
    console.error('Failed to record transaction:', error);
  }
}

