/*
  Warnings:

  - Added the required column `shipping_address` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shipping_country` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shipping_street` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shipping_zip` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "shipping_address" TEXT NOT NULL,
ADD COLUMN     "shipping_country" TEXT NOT NULL,
ADD COLUMN     "shipping_state" TEXT,
ADD COLUMN     "shipping_street" TEXT NOT NULL,
ADD COLUMN     "shipping_zip" TEXT NOT NULL;
