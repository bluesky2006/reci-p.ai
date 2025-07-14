const fs = require("fs");
const ticklePancakes = fs.readFileSync(
  __dirname + "/../images/ticklepancakes.png"
);
const coffee = fs.readFileSync(__dirname + "/../images/coffee.jpeg");
const greekSalad = fs.readFileSync(__dirname + "/../images/greeksalad.jpeg");
const jam = fs.readFileSync(__dirname + "/../images/jam.jpeg");
const muffins = fs.readFileSync(__dirname + "/../images/muffins.jpeg");
const nachos = fs.readFileSync(__dirname + "/../images/nachos.jpeg");

module.exports = [
  {
    title: "Tickle Pancakes",
    ingredients: ["100g flour", "2 eggs", "300ml milk", "Butter for frying"],
    steps: [
      "Whisk flour, eggs, and milk into a smooth batter.",
      "Heat a pan with a bit of butter.",
      "Pour batter and cook until golden on both sides.",
      "Serve with syrup or fruit.",
    ],
    username: "tickle122@gmail.com",
    order: 0,
    favourite: false,
    image: ticklePancakes,
    summary: "it's tickle pancakes!",
  },
  {
    title: "Grumpy's Black Coffee",
    ingredients: ["Fresh coffee grounds", "Hot water"],
    steps: [
      "Boil water.",
      "Brew coffee with grounds using a French press or filter.",
      "Serve strong and hot.",
    ],
    username: "grumpy19@gmail.com",
    order: 0,
    favourite: false,
    image: coffee,
    summary: "It's grumpy's black coffee!",
  },
  {
    title: "Happy Sunshine Salad",
    ingredients: ["Mixed greens", "Cherry tomatoes", "Feta", "Olive oil"],
    steps: [
      "Toss greens and tomatoes.",
      "Crumble feta on top.",
      "Drizzle with olive oil before serving.",
    ],
    username: "happyamy2016@gmail.com",
    order: 0,
    favourite: false,
    image: greekSalad,
    summary: "greek salad",
  },
  {
    title: "Messy Nachos",
    ingredients: ["Tortilla chips", "Cheddar cheese", "Jalapeños", "Salsa"],
    steps: [
      "Layer chips, cheese, and jalapeños on a baking tray.",
      "Bake until cheese melts.",
      "Top with salsa and serve.",
    ],
    username: "cooljmessy@gmail.com",
    order: 0,
    favourite: false,
    image: nachos,
    summary: "nachos!",
  },
  {
    title: "Bump's Blueberry Muffins",
    ingredients: ["200g flour", "100g sugar", "1 egg", "Blueberries"],
    steps: [
      "Mix dry ingredients, then add egg and blueberries.",
      "Spoon into muffin tins.",
      "Bake at 180°C for 20 mins.",
    ],
    username: "weegembump@gmail.com",
    order: 0,
    favourite: false,
    image: muffins,
    summary: "muffins!",
  },
  {
    title: "Jelly's Strawberry Jam",
    ingredients: ["500g strawberries", "500g sugar", "Lemon juice"],
    steps: [
      "Mash strawberries and mix with sugar.",
      "Simmer with lemon juice until thickened.",
      "Pour into sterilized jars and seal.",
    ],
    username: "jessjelly@gmail.com",
    order: 0,
    favourite: false,
    image: jam,
    summary: "Jammm!",
  },
];
