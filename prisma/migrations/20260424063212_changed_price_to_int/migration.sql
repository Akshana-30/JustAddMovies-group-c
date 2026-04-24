/*
  Warnings:

  - You are about to alter the column `price` on the `movies` table. The data in that column could be lost. The data in that column will be cast from `Money` to `Integer`.

*/
-- AlterTable
ALTER TABLE "movies" ALTER COLUMN "price" SET DATA TYPE INTEGER USING price::numeric::integer;
