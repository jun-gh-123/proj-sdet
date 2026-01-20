const express = require("express");
const path = require("path");
const router = express.Router();
const { Pool } = require("pg");

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL || "postgres://postgres:postgres@db:5432/appdb",
});

// api
router.get("/", async (req, res) => {
  const { email } = req.query;

  let result;
  if (email) {
    result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  } else {
    result = await pool.query("SELECT * FROM users");
  }

  res.json(result.rows);
});

router.post("/", async (req, res) => {
  const { name, email } = req.body;
  const result = await pool.query(
    "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
    [name, email]
  );
  res.status(201).json(result.rows[0]);
});

router.delete("/", async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: "Email required." });
  }

  const result = await pool.query(
    "DELETE FROM users WHERE email=$1 RETURNING *",
    [email]
  );

  if (result.rowCount === 0) {
    return res.status(404).json({ error: "User not found." });
  }

  res.status(200).json(result.rows[0]);
});

// front end
router.get("/view", async (req, res) => {
  const result = await pool.query("SELECT * FROM users");

  let html = "<h1>All Users</h1>";
  html += '<table id="users-table"><tr><th>Name</th><th>Email</th></tr>';
  for (const user of result.rows) {
    html += `<tr><td>${user.name}</td><td>${user.email}</td></tr>`;
  }
  html += "</table>";

  res.send(html);
});

module.exports = router;
