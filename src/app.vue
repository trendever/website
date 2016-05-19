<style src="project/app/style.pcss"></style>

<template lang="jade">
div
  div(:class="{popup: isShowPopupFastSignup}")
    popup-signup(
      v-if="isShowPopupSignup")

    popup-fast-signup(
      v-if="isShowPopupFastSignup && isNotWhy")

  router-view

  notify-component

</template>

<script type="text/babel">
  import font from 'base/fonts/trendever-icons/trendever-icons.font';
  import store from 'vuex/store';
  import {
    loadUser,
    authenticateUser,
    showPopupSignup,
    showPopupFastSignup,
  } from 'vuex/actions';
  import {
    isAuth,
    isShowPopupSignup,
    isShowPopupFastSignup,
  } from 'vuex/getters';
  import * as types from 'vuex/mutation-types';
  import profile from 'services/profile';
  import * as messages from 'services/message';

  import PopupFastSignup from 'project/auth-popup/fast-signup.vue'
  import PopupSignup from 'project/auth-popup/signup.vue'
  import NotifyComponent from 'project/notify/index.vue'

  export default {
    data: () => ({
    }),
    init() {
      loadUser(store);
    },

    vuex: {
      getters: {
        isAuth,
        isShowPopupSignup,
        isShowPopupFastSignup,
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

      if (!this.isAuth) {
        showPopupFastSignup(store);
      }

      // if not try subscribed, do it after 30s
      // if (!this.isAuth && !profile.subscribe_at) {
      //   setTimeout( () => {
      //     if (!self.isAuth) {
      //       this.$router.go({name: 'subscribe'});
      //     }
      //   }, 30*1000);
      // }

    },
    computed:{
      isNotWhy(){
        return this.$route.name !== 'why';
      }
    },
    components: {
      NotifyComponent,
      PopupFastSignup,
      PopupSignup,
    },
    store
  }
</script>
