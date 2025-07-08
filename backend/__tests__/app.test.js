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
  test.only("404: Responds with an error if given a userid that isn't present in our user collection", () => {
    return request(app)
      .get("/api/users/test")
      .expect(404)
      .then(({ body }) => {
        console.log(body);
        expect(body.error).toBe("not found");
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

describe("GET /api/recipes/:id", () => {
  test("200: Responds with a recipe object from the recipe collection", async () => {
    const recipe = await db
      .collection("recipes")
      .findOne({ title: "Avocado Toast" });

    const response = await request(app)
      .get(`/api/recipes/${recipe._id.toString()}`)
      .expect(200);
    console.log(response.body);
    expect(response.body.title).toBe("Avocado Toast");
    expect(response.body.ingredients).toContain("1 ripe avocado");
  });
});

describe("POST /api/recipes", () => {
  test("201: Inserts data to recipes collection with the correct userid", async () => {
    const data = {
      title: "test recipe",
      ingredients: ["ingredient one", "ingredient two"],
      steps: ["step 1:", "step 2:"],
    };

    return request(app)
      .post("/api/recipes")
      .send(data)
      .expect(201)
      .then((response) => {
        const body = JSON.parse(response.text);
        expect(body.createdRecipe.length).toBe(24);
      });
  });
});

describe("DELETE /api/recipes/:id", () => {
  test("204: Deletes recipe that corresponds to _id and returns no data", async () => {
    const recipe = await db
      .collection("recipes")
      .findOne({ title: "Avocado Toast" });

    return request(app)
      .delete(`/api/recipes/${recipe._id.toString()}`)
      .expect(204);
  });
});

describe("PATCH /api/recipes/:id", () => {
  test("200: updates object with favourite property and returns updated object", async () => {
    const recipe = await db
      .collection("recipes")
      .findOne({ title: "Avocado Toast" });

    const data = { favourite: true };

    return request(app)
      .patch(`/api/recipes/${recipe._id.toString()}`)
      .send(data)
      .expect(200)
      .then(({ body }) => {
        expect(body.updatedRecipe.modifiedCount).toBe(1);
      });
  });
});

describe("PATCH /api/users/:userId/recipes/order", () => {
  test("204: Reorders recipes for a user", async () => {
    const user = await db
      .collection("users")
      .findOne({ username: "butter_bridge" });
    const recipes = await db
      .collection("recipes")
      .find({ userId: user._id })
      .sort({ order: 1 })
      .toArray();

    const newOrder = recipes.map((recipe) => recipe._id.toString()).reverse();

    await request(app)
      .patch(`/api/users/${user._id}/recipes/order`)
      .send({ orderedRecipeIds: newOrder })
      .expect(204);

    const reordered = await db
      .collection("recipes")
      .find({ userId: user._id })
      .sort({ order: 1 })
      .toArray();

    const reorderedIds = reordered.map((recipe) => recipe._id.toString());
    expect(reorderedIds).toEqual(newOrder);
  });
});
