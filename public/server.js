require("dotenv").config();
const express = require("express");
const path = require("path");

const app = express();
const PORT = Number(process.env.PORT || 5501);
const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:5001";

app.get("/config.js", (_req, res) => {
  res.type("application/javascript");
  res.send(
    `window.BATCHMATE_CONFIG = Object.assign({}, window.BATCHMATE_CONFIG, ${JSON.stringify(
      {
        API_BASE_URL,
      },
    )});`,
  );
});

app.use(express.static(path.join(__dirname)));

app.listen(PORT, () => {
  console.log(`Frontend server running on http://localhost:${PORT}`);
});