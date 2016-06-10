<template lang="jade">
div(class="popup" v-if="show")
  popup-wrapper(:show="show" close="onClose")
    .column-desktop-50.column-desktop-right
      .desktop-text-right.show-video(v-on:click="openVideo")
        | Зачем мне Trendever?
    .column-desktop-50.column-desktop-left
      .container-left
        button.btn.btn_primary.__orange.__xl.hello__btn.fast__big__btn( v-link="{ name: 'signup' }") Войти
        .link-container
          a.link-bottom( v-link="{ name: 'signup' }", href='') Зачем мне это?

  main-video(:is-open.sync="videoShowed", :on-close="onCloseVideo")
</template>

<script type="text/babel">
  import { isAuth } from 'vuex/getters/user.js';
  import popupWrapper from 'base/popup/wrapper.vue'
  import mainVideo from 'base/main-video/index.vue';

  export default {
    vuex: {
      getters: {
        isAuth,
      },
    },

    data(){
      return {
        videoShowed: false
      };
    },
    methods: {
      openVideo(){
        this.$set( 'videoShowed', true );
      },
      onCloseVideo(){
        this.$set( 'videoShowed', false );
      },
      onClose(){

      }
    },

    computed:{
      show() {
        return !this.isAuth && !this.isException
      },
      isException(){
        let excludePages = ['info-mission', 'info-user',
                             'info-shop',
                             'signup', 'comfirm-sms'];

        return excludePages.indexOf(this.$route.name) > -1;
      }
    },

    components: {
      popupWrapper,
      mainVideo
    },
  }
</script>
