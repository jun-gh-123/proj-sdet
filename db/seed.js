import pg from "pg";

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
});

await client.connect();

await client.query(`
  INSERT INTO users (name, email)
  VALUES ('test', 'test@example.com')
  ON CONFLICT DO NOTHING;
`);

await client.end();
