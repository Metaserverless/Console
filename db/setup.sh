PGPASSWORD=postgres psql -h 127.0.0.1 -f install.sql -U postgres
PGPASSWORD=marcus psql -h 127.0.0.1 -d application -f structure.sql -U marcus
PGPASSWORD=marcus psql -h 127.0.0.1 -d application -f data.sql -U marcus
