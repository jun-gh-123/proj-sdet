import pg from "pg";

import seed_vals from "./seed_vals.json" with { type: "json" };

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
});

await client.connect();

await client.query(`DELETE FROM users WHERE email = ANY($1)`, [
  seed_vals.users.map((user) => user.email),
]);

await client.end();
