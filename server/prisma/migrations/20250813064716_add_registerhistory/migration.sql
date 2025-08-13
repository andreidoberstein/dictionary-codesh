-- CreateTable
CREATE TABLE "public"."WordHistories" (
    "id" TEXT NOT NULL,
    "wordId" TEXT NOT NULL,
    "accessedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WordHistories_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."WordHistories" ADD CONSTRAINT "WordHistories_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "public"."words"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
