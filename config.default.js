var config = {
  debug: true,

  /**
   * Connection to remote server config.
   *
   */
  socket_server: {
    hostname: "dev.trendever.com",
    port: 80
  },
  /**
   * Webserver config.
   *
   */
  webserver: {
    port: 3002,
    open: true,
  },

  raven: {
    enabled: true,
    url: "",
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