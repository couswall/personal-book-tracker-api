/*
  Warnings:

  - You are about to drop the column `readingStatus` on the `BookshelfBook` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BookshelfBook" DROP COLUMN "readingStatus";

-- DropEnum
DROP TYPE "ReadingStatus";
