<style src="project/app/style.pcss"></style>

<template lang="jade">
.app(:class="{'standalone': isStandalone}")
  popup-fast-signup(v-if="authIsDone")
  router-view(v-if="authIsDone")
  listener-component(v-if="authIsDone")
//-get user for ios push actions logic
input(type="hidden", value="", id="get-user-login")

</template>

<script type='text/babel'>
  import 'base/fonts/trendever-icons/trendever-icons.font'

  import listen from 'event-listener';

  import { browser } from 'utils'

  import { getStorage } from 'services/profile'

  import store from 'vuex/store'
  import { authUser } from 'vuex/actions/user.js'

  import PopupFastSignup from 'base/auth-popup/fast-signup.vue'
  import ListenerComponent from 'project/listener/index.vue'



  //get user for ios push actions logic
  import {get as getUser} from 'services/user';

  export default {
    store,
    data(){
      return {
        authIsDone: false,
        touchMoveY: 0,
        getUserLogin: ''
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
      let result=''; 
      //console.log(self.$store.state.user.id);
      window.getUserLogin = function(){

        let user = self.$store.state.user;
        if(user.id !== null){
          let userId = user.myId; 
          let instagramUsername = user.all[user.myId].instagram_username;
            getUser({
              user_id: userId,
              instagram_name: instagramUsername
            }).then(data=>{
              if(data.User.id === userId){
                 result = data.User.id;
              } else {
                result = 0;
              }
              //set value to hidden input
              document.getElementById('get-user-login').value = result;
            });
          }
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
    }
  }
</script>
