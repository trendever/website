import profile from 'services/profile';
import store from 'vuex/store';

import Store from './store';
import Model from './model';
import Controller from './controller';

const error_codes = {
  emerg: 0,
  alert: 1,
  crit: 2,
  err: 3,
  warn: 4,
  notice: 5,
  info: 6,
  "service/debug": 7
};

var channel = {};

(function init() {
  var _channel = {};
  _channel.store = new Store();
  _channel.model = new Model(_channel.store);
  _channel.controller = new Controller(_channel.model, _channel.store);

  // New channel short interface
  channel.req = function(action_str, data_type,
    request_map, trans_map) {

    if (!request_map) {
      request_map = {};
    }
    if (!trans_map) {
      trans_map = {};
    }
    if (store.state.user.isAuth) {
      trans_map.token = store.state.user.token;
    }

    return new Promise((resolve, reject) => {
      _channel.model.request(
        action_str, data_type, [],
        request_map, trans_map,
        function(data) {
          // ToDo: update if after refactoring protocol
          if (!data.log_list[0]) {
            alert("Please return log_list with 1 log");
          }
          data.log_map = data.log_list[0];
          if (data.log_map.level_int === error_codes.err) {
            reject(data);
          } else {
            resolve(data);
          }
        });
    });
  };
  channel.on = function(action_str, data_type, handler_func) {
    _channel.controller.addRoute(action_str, data_type, handler_func);
  };

  channel.removeListener = function(action_str, data_type, handler_func) {
    _channel.controller.removeRoute(action_str, data_type, handler_func);
  };

  // ToDo: delete it after refactoring API to new API
  // Legacy interface.
  window.channel = _channel;
})();

export default channel;
