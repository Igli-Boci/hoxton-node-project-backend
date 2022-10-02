-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Offer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "minuts" TEXT NOT NULL,
    "mb" TEXT NOT NULL,
    "sms" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "icon" TEXT NOT NULL DEFAULT '',
    "userId" INTEGER,
    CONSTRAINT "Offer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Offer" ("duration", "icon", "id", "mb", "minuts", "name", "price", "sms", "userId") SELECT "duration", "icon", "id", "mb", "minuts", "name", "price", "sms", "userId" FROM "Offer";
DROP TABLE "Offer";
ALTER TABLE "new_Offer" RENAME TO "Offer";
CREATE UNIQUE INDEX "Offer_name_key" ON "Offer"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
