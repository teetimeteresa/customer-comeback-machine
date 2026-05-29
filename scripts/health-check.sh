#!/bin/bash

# Customer Comeback Machine - Health Check Script
# This script verifies the production readiness of the application.

PROJECT_DIR="/home/team/shared"
cd $PROJECT_DIR

echo "=========================================="
echo "   CUSTOMER COMEBACK MACHINE HEALTH CHECK"
echo "=========================================="
echo "Timestamp: $(date)"
echo ""

# 1. Check Environment Variables
echo "[1/4] Checking Environment Configuration..."
if [ ! -f .env ]; then
    echo "❌ ERROR: .env file missing!"
else
    # Check for placeholders
    PLACEHOLDERS=$(grep "placeholder" .env | wc -l)
    if [ $PLACEHOLDERS -gt 0 ]; then
        echo "⚠️  WARNING: $PLACEHOLDERS placeholder(s) still present in .env"
    else
        echo "✅ .env looks populated (no placeholders found)."
    fi

    # Check Specific Keys
    grep "STRIPE_SECRET_KEY=sk_" .env > /dev/null && echo "  ✅ STRIPE_SECRET_KEY format valid." || echo "  ❌ STRIPE_SECRET_KEY missing or invalid format (should start with sk_)."
    grep "OPENAI_API_KEY=sk-" .env > /dev/null && echo "  ✅ OPENAI_API_KEY format valid." || echo "  ❌ OPENAI_API_KEY missing or invalid format (should start with sk-)."
    grep "RESEND_API_KEY=re_" .env > /dev/null && echo "  ✅ RESEND_API_KEY format valid." || echo "  ❌ RESEND_API_KEY missing or invalid format (should start with re_)."
    grep "TURSO_DATABASE_URL=libsql://" .env > /dev/null && echo "  ✅ TURSO_DATABASE_URL format valid." || echo "  ❌ TURSO_DATABASE_URL missing or invalid format."
fi
echo ""

# 2. Check Database Connectivity
echo "[2/4] Checking Database Connectivity..."
DB_CHECK=$(team-db "SELECT 1" 2>&1)
if [[ $DB_CHECK == *"1"* ]]; then
    echo "✅ Database is reachable and responding."
else
    echo "❌ ERROR: Database unreachable!"
    echo "Details: $DB_CHECK"
fi
echo ""

# 3. Check Database Schema Integrity
echo "[3/4] Checking Database Schema..."
REQUIRED_TABLES=("users" "businesses" "customers" "leads" "subscriptions" "onboarding" "campaigns" "emails" "marketing_log")
MISSING_TABLES=0

for table in "${REQUIRED_TABLES[@]}"; do
    # Add a small sleep to avoid locking errors with rapid team-db calls
    sleep 0.5
    EXISTS=$(team-db "SELECT name FROM sqlite_master WHERE type='table' AND name='$table';")
    if [[ $EXISTS == *"$table"* ]]; then
        # Check if table has data (optional but useful)
        COUNT=$(team-db "SELECT count(*) as cnt FROM $table" | grep -o '[0-9]\+' | head -n 1)
        echo "  ✅ Table '$table' exists (Rows: ${COUNT:-0})."
    else
        echo "  ❌ Table '$table' is MISSING or check failed!"
        MISSING_TABLES=$((MISSING_TABLES+1))
    fi
done

if [ $MISSING_TABLES -eq 0 ]; then
    echo "✅ All essential tables are present."
else
    echo "❌ ERROR: $MISSING_TABLES essential table(s) missing or unreachable!"
fi
echo ""

# 4. Build Stability Verification
echo "[4/4] Verifying Build Stability..."
echo "Checking if we can run 'npm run build'..."

# Instead of killing the dev server (which we might not have permission for), 
# let's just try to run the build. If it fails due to OOM, we'll know.
# We use --max-old-space-size to stay within limits.

export NODE_OPTIONS="--max-old-space-size=1024"
echo "Starting build (output redirected to build.log)..."
npm run build > build.log 2>&1

if [ $? -eq 0 ]; then
    echo "✅ Build SUCCESSFUL."
else
    echo "❌ ERROR: Build FAILED! See build.log for details."
    echo "--- Last 5 lines of build.log ---"
    tail -n 5 build.log
fi

echo ""
echo "=========================================="
echo "         HEALTH CHECK COMPLETE"
echo "=========================================="
