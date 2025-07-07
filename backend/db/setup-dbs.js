import connection from "./connection.js";
const { client } = connection;

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
    await client.connect();
    const database = client.db("recipai");
    await resetDatabase(database);
  } catch (e) {
    console.error("Error resetting database", e);
  } finally {
    await client.close();
  }
}

main();
