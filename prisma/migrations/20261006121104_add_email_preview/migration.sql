-- CreateTable
CREATE TABLE "email_previews" (
    "email" TEXT NOT NULL,
    "preview_url" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "email_previews_pkey" PRIMARY KEY ("email")
);
