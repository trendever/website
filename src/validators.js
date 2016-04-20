import Vue from 'vue'

export default function() {

  Vue.validator('email', {
    message: 'неверный формат email',
    check: function (val) {
      return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(val);
    }
  })

  Vue.validator('phone', {
    message: 'неверный формат phone',
    check: function (val) {
      // allow empty or format: '+7 (9XX) XXX-XX-XX'
      return val ? /^(7|8)9([0-9]{9})$/.test(+val.replace(/\(|\)|\+|-|\s|\./g,'')) : true;
    }
  })
}
