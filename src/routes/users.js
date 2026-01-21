const express = require("express");
const path = require("path");
const router = express.Router();
const { Pool } = require("pg");

const { validateName, validateEmail } = require("../public/lib.mjs");

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL || "postgres://postgres:postgres@db:5432/appdb",
});

function respond(req, resHTML, resJSON) {
  if (req.headers.accept && req.headers.accept.includes("text/html")) {
    return resHTML();
  }

  return resJSON();
}

// api
router.get("/", async (req, res) => {
  const { email } = req.query;

  let result;
  if (email) {
    result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  } else {
    result = await pool.query("SELECT * FROM users");
  }

  return respond(
    req,
    () => res.render("all-users", { users: result.rows }),
    () => res.json(result.rows)
  );
});

router.post("/", async (req, res) => {
  const { name, email } = req.body;

  const errors = {};
  const formData = { name, email };
  const nameValidation = validateName(name);
  const emailValidation = validateEmail(email);

  if (!nameValidation.valid) {
    errors.name = nameValidation.reason;
  }

  if (!emailValidation.valid) {
    errors.email = emailValidation.reason;
  }

  if (errors.name || errors.email) {
    return respond(
      req,
      () => res.render("create-user", { errors, formData }),
      () => res.status(201).json(errors)
    );
  }

  let result;
  try {
    result = await pool.query(
      "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
      [name, email]
    );
  } catch (err) {
    errors.form = err.message;

    return respond(
      req,
      () => res.render("create-user", { errors, formData }),
      () => res.status(400).json(errors)
    );
  }

  return respond(
    req,
    () => res.redirect("/users/view"),
    () => res.status(201).json(result.rows[0])
  );
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
router.get("/new", async (req, res) => {
  res.render("create-user", { errors: {} });
});

module.exports = router;
