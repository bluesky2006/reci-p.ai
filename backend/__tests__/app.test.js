const { MongoClient } = require("mongodb");
const { MongoMemoryServer } = require("mongodb-memory-server");
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data");
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
  await seed(db, testData);
  app.locals.db = db;
});

afterAll(async () => {
  await client.close();
  await mongoServer.stop();
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

describe("GET /api/users/:id", () => {
  test("200: Responds with a user object from our user collection", async () => {
    const user = await db
      .collection("users")
      .findOne({ username: "butter_bridge" });

    return request(app)
      .get(`/api/users/${user._id.toString()}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.username).toBe("butter_bridge");
      });
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

describe("GET /api/users/:id/recipes", () => {
  test("200: returns recipes associated to a user", async () => {
    const user = await db
      .collection("users")
      .findOne({ username: "butter_bridge" });

    const response = await request(app)
      .get(`/api/users/${user._id}/recipes`)
      .expect(200);
    expect(Array.isArray(response.body.recipes)).toBe(true);
    response.body.recipes.forEach((recipe) => {
      expect(recipe.userId).toEqual(user._id.toString());
    });
  });
});

describe("GET /api/users/:id", () => {
  test("200: Responds with a recipe object from our recipe collection", async () => {
    const recipe = await db
      .collection("recipes")
      .findOne({ title: "Avocado Toast" });

    return request(app)
      .get(`/api/recipes/${recipe._id.toString()}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.title).toBe("Avocado Toast");
      });
  });
});
