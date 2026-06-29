---
name: fix-teamdb-permissions
description: Fix team-db permission denied errors by correcting file ownership/group in /home/team/.data/
---

# Fix team-db Permission Errors

When `team-db` throws `I/O error (open): permission denied`, it's usually because files in `/home/team/.data/` have wrong group ownership.

## Symptoms
```
error: sync engine operation failed: database error: I/O error (open): permission denied
```

## Fix
Run these commands (requires sudo):

```bash
# Fix group ownership to 'team' on all files
sudo chown -R :team /home/team/.data/

# Set group read+write on all files
sudo chmod -R g+rw /home/team/.data/

# Ensure directory is group-writable
sudo chmod g+rwx /home/team/.data/
```

## Why This Happens
When a different team member executes `team-db`, their processes create files owned by their user/group. Members of the `team` group can't write to files owned by another user's group without `g+rw` and correct group ownership.

## Verification
```bash
ls -la /home/team/.data/
# All files should show `:team` as group and have `rw-rw-r--` or similar
team-db "SELECT 1 as test"
# Should return [{"test":1}]
```