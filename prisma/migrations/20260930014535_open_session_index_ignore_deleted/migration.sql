-- Only one open (unfinished) reading session per user and book, ignoring
-- soft-deleted sessions. Deleted open sessions (e.g. after removing a book
-- or moving it from Currently Reading to To Be Read) must not block a new one.
DROP INDEX "reading_session_one_open_per_user_book";

CREATE UNIQUE INDEX "reading_session_one_open_per_user_book"
ON "ReadingSession" ("userId", "bookId")
WHERE "finishedAt" IS NULL AND "deletedAt" IS NULL;
