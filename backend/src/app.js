const express = require("express");
const cors = require("cors");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();

app.use(cors());
app.use(express.json({ limit: "12mb" }));
app.use(express.urlencoded({ extended: true, limit: "12mb" }));

app.get("/api/health", (req, res) => {
  res.json({ message: "protoN for Social API is running" });
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/themes", require("./routes/themeRoutes"));
app.use("/api/seeds", require("./routes/seedRoutes"));
app.use("/api/reeds", require("./routes/reedRoutes"));

app.use(notFound);
app.use(errorHandler);

module.exports = app;
