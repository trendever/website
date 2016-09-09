<style src='./styles/slider.pcss'></style>
<style src='./styles/caption.pcss'></style>
<style src="./styles/hero.pcss"></style>
<style>
  /* .swipe-indicators{
    top: 0 !important;
    right: 0 !important;
  } */
</style>
<template lang="jade">
swipe.swipe-item-wrapper
  swipe-item.slide.slide-wrapper-first
    .hero__content__logo
    .caption__play(v-link='{name: "main-video"}')
     i.ic-play
    .caption__description(v-link='{name: "main-video"}') (смотреть видео)
  swipe-item.slide.slide-wrapper-second
   img(src="img/second_slide.png").image
  swipe-item.slide.slide-wrapper-third
   img(src="img/third_slide.png").image
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
