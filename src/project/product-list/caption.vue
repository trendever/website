<style src='./styles/caption.pcss'></style>
<template lang="jade">

.caption(v-if='!isAuth')
  span(id='how-it-work') Как это работает?
  a(href="https://vimeo.com/167123446", target='_blank').caption__play
    i.ic-play
  a.caption__description(href="https://vimeo.com/167123446", target='_blank') (смотрите видео)
  a(href='' v-link='{name: "info-user"}').btn.fast__big__btn.__orange.btn_primary.btn__more
    | Подробнее
  .caption__subtitle Ежедневные шопинг тренды

//- .main-video(v-if='videoShowed')
//-   i(@click='videoShowed=false').ic-close
//-   iframe(src='https://player.vimeo.com/video/167123446?title=0&byline=0&portrait=0&autoplay=1',
//-     frameborder='0', webkitallowfullscreen,
//-     mozallowfullscreen, allowfullscreen)
</template>
<script>
  import { isAuth } from 'vuex/getters/user.js';
  export default {
    data(){
      return {
        videoShowed: false
      };
    },

    vuex: {
      getters: {
        isAuth,
      },
    },
  };
</script>
