var config = {
  debug: true,

  /**
   * Connection to remote server config.
   *
   */
  socket_server: {
    url: "https://dev.trendever.com/channel"
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