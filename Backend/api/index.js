const router = require("express").Router(),
  dealRoutes = require("./deal/deal.routes"),
  { ConstantMembers } = require("./common/members");

router.use(ConstantMembers.ENDPOINTS.DEAL, dealRoutes);

module.exports = router;
