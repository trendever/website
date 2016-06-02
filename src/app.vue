<style src="project/app/style.pcss"></style>

<template>
  <div :class="{popup: isShowPopupFastSignup}">
    <popup-signup v-if="isShowPopupSignup"></popup-signup>
    <popup-fast-signup v-if="isShowPopupFastSignup && isNotWhy"></popup-fast-signup>
  </div>
  <router-view></router-view>
  <listener-component></listener-component>
</template>

<script type='text/babel'>
  import font from 'base/fonts/trendever-icons/trendever-icons.font';
  import store from 'vuex/store';
  import {
    showPopupSignup,
    showPopupFastSignup,
  } from 'vuex/actions';
  import {
    loadUser,
    authenticateUser,
  } from 'vuex/actions/user.js';
  import {
    isShowPopupSignup,
    isShowPopupFastSignup,
  } from 'vuex/getters';
  import {
    isAuth
  } from 'vuex/getters/user.js';
  import * as types from 'vuex/mutation-types';
  import profile from 'services/profile';
  import * as messages from 'services/message';

  import PopupFastSignup from 'project/auth-popup/fast-signup.vue'
  import PopupSignup from 'project/auth-popup/signup.vue'
  import ListenerComponent from 'project/listener/index.vue'

  export default {
    vuex: {
      actions: {
        showPopupFastSignup,
        authenticateUser,
        loadUser
      },
      getters: {
        isAuth,
        isShowPopupSignup,
        isShowPopupFastSignup,
      }
    },
    ready() {

      if ( this.$route.query ) {

        if ( this.$route.query.token ) {

          // Auth by token in url
          this.authenticateUser( null, this.$route.query.token );

        }

      }

      this.loadUser();

      if ( !this.isAuth ) {
        this.showPopupFastSignup();
      }

      // if not try subscribed, do it after 30s
      // if (!this.isAuth && !profile.subscribe_at) {
      //   setTimeout( () => {
      //     if (!self.isAuth) {
      //       this.$router.go({name: 'subscribe'});
      //     }
      //   }, 30*1000);
      // }
      mixpanel.track( 'App Open' );

    },
    computed: {
      isNotWhy(){
        return this.$route.name !== 'why';
      }
    },
    components: {
      ListenerComponent,
      PopupFastSignup,
      PopupSignup,
    },
    store
  }
</script>
