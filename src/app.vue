<style src="project/app/style.pcss"></style>

<template lang="jade">
popup-fast-signup
router-view
listener-component
</template>

<script type='text/babel'>
  import font from 'base/fonts/trendever-icons/trendever-icons.font';
  import store from 'vuex/store';
  import {
    loadUser,
    authenticateUser,
  } from 'vuex/actions';
  import {
    isAuth,
  } from 'vuex/getters';
  import * as types from 'vuex/mutation-types';
  import profile from 'services/profile';
  import * as messages from 'services/message';

  import PopupFastSignup from 'base/auth-popup/fast-signup.vue'
  import ListenerComponent from 'project/listener/index.vue'

  export default {
    data: () => ({}),
    init() {
      loadUser(store);
    },

    vuex: {
      getters: {
        isAuth,
      }
    },

    ready() {
      var self = this;

      if (this.$route.query && this.$route.query.token) {
        // Auth by token in url
        authenticateUser(store, null, this.$route.query.token);

        // Reload in vuex
        loadUser(store);
      }

      mixpanel.track('App Open');
    },

    components: {
      ListenerComponent,
      PopupFastSignup,
    },
    store
  }
</script>
