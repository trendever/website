<style src="project/app/style.pcss"></style>

<template lang="jade">
popup-fast-signup
router-view
listener-component
</template>

<script type='text/babel'>
  import font from 'base/fonts/trendever-icons/trendever-icons.font';
  import store from 'vuex/store';
  import { authUser } from 'vuex/actions/user.js';

  import PopupFastSignup from 'base/auth-popup/fast-signup.vue'
  import ListenerComponent from 'project/listener/index.vue'

  export default {
    vuex: {
      actions: {
        authUser
      }
    },
    ready() {

      let token = null;

      if ( this.$route.query ) {
        if ( this.$route.query.token ) {
          token = this.$route.query.token;
        }
      }

      this.authUser( null, token );

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
    },
    store
  }
</script>
