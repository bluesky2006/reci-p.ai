const endpointsJson = require("../db/data/endpoints.json");

const getEndPoints = (req, res) => {
  return res.status(200).send({ endpoints: endpointsJson });
};

module.exports = { getEndPoints };
