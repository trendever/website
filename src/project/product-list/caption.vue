<style src='./styles/caption.pcss'></style>
<template lang="jade">
.caption(v-if='!isAuth')
  span(id='how-it-work') Как это работает?
  a.caption__play(v-link='{name: "mission"}')
    i.ic-play
  .caption__description (смотрите видео)
  a(href='' v-link='{ name: "mission" }').btn.fast__big__btn.__orange.btn_primary.btn__more
    | Подробнее
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
