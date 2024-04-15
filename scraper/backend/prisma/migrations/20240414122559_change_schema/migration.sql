/*
  Warnings:

  - You are about to drop the column `usernames` on the `ScrapSession` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "scrapSessionId" TEXT;

-- AlterTable
ALTER TABLE "ScrapSession" DROP COLUMN "usernames";

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_scrapSessionId_fkey" FOREIGN KEY ("scrapSessionId") REFERENCES "ScrapSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;
