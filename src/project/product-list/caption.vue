<style src='./styles/caption.pcss'></style>
<template lang="jade">

.caption(v-if='!isAuth')
  span(id='how-it-work') Как это работает?
  .caption__play(v-on:click="openVideo")
    i.ic-play
  .caption__description(v-on:click="openVideo") (смотрите видео)
  a(href='' v-link='{name: "info-user"}').btn.fast__big__btn.__orange.btn_primary.btn__more
    | Подробнее
  .caption__subtitle Ежедневные шопинг тренды

  main-video(:is-open.sync="videoShowed", :on-close="onClose")

</template>

<script type="text/babel">

  import listen from 'event-listener';
  import { isAuth } from 'vuex/getters/user.js';
  import mainVideo from 'base/main-video/index.vue';
  export default {
    data(){
      return {
        videoShowed: false
      };
    },
    methods: {
      openVideo(){
        this.$set( 'videoShowed', true );
      },
      onClose(){
        this.$set( 'videoShowed', false );
      }
    },
    vuex: {
      getters: {
        isAuth,
      },
    },
    components:{
      mainVideo
    }
  };

</script>
