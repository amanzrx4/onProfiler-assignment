/*
  Warnings:

  - Added the required column `name` to the `ScrapSession` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ScrapSession" ADD COLUMN     "name" TEXT NOT NULL;
