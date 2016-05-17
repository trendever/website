<style src="./styles/caption.pcss"></style>
<template lang="jade">
.caption(v-if="!isAuth") Как это работает?
  a.caption__play(v-link="{name: 'why'}")
    i.ic-play
  .caption__description (смотрите видео)
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