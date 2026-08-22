PRAGMA foreign_keys = FALSE;

BEGIN;

CREATE TABLE IF NOT EXISTS server ( 
	id TEXT PRIMARY KEY, 
	name TEXT NOT NULL, 
	type TEXT NOT NULL, 
	running BOOLEAN DEFAULT FALSE, 
	"max-limit" INT, 
	entrypoint TEXT NOT NULL
);

PRAGMA user_version = 1;

COMMIT;

PRAGMA foreign_keys = TRUE;
