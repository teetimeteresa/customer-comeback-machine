#!/bin/bash
# Centralized lock for team-db to prevent Sqlite locking errors
# Implement a system-wide policy for serial database access.
LOCKFILE="/tmp/team-db.lock"

# Wait up to 60 seconds for the lock, then run team-db
# flock handles the waiting and ensuring only one process runs at a time.
flock -w 60 "$LOCKFILE" team-db "$@"
