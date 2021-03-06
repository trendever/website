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
    port: 4000
  },

  raven: {
    enabled: true,
    url: "",
  },

  /**
   * Mixpanel analytics
   */
  mixpanel: {
    token: "28b7f9270a9a491f44167767767770c6"
  },

  /**
   * Other
   */
  monetization_help_id: 32069,

  directbot_active: false,

  activate_monetization: false,

  edit_product_id: null, ////th4754

  service_product_id: null,

  promo_product_id: 21499

};

module.exports = config;
