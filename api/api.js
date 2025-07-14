export const baseUrl = `https://reci-p-ai.onrender.com/api`;

export function fetchUser(userId) {
  return fetch(`${baseUrl}/users/${userId}`).then((res) => {
    if (!res.ok) throw new Error("Failed to fetch user");
    return res.json();
  });
}

export function fetchUserByEmail(email) {
  return fetch(`${baseUrl}/users/email/${email}`).then((res) => {
    if (!res.ok) throw new Error("Failed to fetch user");
    return res.json();
  });
}

export function postUser(username, name) {
  //need to update with google auth stuff
  return fetch(`${baseUrl}/users`, {
    method: "POST",
    body: JSON.stringify({
      username,
      name,
    }),
    headers: { "Content-type": "application/json" },
  }).then((res) => {
    if (!res.ok) throw new Error("registration failed!");
    return res.json();
  });
}

export function fetchRecipes(userId) {
  return fetch(`${baseUrl}/users/${userId}/recipes`).then((res) => {
    if (!res.ok) throw new Error("Could not fetch recipes!");
    return res.json();
  });
}

export function fetchRecipe(recipeId) {
  return fetch(`${baseUrl}/recipes/${recipeId}`).then((res) => {
    if (!res.ok) throw new Error("Could not fetch recipe!");
    return res.json();
  });
}

export function deleteRecipe(recipeId) {
  return fetch(`${baseUrl}/recipes/${recipeId}`, {
    method: "DELETE",
  }).then((res) => {
    if (!res.ok) throw new Error("recipe deletion failed!");
  });
}

export function favouriteRecipe(recipeId, favourite) {
  return fetch(`${baseUrl}/recipes/${recipeId}`, {
    method: "PATCH",
    body: JSON.stringify({ favourite: favourite }),
    headers: { "Content-type": "application/json" },
  }).then((res) => {
    if (!res.ok) throw new Error("Could not favourite recipe!");
    return res.json();
  });
}

export function postRecipe(userId, title, ingredients, steps, image, summary) {
  return fetch(`${baseUrl}/recipes`, {
    method: "POST",
    body: JSON.stringify({
      userId,
      title,
      ingredients,
      steps,
      image,
      summary,
    }),
    headers: { "Content-type": "application/json" },
  }).then((res) => {
    if (!res.ok) throw new Error("Saving recipe failed!");
    return res.json();
  });
}

export function orderRecipes(userId, order) {
  return fetch(`${baseUrl}/users/${userId}/recipes/order`, {
    method: "PATCH",
    body: JSON.stringify({
      order,
    }),
  });
}
