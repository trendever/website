<template lang="jade">

popup-signup(
  :show="showPopupSignup",
  v-if="showPopupSignup")

popup-fast-signup(
  :show="showPopupFastSignup",
  v-if="showPopupFastSignup")

router-view

notify-component

</template>

<script>
  import store from 'vuex/store';
  import * as types from 'vuex/mutation-types';
  import profile from 'services/profile';
  import * as messages from 'services/message';

  import PopupFastSignup from 'project/auth-popup/fast-signup.vue'
  import PopupSignup from 'project/auth-popup/signup.vue'
  import NotifyComponent from 'project/notify/index.vue'

  export default {
    data: () => ({
      showPopupSignup: false,
      showPopupFastSignup: false,
    }),

    ready() {
      mixpanel.track("App Open");

      if (!profile.isAuthorized) {
        if (profile.isFirstVisit) {
          this.$router.go({name: 'hello'});
        } else {
          this.$dispatch('show:popup:fast-signup');
        }
      }

      // if not try subscribed, do it after 30s
      if (!profile.isAuthorized && !profile.subscribe_at) {
        setTimeout( () => {
          this.$router.go({name: 'subscribe'});
        }, 30*1000);
      }

    },

    events: {
     ['show:popup:signup'](flag = true) {
       this.$set('showPopupSignup', flag);
     },

     ['show:popup:fast-signup'](flag = true) {
       var div = document.getElementById('page_body');
       this.$set('showPopupFastSignup', flag);
       if (flag) {
         div.className = div.className + ' popup';
       } else {
         div.className = '';
       }
     },
    },

    components: {
      NotifyComponent,
      PopupFastSignup,
      PopupSignup,
    },
    store
  }
</script>
