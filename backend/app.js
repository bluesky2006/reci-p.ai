const express = require("express");
const app = express();
const apiRouter = require("./routes/api");
const cors = require("cors");
const { handleCustomErrors, handleServerErrors } = require("./errors");

app.use(cors());
app.use(express.json());
app.use("/api", apiRouter);
app.use(handleCustomErrors);
app.use(handleServerErrors);
module.exports = app;
