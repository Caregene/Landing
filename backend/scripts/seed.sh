#!/usr/bin/env bash
set -euo pipefail

# Simple seed script to create MinIO bucket and seed Postgres
SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &> /dev/null && pwd)
ROOT_DIR=$(dirname "$SCRIPT_DIR")

echo "Seeding MinIO bucket..."
docker run --rm --network host -e MC_HOST_local=http://minioadmin:minioadmin@localhost:9000 quay.io/minio/mc mb --ignore-existing local/files || true

echo "Seeding Postgres..."
PGURL="postgresql://app:app@localhost:5432/appdb"
echo "create table if not exists users(id serial primary key, email text unique, created_at timestamptz default now());" | docker run -i --rm --network host postgres:15-alpine psql "$PGURL"
echo "insert into users(email) values('demo@example.com') on conflict do nothing;" | docker run -i --rm --network host postgres:15-alpine psql "$PGURL"

echo "Seed complete."








