-- CreateTable
CREATE TABLE "ReadingChallenge" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "goal" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "ReadingChallenge_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ReadingChallenge_userId_year_key" ON "ReadingChallenge"("userId", "year");

-- CreateIndex
CREATE INDEX "ReadingSession_userId_finishedAt_idx" ON "ReadingSession"("userId", "finishedAt");

-- AddForeignKey
ALTER TABLE "ReadingChallenge" ADD CONSTRAINT "ReadingChallenge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
