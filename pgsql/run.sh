docker run -d \
    --name laracoin_pgsql \
    -v pg_data:/var/lib/postgresql/data \
    -p 5432:5432 \
    laracoin_pgsql
