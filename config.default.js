var config = {
  debug: true,

  /**
   * Connection to remote server config.
   *
   */
  socket_server: {
    hostname: "site.dev.trendever.com",
    port: 8081
  },
  /**
   * Webserver config.
   *
   */
  webserver: {
    port: 3002,
    open: true,
  },

  /**
   * Mixpanel analytics
   * @token string - if empty, then mixpanel will disabled.
   */
  mixpanel: {
    token: ""
  },
};

module.exports = config;