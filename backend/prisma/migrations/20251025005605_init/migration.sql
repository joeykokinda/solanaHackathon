-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "wallet" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Creator" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "youtubeChannelId" TEXT NOT NULL,
    "channelName" TEXT NOT NULL,
    "channelAvatar" TEXT,
    "tokenAddress" TEXT NOT NULL,
    "initialSubscribers" INTEGER NOT NULL,
    "initialAvgViews" INTEGER NOT NULL,
    "launchDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'active',

    CONSTRAINT "Creator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MetricsHistory" (
    "id" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "subscribers" INTEGER NOT NULL,
    "totalViews" BIGINT NOT NULL,
    "videoCount" INTEGER NOT NULL,
    "avgViews" INTEGER NOT NULL,
    "engagementRate" DOUBLE PRECISION NOT NULL,
    "uploadFrequency" DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MetricsHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "tokenAddress" TEXT NOT NULL,
    "buyerWallet" TEXT NOT NULL,
    "txSignature" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "tokenAmount" BIGINT NOT NULL,
    "solAmount" BIGINT NOT NULL,
    "pricePerToken" DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_wallet_key" ON "User"("wallet");

-- CreateIndex
CREATE UNIQUE INDEX "Creator_userId_key" ON "Creator"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Creator_youtubeChannelId_key" ON "Creator"("youtubeChannelId");

-- CreateIndex
CREATE UNIQUE INDEX "Creator_tokenAddress_key" ON "Creator"("tokenAddress");

-- CreateIndex
CREATE INDEX "MetricsHistory_creatorId_timestamp_idx" ON "MetricsHistory"("creatorId", "timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_txSignature_key" ON "Transaction"("txSignature");

-- CreateIndex
CREATE INDEX "Transaction_tokenAddress_timestamp_idx" ON "Transaction"("tokenAddress", "timestamp");

-- CreateIndex
CREATE INDEX "Transaction_buyerWallet_timestamp_idx" ON "Transaction"("buyerWallet", "timestamp");

-- AddForeignKey
ALTER TABLE "Creator" ADD CONSTRAINT "Creator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MetricsHistory" ADD CONSTRAINT "MetricsHistory_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Creator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
