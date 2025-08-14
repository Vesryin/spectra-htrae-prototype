import express from "express";
import path from "path";

const app = express();
const port = process.env.PORT || 3000;

// Serve static client files
app.use(express.static(path.join(__dirname, "../client")));

// Catch-all route to serve Vite-built index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/index.html"));
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});