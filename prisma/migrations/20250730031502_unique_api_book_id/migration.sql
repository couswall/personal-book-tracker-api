/*
  Warnings:

  - You are about to drop the column `googleBookId` on the `Book` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[apiBookId]` on the table `Book` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `apiBookId` to the `Book` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Book" DROP COLUMN "googleBookId",
ADD COLUMN     "apiBookId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Book_apiBookId_key" ON "Book"("apiBookId");
