const ConstantMembers = function () {
  const Messages = {
    request: {
      validationError: {
        "required-req-body":
          "A required request body parameter was not included in the request!",
        "required-query-params":
          "A required query parameter was not included in the request!",
        "required-path-params":
          "A required path parameter was not included in the request!",
      },
    },
    deal: {
      success: {
        "deal-created":
          "Request has succeeded and has led to the creation of a resource.",
        "deal-info":
          "The resource has been fetched and is transmitted in the data body.",
        "deal-deleted":
          "Request has succeeded and has led to the deletion of a resource.",
        "deal-link-active": "Deal Link's Active.",
      },
      error: {
        internal:
          "Server encountered an unexpected condition that prevented it from fulfilling the request!",
        "amount-less-than-minimum":
          "Escrow amount should be greater or equal to the minimum amount!",
        "deal-link_inactive": "Deal Link's Inactive!",
        "inexistent-resource": "Can not map the specified URl to a resource!",
      },
    },
  };

  const REQUEST_CODE = {
    SUCCESS: 200,
    ENTRY_ADDED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED_USER: 401,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
  };

  const DEAL_STATUS = {
    FUNDED: "FUNDED",
    ACCEPTED: "ACCEPTED",
    RELEASED: "RELEASED",
    REFUNDED: "REFUNDED",
    WITHDRAWN_BY_OWNER: "WITHDRAWN_BY_OWNER",
  };

  const STATUS = {
    TRUE: true,
    FALSE: false,
  };

  const CONTRACT_EVENTS = {
    NEW_PROXY_ADDRESS: "NewProxyAddress",
    FUNDED: "Funded",
    ACCEPTED: "Accepted",
    RELEASE_FUND: "ReleaseFund",
    WITHDRAW: "Withdraw",
    SIX_MONTHS: "SixMonths",
  };

  const ENDPOINTS = Object.freeze({
    ROOT: "/",
    APIDOCS: "/apidocs",
    V1: "/v1",
    DEAL: "/deal",
    DELETE: "/delete",
    SEARCH: "/search",
    ACCEPT_DEAL: "/accept",
  });

  const HTML_TEMPLATES = Object.freeze({
    DEAL_CREATED: "deal-created",
    DEAL_FUNDED: "deal-funded",
    DEAL_ACCEPTED: "deal-accepted",
    DEAL_FUND_RELEASED: "deal-fund-released",
    DEAL_FUND_WITHDRAWN: "deal-fund-withdrawn",
  });

  return {
    Messages,
    REQUEST_CODE,
    STATUS,
    ENDPOINTS,
    HTML_TEMPLATES,
    DEAL_STATUS,
    CONTRACT_EVENTS,
  };
};

module.exports = {
  ConstantMembers: ConstantMembers(),
};
