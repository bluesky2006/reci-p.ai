const handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ error: err.message });
  } else next(err);
};
const handleServerErrors = (err, req, res, next) => {
  res.status(500).send({ error: "something broke!" });
};

module.exports = { handleCustomErrors, handleServerErrors };
