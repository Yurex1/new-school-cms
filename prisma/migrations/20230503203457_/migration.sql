/*
  Warnings:

  - You are about to drop the column `fullname` on the `Student` table. All the data in the column will be lost.
  - Added the required column `fullName` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Student" DROP COLUMN "fullname",
ADD COLUMN     "fullName" TEXT NOT NULL;
