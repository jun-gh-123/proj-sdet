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
  let pug_template = "all-users";

  if (email) {
    result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    pug_template = "user-details";
  } else {
    result = await pool.query("SELECT * FROM users");
  }

  return respond(
    req,
    () => {
      res.set({
        "Cache-Control": "no-store, no-cache, must-revalidate, private",
        Pragma: "no-cache",
        Expires: "0",
      });

      res.render(pug_template, { users: result.rows });
    },
    () => res.json(result.rows)
  );
});

router.post("/new", async (req, res) => {
  res.set({
    "Cache-Control": "no-store, no-cache, must-revalidate, private",
    Pragma: "no-cache",
    Expires: "0",
  });

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
      () => res.status(303).render("create-user", { errors, formData }),
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
      () => res.status(303).render("create-user", { errors, formData }),
      () => res.status(400).json(errors)
    );
  }

  return respond(
    req,
    () => res.redirect(303, "/users"),
    () => res.status(201).json(result.rows[0])
  );
});

router.post("/change_name", async (req, res) => {
  const { name, email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email required." });
  }

  let users = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

  if (!(users && users.rows && users.rows.length)) {
    return res.status(400).json({ error: "User not found." });
  }

  const nameValidation = validateName(name);

  if (!nameValidation.valid) {
    return res.status(400).json({ error: nameValidation.reason });
  }

  try {
    users = await pool.query(
      "UPDATE users SET name=$1 WHERE email=$2 RETURNING *",
      [name, email]
    );
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }

  return respond(
    req,
    () => res.redirect(`/users?email=${email}`),
    () => res.status(201).json(users.rows[0])
  );
});

router.post("/delete", async (req, res) => {
  const { email } = req.body;

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

  return respond(
    req,
    () => res.redirect(303, "/users"),
    () => res.status(200).json(result.rows[0])
  );
});

// front end
router.get("/new", async (req, res) => {
  res.render("create-user", { errors: {} });
});

module.exports = router;
