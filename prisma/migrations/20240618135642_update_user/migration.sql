/*
  Warnings:

  - A unique constraint covering the columns `[ra]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "users_ra_key" ON "users"("ra");
