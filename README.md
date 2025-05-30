# NC News Seeding

- Instructions for setup:
    - Set up environment variables by creating two .env files for the test database and the development database
    - One file should be called .env.test and the other should be called .env.development
    - In the env test file, create the environment variable PGDATABASE and set it to nc_news_test     ---> PGDATABASE=nc_news_test
    - In the env development file, create the environment variable PGDATABASE and set it to nc_news     ---> PGDATABASE=nc_news
