/*
  Warnings:

  - Changed the type of `fid` on the `Profile` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "fid",
ADD COLUMN     "fid" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "ScrapSession" (
    "id" TEXT NOT NULL,
    "usernames" TEXT[],

    CONSTRAINT "ScrapSession_pkey" PRIMARY KEY ("id")
);
