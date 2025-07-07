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
    const dbNames = ["recipai", "recipai_test"];

    for (const name of dbNames) {
      const database = client.db(name);
      await resetDatabase(database);
    }
  } catch (e) {
    console.error("Error resetting databases", e);
  } finally {
    await client.close();
  }
}

main();
