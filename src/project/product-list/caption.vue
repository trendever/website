<style src='./styles/caption.pcss'></style>
<template lang="jade">
.caption(v-if='!isAuth')
  span(id='how-it-work') Как это работает?
  span(v-on:click='toggleVideo(this)').caption__play
    i.ic-play
  .caption__description (смотрите видео)
  a(href='' v-link='{ name: "mission" }').btn.fast__big__btn.__orange.btn_primary.btn__more
    | Подробнее
  .caption__subtitle Ежедневные шопинг тренды

.main-video(v-show='videoShowed')
  i(v-on:click='videoShowed=false').ic-close
  iframe(src='https://player.vimeo.com/video/167123446?title=0&byline=0&portrait=0',
    frameborder='0', webkitallowfullscreen,
    mozallowfullscreen, allowfullscreen)
</template>
<script>
  import { isAuth } from 'vuex/getters';
  export default {
    data(){
      return {
        videoShowed: false
      };
    },

    methods: {
      toggleVideo(test) {
        test.videoShowed = true;
      }
    },

    vuex: {
      getters: {
        isAuth,
      },
    },
  };
</script>
