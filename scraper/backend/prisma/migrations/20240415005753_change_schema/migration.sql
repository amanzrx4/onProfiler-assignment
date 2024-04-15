/*
  Warnings:

  - Made the column `scrapSessionId` on table `Profile` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `updatedAt` to the `ScrapSession` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_scrapSessionId_fkey";

-- AlterTable
ALTER TABLE "Profile" ALTER COLUMN "scrapSessionId" SET NOT NULL;

-- AlterTable
ALTER TABLE "ScrapSession" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_scrapSessionId_fkey" FOREIGN KEY ("scrapSessionId") REFERENCES "ScrapSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
