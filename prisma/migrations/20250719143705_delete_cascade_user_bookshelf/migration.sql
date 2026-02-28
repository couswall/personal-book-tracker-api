-- DropForeignKey
ALTER TABLE "Bookshelf" DROP CONSTRAINT "Bookshelf_userId_fkey";

-- AddForeignKey
ALTER TABLE "Bookshelf" ADD CONSTRAINT "Bookshelf_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
