
require('dotenv').config();

const {
  NEW_RELIC_APP_NAME,
  NEW_RELIC_KEY,
} = process.env;

exports.config = {
  app_name: [NEW_RELIC_APP_NAME],
  license_key: NEW_RELIC_KEY,
  distributed_tracing: {
    enabled: false
  },
  logging: {
    level: "info"
  },
  allow_all_headers: true,
  attributes: {
    exclude: [
      "request.headers.cookie",
      "request.headers.authorization",
      "request.headers.proxyAuthorization",
      "request.headers.setCookie*",
      "request.headers.x*",
      "response.headers.cookie",
      "response.headers.authorization",
      "response.headers.proxyAuthorization",
      "response.headers.setCookie*",
      "response.headers.x*"
    ]
  },
  error_collector: { ignore_status_codes: [400, 401, 403, 404] }
};
