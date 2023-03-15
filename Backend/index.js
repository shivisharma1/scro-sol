const express = require("express"),
  bodyParser = require("body-parser"),
  { PORT } = require("././api/config/env"),
  indexRouter = require("./api/index"),
  cors = require("cors"),
  { serve, setup } = require("swagger-ui-express"),
  swaggerDoc = require("./openapi.json"),
  { swaggerOptions } = require("./api/common/utils"),
  { logger } = require("./api/config/logger.config"),
  { ConstantMembers } = require("./api/common/members");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());
app.use(express.json());

app.get(ConstantMembers.ENDPOINTS.ROOT, function (req, res) {
  res.json({
    project_name: "Escrow v2.0.0",
    description: "Escrow System",
    APIdocs: `${req.get("host")}${ConstantMembers.ENDPOINTS.APIDOCS}`,
  });
});

app.use(
  ConstantMembers.ENDPOINTS.APIDOCS,
  serve,
  setup(swaggerDoc, swaggerOptions)
);

app.use(ConstantMembers.ENDPOINTS.V1, indexRouter);

app.listen(PORT, () => {
  logger.info(`Server's listening on port ${PORT}.`);
});
