#!/bin/sh

host="$1"
shift
cmd="$@"

until python -c "import psycopg2; psycopg2.connect(dbname='device_database', user='device_user', password='device_pass', host='$host')" >/dev/null 2>&1; do
  echo "Waiting for Postgres at $host..."
  sleep 2
done

exec $cmd
