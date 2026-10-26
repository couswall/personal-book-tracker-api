-- CreateEnum
CREATE TYPE "ReadingProgressType" AS ENUM ('PAGE', 'PERCENTAGE');

-- AlterTable
ALTER TABLE "BookshelfBook" ADD COLUMN     "progressType" "ReadingProgressType";
