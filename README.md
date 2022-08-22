# House of Games - API

Game reviews API - an express.js server with PostgresSQL database.

## How to run

1. Clone the repo
2. Run `npm i`
3. Follow the instructions below 'Connecting to the database locally'
4. Run `npm start`

## Connecting to the database locally

You will need to create two .env files for your project: `.env.test` and `.env.development`. Into each, add `PGDATABASE=<database_name_here>`, with the correct database name for that environment (see `/db/setup.sql` for the database names). See `.env-example` for an example of the correct format for these files.
