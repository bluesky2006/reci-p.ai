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
  test("404: Responds with an error if given a userid that isn't present in our user collection", () => {
    return request(app)
      .get("/api/users/invaliduserid")
      .expect(404)
      .then(({ body }) => {
        expect(body.error).toBe("User not found");
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
  test("400: returns error when request body is empty", () => {
    return request(app)
      .post("/api/users")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.error).toBe("bad request");
      });
  });
  test("400: returns error when request body is missing", () => {
    return request(app)
      .post("/api/users")
      .send()
      .expect(400)
      .then(({ body }) => {
        expect(body.error).toBe("bad request");
      });
  });
  test("400: responds with error if username is taken", () => {
    const data = { username: "icellusedkars", name: "Valid name" };
    return request(app)
      .post("/api/users")
      .send(data)
      .expect(400)
      .then(({ body }) => {
        expect(body.error).toBe("username is taken");
      });
  });

  test("400: returns error message if missing required fields (username)", () => {
    const data = { name: "Bob" };
    return request(app)
      .post("/api/users")
      .send(data)
      .expect(400)
      .then(({ body }) => {
        expect(body.error).toBe("bad request");
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
test("404: returns error if userid is not valid", async () => {
  const response = await request(app)
    .get("/api/users/invalidid/recipes")
    .expect(404);
});

describe("GET /api/recipes/:id", () => {
  test("200: Responds with a recipe object from the recipe collection", async () => {
    const recipe = await db
      .collection("recipes")
      .findOne({ title: "Avocado Toast" });

    const response = await request(app)
      .get(`/api/recipes/${recipe._id.toString()}`)
      .expect(200);
    expect(response.body.title).toBe("Avocado Toast");
    expect(response.body.ingredients).toContain("1 ripe avocado");
  });
  test("404: responds with an error if the recipeid is not valid", () => {
    return request(app)
      .get(`/api/recipes/invalidid`)
      .expect(404)
      .then((response) => {
        expect(response.body.error).toBe("Recipe not found");
      });
  });
});

describe("POST /api/recipes", () => {
  test("201: Inserts data to recipes collection with the correct userid", async () => {
    const user = await db
      .collection("users")
      .findOne({ username: "butter_bridge" });

    const data = {
      title: "test recipe",
      ingredients: ["ingredient one", "ingredient two"],
      steps: ["step 1:", "step 2:"],
      userId: user._id.toString(),
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

  test("400: returns bad request error if missing required field", async () => {
    const user = await db
      .collection("users")
      .findOne({ username: "butter_bridge" });

    const data = {
      ingredients: ["ingredient one", "ingredient two"],
      steps: ["step 1:", "step 2:"],
      userId: user,
    };

    return request(app)
      .post("/api/recipes")
      .send(data)
      .expect(400)
      .then((response) => {
        const body = JSON.parse(response.text);
        expect(body.error).toBe("Bad Request");
      });
  });
  test("400: returns bad request error if given an invalid userId", async () => {
    const data = {
      title: "test recipe",
      ingredients: ["ingredient one", "ingredient two"],
      steps: ["step 1:", "step 2:"],
      userId: "notauserid",
    };
    return request(app)
      .post("/api/recipes")
      .send(data)
      .expect(400)
      .then((response) => {
        const body = JSON.parse(response.text);
        expect(body.error).toBe("Bad Request");
      });
  });
  test("400: returns bad request error if ingredients array contains empty or non-string values", async () => {
    const user = await db
      .collection("users")
      .findOne({ username: "butter_bridge" });
    const invalidIngredientsCases = [
      ["", "valid ingredient"],
      [123, "valid ingredient"],
      [null, "valid ingredient"],
      [],
    ];

    for (const ingredients of invalidIngredientsCases) {
      const data = {
        title: "Valid title",
        ingredients,
        steps: ["Valid step 1"],
        userId: user._id.toString(),
      };

      await request(app)
        .post("/api/recipes")
        .send(data)
        .expect(400)
        .then(({ body }) => {
          expect(body.error).toBe("Bad Request");
        });
    }
  });

  test("400: returns bad request error if steps array contains empty or non-string values", async () => {
    const user = await db
      .collection("users")
      .findOne({ username: "butter_bridge" });
    const invalidSteps = [
      ["", "valid step"],
      [123, "valid step"],
      [null, "valid step"],
      [],
    ];

    for (const steps of invalidSteps) {
      const data = {
        title: "Valid title",
        ingredients: ["Valid ingredient"],
        steps,
        userId: user._id.toString(),
      };

      await request(app)
        .post("/api/recipes")
        .send(data)
        .expect(400)
        .then(({ body }) => {
          expect(body.error).toBe("Bad Request");
        });
    }
  });
  test("404: returns error if given a valid userId that isn't contained in our user collection", async () => {
    const data = {
      title: "test recipe",
      ingredients: ["ingredient one", "ingredient two"],
      steps: ["step 1:", "step 2:"],
      userId: "507f1f77bcf86cd799439011",
    };
    return request(app)
      .post("/api/recipes")
      .send(data)
      .expect(404)
      .then((response) => {
        const body = JSON.parse(response.text);
        expect(body.error).toBe("User not found");
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
  test("404: returns error if trying to delete an invalid _id document", async () => {
    return request(app).delete(`/api/recipes/invalidrecipe`).expect(404);
  });
  test("404: returns error if trying to delete a valid _id not contained in our collection", async () => {
    return request(app)
      .delete(`/api/recipes/507f1f77bcf86cd799439011`)
      .expect(404);
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
  test("400: returns bad request error if given a non-boolean favourite value", async () => {
    const recipe = await db
      .collection("recipes")
      .findOne({ title: "Avocado Toast" });

    const data = { favourite: "notboolean" };

    return request(app)
      .patch(`/api/recipes/${recipe._id.toString()}`)
      .send(data)
      .expect(400)
      .then((response) => {
        const body = JSON.parse(response.text);
        expect(body.error).toBe("Bad Request");
      });
  });
  test("200: ignores request body fields other than 'favourite'", async () => {
    const recipe = await db
      .collection("recipes")
      .findOne({ title: "Avocado Toast" });

    const data = { favourite: true, test: true, title: "new title" };

    return request(app)
      .patch(`/api/recipes/${recipe._id.toString()}`)
      .send(data)
      .expect(200)
      .then(({ body }) => {
        expect(body.updatedRecipe.modifiedCount).toBe(1);
      });
  });

  test("404: returns 'not found' error if recipe id is invalid", async () => {
    const data = { favourite: true };

    return request(app)
      .patch(`/api/recipes/invalidid`)
      .send(data)
      .expect(404)
      .then((response) => {
        const body = JSON.parse(response.text);
        expect(body.error).toBe("Recipe not found");
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
      .expect(200);

    const reordered = await db
      .collection("recipes")
      .find({ userId: user._id })
      .sort({ order: 1 })
      .toArray();

    const reorderedIds = reordered.map((recipe) => recipe._id.toString());
    expect(reorderedIds).toEqual(newOrder);
  });
});
