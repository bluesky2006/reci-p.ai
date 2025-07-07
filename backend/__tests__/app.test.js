const { MongoClient } = require("mongodb");
const { MongoMemoryServer } = require("mongodb-memory-server");
const seed = require("../db/seeds/seed.js");
const users = require("../db/data/test-data/users.js");
const request = require("supertest");
const app = require("../app");
const endpointsJson = require("../db/data/endpoints.json");

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
beforeEach(async () => {
  app.locals.db = db;
});
afterAll(async () => {
  await client.close();
  await mongoServer.stop();
});

beforeEach(async () => {
  await db.collection("users").deleteMany({});
  await db.collection("users").insertMany(users);
});

describe("GET /api/json", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/users/:username", () => {
  test("200: Responds with a user object from our user collection", () => {
    return request(app)
      .get("/api/users/butter_bridge")
      .expect(200)
      .then(({ body }) => {
        expect(body.username).toBe("butter_bridge");
      });
  });
});

describe("GET /api/users/:username", () => {
  test("200: Responds with a user object from our user collection", () => {
    return request(app)
      .get("/api/users/butter_bridge/recipes")
      .expect(200)
      .then(({ body }) => {});
  });
});
describe("POST /api/users", () => {
  test("201: inserts data and responds with the created user if valid request", () => {
    const data = { username: "validusername", name: "Valid Username" };
    return request(app)
      .post("/api/users")
      .send(data)
      .expect(201)
      .then((response) => {
        const body = JSON.parse(response.text);
        expect(body.createdUser.length).toBe(24);
      });
  });
});
