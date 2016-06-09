<style src='./swipe.pcss'></style>
<template lang="jade">
.swipe
  .swipe-item-container(
    v-el:swipe, @click='swipe(1)', :style='style')
    .swipe-item.slide.slide-5
      p ...сохранять товары инста-шопов#[br]в свою ленту трендов.
      img(src='img/auth-slide-4.png')
      p.hide-desktop(style='margin-top: 0px')
        | Поэтому укажите инста-логин #[i.emoji.emoji_down]
    .swipe-item.slide.slide-1
      p ...искать и покупать в живом каталоге#[br] товаров из инстаграма.
      img(src='img/auth-slide-1.png')
    .swipe-item.slide.slide-2
      p ...покупать в приложении Instagram#[br]по комментарию @wantit.
      img(src='img/auth-slide-2.png')
      p.hide-desktop(style='margin-top: -10px')
        | Поэтому укажите инста-логин #[i.emoji.emoji_down]
    .swipe-item.slide.slide-3
      p  ...общаться с магазинами#[br]и заказывать в привычном чате.
      img(src='img/auth-slide-3.png')
    .swipe-item.slide.slide-4
      p  ...подписаться и следить за лентами#[br] фешн-экспертов – Трендскаутов.
      img(src='img/auth-slide-5.png')
    .swipe-item.slide.slide-5
      p ...сохранять товары инста-шопов#[br]в свою ленту трендов.
      img(src='img/auth-slide-4.png')
      p.hide-desktop(style='margin-top: 0px')
        | Поэтому укажите инста-логин #[i.emoji.emoji_down]
    .swipe-item.slide.slide-1
      p ...искать и покупать в живом каталоге#[br] товаров из инстаграма.
      img(src='img/auth-slide-1.png')
  .swipe-navigation
    .swipe-prev(@click='swipe(-1)'): i.ic-swipe-left
    .swipe-next(@click='swipe(1)'): i.ic-swipe-right
</template>

<script type='text/ecmascript-6'>
  const TIMEOUT_SLIDER = 7000;

  export default {
    data: () => ({
      widthSwipe: '',
      width: '',
      left: 0,
      timerId: '',
      isActiveSwipe: false,
    }),

    ready() {
      this.$els.swipe.style.transition = '1s';
      this.createSlider();
      this.$set('timerId', setInterval(this.swipe, TIMEOUT_SLIDER));
    },

    beforeDestroy() {
      clearInterval(this.$get('timerId'));
    },

    computed: {
      style() {
        return {
          width: `${ this.$get('widthSwipe') }px`,
          left: `${ this.$get('left') }px`
        };
      },
    },

    methods: {
      createSlider() {
        var length = this.$els.swipe.childNodes.length;
        var width = this.$els.swipe.clientWidth;

        this.$set('width', width);
        this.$set('left', -width);
        this.$set('widthSwipe', length * width);
      },

      swipe(to = 1) {
        if (this.$get('isActiveSwipe')) { return; }
        clearInterval(this.$get('timerId'));

        var width = this.$get('width');
        var widthSwipe = this.$get('widthSwipe');
        var left = (this.$get('left') - to * width) % widthSwipe;

        if (left > 0) {
          left = -widthSwipe + width;
        }

        this.$set('left', left);
        this.$set('timerId', setInterval(this.swipe, TIMEOUT_SLIDER));

        if (0 === left) {
          this.$set('isActiveSwipe', true);
          setTimeout( () => {
            this.$els.swipe.style.transition = '';
            this.$set('left', -widthSwipe + 2 * width);
            setTimeout( () => {
              this.$els.swipe.style.transition = '1s';
              this.$set('isActiveSwipe', false);
            }, 10);
          }, 1200)
        }

        if (widthSwipe - width === -left) {
          this.$set('isActiveSwipe', true);
          setTimeout( () => {
            this.$els.swipe.style.transition = '0s';
            this.$set('left', -width);
            setTimeout( () => {
              this.$els.swipe.style.transition = '1s';
              this.$set('isActiveSwipe', false);
            }, 10);
          }, 1000)
        }
      },
    },
  }
</script>
