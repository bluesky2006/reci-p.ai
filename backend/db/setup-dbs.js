const connectToDb = require("./connection.js");

async function resetDatabase(dbInstance) {
  const result = await dbInstance.dropDatabase();
  console.log(
    result
      ? `Dropped database: ${dbInstance.databaseName}`
      : `No database to drop: ${dbInstance.databaseName}`
  );

  const collection = dbInstance.collection("init_collection");
  await collection.insertOne({ initialized: true });
  console.log(
    `Created collection and inserted dummy document in ${dbInstance.databaseName}`
  );
}

async function main() {
  try {
    const { client, db } = await connectToDb();
    await resetDatabase(db);
    await client.close();
  } catch (e) {
    console.error("Error resetting database", e);
  }
}

main();
