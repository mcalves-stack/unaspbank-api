/*
  Warnings:

  - You are about to drop the column `userId` on the `incomes` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_incomes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "monthlyIncome" DECIMAL NOT NULL DEFAULT 0.0,
    "familyIncome" DECIMAL NOT NULL DEFAULT 0.0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME
);
INSERT INTO "new_incomes" ("created_at", "familyIncome", "id", "monthlyIncome", "updated_at") SELECT "created_at", "familyIncome", "id", "monthlyIncome", "updated_at" FROM "incomes";
DROP TABLE "incomes";
ALTER TABLE "new_incomes" RENAME TO "incomes";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
