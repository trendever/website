<style src='./swipe.pcss'></style>
<template lang="jade">
swipe.swipe-item-container
  swipe-item.slide.slide-1
    p искать и покупать в живом#[br] каталоге товаров из инстаграма.
    img(src='img/auth-slide-1.png')
  swipe-item.slide.slide-2
    p покупать в приложении Instagram#[br]по комментарию @wantit.
    img(src='img/auth-slide-2.png')
    p.hide-desktop(style='margin-top: -10px')
      | Поэтому укажите инста-логин #[i.emoji.emoji_down]
  swipe-item.slide.slide-3
    p  общаться с магазинами#[br]и заказывать в привычном чате.
    img(src='img/auth-slide-3.png')
  swipe-item.slide.slide-4
    p  подписаться и следить за лентами#[br] фешн-экспертов – Трендскаутов.
    img(src='img/auth-slide-5.png')
  swipe-item.slide.slide-5
    p сохранять товары инста-шопов#[br]в свою ленту трендов.
    img(src='img/auth-slide-4.png')
    p.hide-desktop(style='margin-top: 0px')
      | Поэтому укажите инста-логин #[i.emoji.emoji_down]
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
