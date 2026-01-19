const express = require("express");
const app = express();
const PORT = 3000;

// JSON parsing
app.use(express.json());

// Example route
app.get("/", (req, res) => res.send("Hello SDET3!"));
app.use("/users", require("./routes/users"));

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
