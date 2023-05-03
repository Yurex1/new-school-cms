/*
  Warnings:

  - The primary key for the `School` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `date` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `school` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Note` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `schoolId` to the `User` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `isAdmin` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "School" DROP CONSTRAINT "School_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "School_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" DROP COLUMN "date",
DROP COLUMN "school",
ADD COLUMN     "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "schoolId" TEXT NOT NULL,
DROP COLUMN "isAdmin",
ADD COLUMN     "isAdmin" BOOLEAN NOT NULL;

-- DropTable
DROP TABLE "Note";

-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL,
    "fullname" TEXT NOT NULL,
    "locationOfLiving" TEXT NOT NULL,
    "locationOfStudy" TEXT NOT NULL,
    "dateOfBirth" TEXT NOT NULL,
    "specialCategory" TEXT NOT NULL,
    "sex" TEXT NOT NULL,
    "formOfStudy" TEXT NOT NULL,
    "schoolId" TEXT,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE SET NULL ON UPDATE CASCADE;
