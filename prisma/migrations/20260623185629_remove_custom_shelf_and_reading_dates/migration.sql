/*
  Warnings:

  - The values [CUSTOM] on the enum `BookshelfType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `endReadingDate` on the `BookshelfBook` table. All the data in the column will be lost.
  - You are about to drop the column `startReadingDate` on the `BookshelfBook` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BookshelfType_new" AS ENUM ('READ', 'CURRENTLY_READING', 'TO_BE_READ');
ALTER TABLE "Bookshelf" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "Bookshelf" ALTER COLUMN "type" TYPE "BookshelfType_new" USING ("type"::text::"BookshelfType_new");
ALTER TYPE "BookshelfType" RENAME TO "BookshelfType_old";
ALTER TYPE "BookshelfType_new" RENAME TO "BookshelfType";
DROP TYPE "BookshelfType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Bookshelf" ALTER COLUMN "type" DROP DEFAULT;

-- AlterTable
ALTER TABLE "BookshelfBook" DROP COLUMN "endReadingDate",
DROP COLUMN "startReadingDate";
