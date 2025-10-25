# 🚀 Deployed Contract Addresses (Solana Devnet)

## Smart Contracts - LIVE ON DEVNET ✅

### Token Factory Program
```
Program ID: 7yNsJvKUNgxdAHgCRY2SWb7GqsaL5HxTgSfpraHQCYdh
Network: Devnet
Explorer: https://explorer.solana.com/address/7yNsJvKUNgxdAHgCRY2SWb7GqsaL5HxTgSfpraHQCYdh?cluster=devnet
```

### Bonding Curve Program
```
Program ID: ASKaLZvuV9TW6MKxNjQoKAQihzEAaVDzMryFqgvzDswi
Network: Devnet
Explorer: https://explorer.solana.com/address/ASKaLZvuV9TW6MKxNjQoKAQihzEAaVDzMryFqgvzDswi?cluster=devnet
```

## Deploy Command Used

```bash
cd /home/joey/Projects/BSProjects/solanaHackahton/contracts
solana config set --url devnet
solana airdrop 2
solana-keygen new -o target/deploy/token_factory-keypair.json --force
solana-keygen new -o target/deploy/bonding_curve-keypair.json --force
anchor build
anchor deploy
```

## Next Steps

Now run:
```bash
cd /home/joey/Projects/BSProjects/solanaHackahton/contracts
anchor build
anchor deploy
```

This will properly deploy with the IDL files now that the program IDs match.

## Environment Variables

Update these in your backend `.env` and frontend `.env.local`:

```env
TOKEN_FACTORY_PROGRAM_ID="7yNsJvKUNgxdAHgCRY2SWb7GqsaL5HxTgSfpraHQCYdh"
BONDING_CURVE_PROGRAM_ID="ASKaLZvuV9TW6MKxNjQoKAQihzEAaVDzMryFqgvzDswi"
```

---

Deployed: October 25, 2025
Network: Solana Devnet
Status: ✅ LIVE

