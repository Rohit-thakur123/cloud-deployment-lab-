const path = require("node:path");
const express = require("express");

const app = express();
const port = Number(process.env.PORT) || 3000;
const studentName = process.env.STUDENT_NAME || "Rohit Singh";
const appVersion = process.env.APP_VERSION || "1.0.0";

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (request, response) => {
  response.render("index", {
    name: studentName,
    version: appVersion,
    year: new Date().getFullYear(),
  });
});

app.get("/health", (request, response) => {
  response.status(200).json({ status: "ok", version: appVersion });
});

if (require.main === module) {
  app.listen(port, "0.0.0.0", () => {
    console.log(`Cloud Deployment Lab is listening on port ${port}`);
  });
}

module.exports = app;
