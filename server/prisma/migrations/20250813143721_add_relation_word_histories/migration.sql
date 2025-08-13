-- AlterTable
ALTER TABLE "public"."WordHistories" ADD COLUMN     "userId" TEXT NOT NULL DEFAULT '1d2c4d8a-6166-4d70-b335-5cba0bc3a8c8';

-- AddForeignKey
ALTER TABLE "public"."WordHistories" ADD CONSTRAINT "WordHistories_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
