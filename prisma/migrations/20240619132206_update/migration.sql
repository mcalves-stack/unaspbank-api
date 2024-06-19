/*
  Warnings:

  - You are about to drop the `incomes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "incomes";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "income" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "monthlyIncome" DECIMAL NOT NULL DEFAULT 0.0,
    "familyIncome" DECIMAL NOT NULL DEFAULT 0.0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
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
    "photo" TEXT,
    CONSTRAINT "users_id_fkey" FOREIGN KEY ("id") REFERENCES "income" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_users" ("cpf", "created_at", "dateOfBirth", "email", "id", "password", "phoneNumber", "photo", "ra", "updated_at") SELECT "cpf", "created_at", "dateOfBirth", "email", "id", "password", "phoneNumber", "photo", "ra", "updated_at" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_ra_key" ON "users"("ra");
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
