/** BizTime express application. */


const express = require("express");

const app = express();
const ExpressError = require("./expressError")

const croutes = require("./routes/companies")
const inroutes = require("./routes/invoices")
const industriesRoutes = require("./routes/industries")

app.use(express.json());
app.use("/companies", croutes)
app.use("/invoices", inroutes)
app.use("/industries", industriesRoutes)


/** 404 handler */
app.use(function(request, response, next) {
  const err = new ExpressError("Not Found", 404);
  return next(err);
});

/** general error handler */

app.use((err, request, response, next) => {
  response.status(err.status || 500);

  return response.json({
    error: err,
    message: err.message
  });
});


module.exports = app;
