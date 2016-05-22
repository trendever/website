var config = {
  /**
   * Connection to remote server config.
   */
  socket_server: {
    url: "https://dev.trendever.com/channel"
  },
  /**
   * Webserver config.
   */
  webserver: {
    port: 3000
  },

  raven: {
    enabled: true,
    url: "",
  },

  /**
   * Mixpanel analytics
   */
  mixpanel: {
    token: ""
  },
};

module.exports = config;