/*
  Warnings:

  - Added the required column `userId` to the `incomes` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_incomes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "monthlyIncome" DECIMAL NOT NULL DEFAULT 0.0,
    "familyIncome" DECIMAL NOT NULL DEFAULT 0.0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME,
    "userId" TEXT NOT NULL,
    CONSTRAINT "incomes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_incomes" ("created_at", "familyIncome", "id", "monthlyIncome", "updated_at") SELECT "created_at", "familyIncome", "id", "monthlyIncome", "updated_at" FROM "incomes";
DROP TABLE "incomes";
ALTER TABLE "new_incomes" RENAME TO "incomes";
CREATE UNIQUE INDEX "incomes_userId_key" ON "incomes"("userId");
CREATE TABLE "new_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ra" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "dateOfBirth" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME,
    "photo" TEXT
);
INSERT INTO "new_users" ("cpf", "created_at", "dateOfBirth", "email", "id", "password", "phoneNumber", "photo", "ra", "updated_at") SELECT "cpf", "created_at", "dateOfBirth", "email", "id", "password", "phoneNumber", "photo", "ra", "updated_at" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_ra_key" ON "users"("ra");
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
