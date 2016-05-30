<style src='./styles/caption.pcss'></style>
<template lang="jade">
.caption(v-if='!isAuth') Как это работает?
  a.caption__play(v-link='{name: "why"}')
    i.ic-play
  .caption__description (смотрите видео)
  a(href='./why').btn.fast__big__btn.__orange.btn_primary.btn__more Подробнее
  .caption__subtitle Ежедневные шопинг тренды
</template>
<script>
  import { isAuth } from 'vuex/getters';
  export default {
    data(){
      return {};
    },
    vuex: {
      getters: {
        isAuth,
      },
    },
  };
</script>
