-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "balance" TEXT NOT NULL DEFAULT '100'
);
INSERT INTO "new_User" ("balance", "email", "id", "name", "number", "password") SELECT "balance", "email", "id", "name", "number", "password" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_number_key" ON "User"("number");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
