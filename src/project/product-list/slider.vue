<style src='./styles/slider.pcss'></style>
<style src='./styles/caption.pcss'></style>
<style src="./styles/hero.pcss"></style>
<template lang="jade">
swipe.swipe-item-container
  swipe-item.slide.slide-wrapper-first
    .hero__content__logo
    .caption__play(v-link='{name: "main-video"}')
     i.ic-play
    .caption__description(v-link='{name: "main-video"}') (смотрите видео)
  //swipe-item.slide.slide-2
  //swipe-item.slide.slide-3
</template>

<script type='text/ecmascript-6'>
  import { Swipe, SwipeItem } from 'vue-swipe';

  export default {
    components: {
      Swipe,
      SwipeItem
    }
  }
</script>
