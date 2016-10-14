<style src="project/app/style.pcss"></style>
<style lang="postcss">

.root-loader {

  position: fixed;
  top:50%;
  left:50%;
  z-index: 9999;
  transform: translate(-50%,-50%)
}

</style>
<template lang="jade">
.root-loader(v-if="$store.state.user.showRootLoader"): app-loader
.fake-status-bar(v-if="isStandalone", @click="scrollTop")
.app(:class="{'standalone': isStandalone}")
  inapp-notification(v-if="isStandalone")
  popup-fast-signup(v-if="authIsDone && showAuthBtn")
  router-view(v-if="authIsDone")
  listener-component(v-if="authIsDone")
//-get user for ios push actions logic
input(type="hidden", value="", id="get-user-login")
</template>

<script type='text/babel'>
  import 'base/fonts/trendever-icons/trendever-icons.font'
  import appLoader from 'base/loader/loader';
  import listen from 'event-listener';

  import { browser } from 'utils'

  import { getStorage } from 'services/profile'

  import store from 'vuex/store'
  import { authUser } from 'vuex/actions/user.js'

  import PopupFastSignup from 'base/auth-popup/fast-signup.vue'
  import ListenerComponent from 'project/listener/index.vue'
  import InappNotification from 'base/inapp-notification/index.vue';

  import {get as getUser} from 'services/user';
  import {setToken} from 'services/user';


  export default {
    data(){
      return {
        authIsDone: false,
        touchMoveY: 0,
        showAuthBtn: false
      }
    },
    vuex: {
      actions: {
        authUser
      }
    },
    //get user for ios push actions logic
    created(){
      let self = this;
      window.setUserToken = function(token,type){
        setToken(token,type).then(data => console.log(data));
      },
      window.authIsDone = function(){
        if (self.$store.state.user.token != null){
          return true;
        }else{
          return false;
        }
      }
    },
    methods:{
      scrollTop(){
        document.querySelector('.scroll-cnt').scrollTop = 0;
      },

    },
    ready() {

      this.$on('showAuthBtn',()=>{
        this.showAuthBtn = true;
      })

      this.$on('hideAuthBtn',()=>{
        this.showAuthBtn = false;
      })

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

      // When ready...
      window.addEventListener("load",function() {
        // Set a timeout...
        setTimeout(function(){
          // Hide the address bar!
          window.scrollTo(0, 1);
        }, 0);
      });
    },

    computed: {
      isNotWhy(){
        return this.$route.name !== 'why'
      },
      isStandalone(){
        return browser.standalone;
      }
    },
    components: {
      appLoader,
      ListenerComponent,
      PopupFastSignup,
      InappNotification
    },
    store
  }
</script>
