<style src='./styles/caption.pcss'></style>
<template lang="jade">
.scroll-top(v-on:click='up()')

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

    ready() {
      this.scrollCnt = document.querySelector('.scroll-cnt');

      this.showVideo(this);
    },

    methods: {
      toggleVideo(test) {
        test.videoShowed = true;
      },

      showVideo(test) {
        var btn = document.querySelector('.show-video');

        btn.addEventListener('click', function () {
          test.videoShowed = true;
        });
      },

      up() {
        var top = Math.max(this.scrollCnt.scrollTop);
        if(top > 0) {
          this.scrollCnt.scrollTop = top - top/5;
          var t = setTimeout(this.up, 20);
        } else clearTimeout(t);
        return false;
      }
    },

    vuex: {
      getters: {
        isAuth,
      },
    },
  };
</script>
