<style src='./styles/caption.pcss'></style>
<template lang="jade">

//- .caption(v-if='!isAuth')
//-   span(id='how-it-work') Как это работает?
//-   .caption__play(v-link='{name: "main-video"}')
//-     i.ic-play
//-   .caption__description(v-link='{name: "main-video"}') (смотрите видео)
//-   a(href='' v-link='{name: "info-user"}').btn.fast__big__btn.__orange.btn_primary.btn__more
//-     | Подробнее
//-   .caption__subtitle Ежедневные шопинг-тренды

</template>

<script type="text/babel">

  import listen from 'event-listener';
  import { isAuth } from 'vuex/getters/user.js';
  export default {
    vuex: {
      getters: {
        isAuth,
      },
    }
  };

</script>
