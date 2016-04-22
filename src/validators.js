import Vue from 'vue';

export default function() {

  Vue.validator('email', {
    message: 'неверный формат email',
    check: function (val) {
      return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(val);
    }
  });

  Vue.validator('phone', {
    message: 'неверный формат телефона',
    check: function (val) {
      // allow format: '+xxx (XXX) XXX-XX-XX'
      let len = val.replace(/\D/g,'').length;
      if (len >= 10 && len <= 13) {
        return true;
      }
      return false;
    }
  });
}
