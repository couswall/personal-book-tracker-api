CREATE UNIQUE INDEX "reading_session_one_open_per_user_book"
ON "ReadingSession" ("userId", "bookId")
WHERE "finishedAt" IS NULL;
