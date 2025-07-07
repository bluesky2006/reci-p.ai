const { MongoClient } = require("mongodb");
const { MongoMemoryServer } = require("mongodb-memory-server");
const seed = require("../db/seeds/seed.js");
const users = require("../db/data/test-data/users.js");

let mongoServer;
let client;
let db;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  client = new MongoClient(uri);
  await client.connect();
  db = client.db("testdb");
});

afterAll(async () => {
  await client.close();
  await mongoServer.stop();
});

beforeEach(async () => {
  await db.collection("users").deleteMany({});
});

test("seed inserts users", async () => {
  await seed(db, users);
  const insertedUsers = await db.collection("users").find({}).toArray();
  expect(insertedUsers.length).toBeGreaterThan(0);
});
