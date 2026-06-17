#!/bin/bash
# =============================================================
# PostgreSQL Init Script
# Creates multiple databases on first startup
# =============================================================
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    -- Create authservice database if it doesn't exist
    SELECT 'CREATE DATABASE authservice_db'
    WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'authservice_db')\gexec

    -- Create booking database if it doesn't exist
    SELECT 'CREATE DATABASE cineverse_booking'
    WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'cineverse_booking')\gexec

    GRANT ALL PRIVILEGES ON DATABASE authservice_db TO $POSTGRES_USER;
    GRANT ALL PRIVILEGES ON DATABASE cineverse_booking TO $POSTGRES_USER;
EOSQL

echo "✅ Databases authservice_db and cineverse_booking created successfully!"
