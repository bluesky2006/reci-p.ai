const connectToDb = require("./db/connection.js");
const app = require("./app.js");

async function start() {
  const { client, db } = await connectToDb();
  app.locals.db = db;

  app.listen(9090, () => {
    console.log("listening on port 9090");
  });
}

start();
