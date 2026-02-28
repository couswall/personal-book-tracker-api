-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "pageCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "subtitle" TEXT,
ALTER COLUMN "description" DROP NOT NULL;
