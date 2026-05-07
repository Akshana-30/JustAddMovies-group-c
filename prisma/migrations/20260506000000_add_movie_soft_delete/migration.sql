-- AlterTable: add soft-delete timestamp to movies
ALTER TABLE "movies" ADD COLUMN "deleted_at" TIMESTAMP(3);
