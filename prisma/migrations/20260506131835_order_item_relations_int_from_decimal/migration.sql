/*
  Warnings:

  - You are about to alter the column `price_at_purchase` on the `order_items` table. The data in that column could be lost. The data in that column will be cast from `Money` to `Integer`.
  - You are about to drop the `_MovieToOrderItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_OrderToOrderItem` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `movie_id` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order_id` to the `order_items` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_MovieToOrderItem" DROP CONSTRAINT "_MovieToOrderItem_A_fkey";

-- DropForeignKey
ALTER TABLE "_MovieToOrderItem" DROP CONSTRAINT "_MovieToOrderItem_B_fkey";

-- DropForeignKey
ALTER TABLE "_OrderToOrderItem" DROP CONSTRAINT "_OrderToOrderItem_A_fkey";

-- DropForeignKey
ALTER TABLE "_OrderToOrderItem" DROP CONSTRAINT "_OrderToOrderItem_B_fkey";

-- AlterTable
ALTER TABLE "movies" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "order_items" ADD COLUMN     "movie_id" TEXT NOT NULL,
ADD COLUMN     "order_id" TEXT NOT NULL,
DROP COLUMN "price_at_purchase",
ADD COLUMN "price_at_purchase" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_MovieToOrderItem";

-- DropTable
DROP TABLE "_OrderToOrderItem";

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "movies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
