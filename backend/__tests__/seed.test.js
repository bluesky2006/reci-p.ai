const { MongoClient } = require("mongodb");
const { MongoMemoryServer } = require("mongodb-memory-server");
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data");

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
  await db.collection("recipes").deleteMany({});
});

test("seed inserts users and recipes", async () => {
  await seed(db, testData);
  const insertedUsers = await db.collection("users").find({}).toArray();
  const insertedRecipes = await db.collection("recipes").find({}).toArray();

  expect(insertedUsers.length).toBeGreaterThan(0);
  expect(insertedRecipes.length).toBeGreaterThan(0);
  insertedRecipes.forEach((recipe) => {
    expect(recipe).toHaveProperty("userId");
  });
});
