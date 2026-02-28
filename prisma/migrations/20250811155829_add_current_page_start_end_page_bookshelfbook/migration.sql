-- AlterTable
ALTER TABLE "BookshelfBook" ADD COLUMN     "currentPage" INTEGER,
ADD COLUMN     "endReadingDate" TIMESTAMP(3),
ADD COLUMN     "startReadingDate" TIMESTAMP(3);
