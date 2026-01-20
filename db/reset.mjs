import pg from "pg";

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
});

await client.connect();

await client.query(`TRUNCATE TABLE users RESTART IDENTITY CASCADE`);

await client.end();
