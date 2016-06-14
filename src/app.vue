<style src="project/app/style.pcss"></style>

<template lang="jade">
.app(:class="{'standalone': isStandalone}")
  popup-fast-signup(v-if="authIsDone")
  router-view(v-if="authIsDone")
  listener-component(v-if="authIsDone")
</template>

<script type='text/babel'>
  import { browser } from 'utils'

  import font from 'base/fonts/trendever-icons/trendever-icons.font'
  import store from 'vuex/store'
  import { authUser } from 'vuex/actions/user.js'

  import PopupFastSignup from 'base/auth-popup/fast-signup.vue'
  import ListenerComponent from 'project/listener/index.vue'

  export default {
    data(){
      return {
        authIsDone: false,
      }
    },
    vuex: {
      actions: {
        authUser
      }
    },
    ready() {
      let token = null

      if ( this.$route.query ) {
        if ( this.$route.query.token ) {
          token = this.$route.query.token
        }
      }
      this
        .authUser( null, token )
        .then( () => {
          this.$set( 'authIsDone', true )
        } );
      mixpanel.track( 'App Open' )

    },
    computed: {
      isNotWhy(){
        return this.$route.name !== 'why'
      },
      isStandalone(){
        return browser.standalone
      }
    },
    components: {
      ListenerComponent,
      PopupFastSignup,
    },
    store
  }
</script>
