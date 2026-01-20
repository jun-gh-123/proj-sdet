const express = require("express");
const path = require("path");
const app = express();
const PORT = 3000;

// JSON parsing
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

// Example route
app.use("/users", require("./routes/users"));

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
