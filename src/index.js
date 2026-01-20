const express = require("express");
const path = require("path");
const app = express();
const PORT = 3000;

// JSON parsing
app.use(express.json());

// Example route
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "index.html")));
app.use("/users", require("./routes/users"));

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
