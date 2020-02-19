var express = require("express");
var join = require("path").join;

// Express server
const app = express();

const PORT = process.env.PORT || 80;
const DIST_FOLDER = join(process.cwd(), "dist");

// Server static files from /browser
app.get("*.*", express.static(DIST_FOLDER));

// All regular routes use the Universal engine
app.get("*", (req, res) => {
  res.sendFile("index.html", { root: DIST_FOLDER });
});

// Start up the Node server
app.listen(PORT, () => {
  console.log(`Node server listening on port ${PORT}`);
});
