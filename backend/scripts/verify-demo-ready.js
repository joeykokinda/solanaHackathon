const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function verifyDemoReady() {
  console.log(' Verifying demo setup...\n');
  let allGood = true;
  try {
    const creators = await prisma.creator.findMany({
      include: {
        metricsHistory: true
      }
    });
    console.log(` Database connection: OK`);
    console.log(` Creators in database: ${creators.length}`);
    if (creators.length === 0) {
      console.log(`️  No creators found! Run: cd backend && node scripts/seedFeaturedCreators.js`);
      allGood = false;
    } else {
      console.log(`\n Available creators for demo:`);
      creators.forEach((c, i) => {
        console.log(`   ${i + 1}. ${c.channelName} (${c.initialSubscribers.toLocaleString()} subs)`);
        console.log(`      Token: ${c.tokenAddress}`);
      });
    }
    const transactions = await prisma.transaction.findMany({
      take: 5,
      orderBy: { timestamp: 'desc' }
    });
    console.log(`\n Recent transactions: ${transactions.length}`);
    const users = await prisma.user.count();
    console.log(` Users in database: ${users}`);
    console.log(`\n${'='.repeat(60)}`);
    if (allGood) {
      console.log(' DEMO READY! Everything looks good.');
      console.log('\nQuick start:');
      console.log('1. Backend running? → cd backend && node src/server.js');
      console.log('2. Frontend running? → cd frontend && npm run dev');
      console.log('3. Wallet has SOL? → solana airdrop 2 YOUR_WALLET --url devnet');
      console.log('4. Go to: http://localhost:3000\n');
    } else {
      console.log('️  SETUP INCOMPLETE - See warnings above');
    }
  } catch (error) {
    console.error(' Error:', error.message);
    console.log('\n Tips:');
    console.log('- Make sure backend .env has DATABASE_URL set');
    console.log('- Run: cd backend && npx prisma generate');
    console.log('- Run: cd backend && npx prisma db push');
  } finally {
    await prisma.$disconnect();
  }
}
verifyDemoReady();
