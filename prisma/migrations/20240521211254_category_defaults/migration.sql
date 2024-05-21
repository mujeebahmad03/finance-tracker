-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Transaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amount" REAL NOT NULL,
    "description" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'income',
    "category" TEXT NOT NULL DEFAULT 'Uncategorized',
    "categoryIcon" TEXT NOT NULL DEFAULT '📝'
);
INSERT INTO "new_Transaction" ("amount", "category", "categoryIcon", "createdAt", "date", "description", "id", "type", "updatedAt", "userId") SELECT "amount", "category", "categoryIcon", "createdAt", "date", "description", "id", "type", "updatedAt", "userId" FROM "Transaction";
DROP TABLE "Transaction";
ALTER TABLE "new_Transaction" RENAME TO "Transaction";
PRAGMA foreign_key_check("Transaction");
PRAGMA foreign_keys=ON;
