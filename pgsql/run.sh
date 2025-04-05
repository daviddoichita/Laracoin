docker run -d \
    --name pgsql \
    -v pg_data:/var/lib/postgresql/data \
    -p 5432:5432 \
    pgsql
