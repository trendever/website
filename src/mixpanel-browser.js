/* globals window */

if (window.location.protocol !== "https:") {
  var mixpanel = require('mixpanel-browser/build/mixpanel.cjs');
} else {
  let _methods = "default.init init disable time_event track track_pageview track_links track_forms register register_once alias unregister identify name_tag set_config people.set people.set_once people.increment people.append people.union people.track_charge people.clear_charges people.delete_user".split(" ");

  var mixpanel = {};
  for (let i = 0; i < _methods.length; i++) {
    let m = _methods[i];
    mixpanel[m] = () => {
      console.log(`[shim] Mixpanel: ${m}`, arguments);
    }
  }
  window.mixpanel = mixpanel;
}

// Shimmed mixpanel api if protocol != https.
export default mixpanel
