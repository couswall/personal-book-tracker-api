-- DropForeignKey
ALTER TABLE "BookshelfBook" DROP CONSTRAINT "BookshelfBook_bookId_fkey";

-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "BookshelfBook" ADD CONSTRAINT "BookshelfBook_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;
