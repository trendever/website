<template>
  <div>
    <mobile-layout v-if="isSmall" :products.once="products"></mobile-layout>
    <desktop-layout v-if="!isSmall" :products.once="products"></desktop-layout>
    <div class="products"></div>
  </div>
</template>

<style scoped lang="postcss">
  @use postcss-autoreset {
    reset: {
      all: initial;
      sizes: 0;
    }
  }
  @use postcss-initial {
    reset: inherited;
  }
</style>

<script type="text/babel">

  import listen from 'event-listener'
  import mobileLayout from '../mobileLayout/index.vue'
  import desktopLayout from '../desktopLayout/index.vue'
  export default {

    ready(){

      const resize = () => {

        if ( window.matchMedia( "(max-width: 750px)" ).matches !== this.isSmall ) {

          this.$set( 'isSmall', window.matchMedia( "(max-width: 750px)" ).matches );

        }

      };

      this.resizeLayout = listen( window, 'optimizedResize', resize );

      resize();

    },

    beforeDestroy(){

      this.resizeLayout.remove();

    },

    data(){
      return {
        isSmall: false,
        products: [
          {
            name: 'Это название продкута которое указывается в его названиии в элом это очень длинное название)))',
            oldPrice: 20000,
            price: 10000
          },
          {
            name: '111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111',
            oldPrice: null,
            price: 10000
          },
          {
            name: '222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222',
            oldPrice: 20000,
            price: null
          },
          {
            name: '222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222',
            oldPrice: null,
            price: null
          }
        ]
      }
    },

    components: {
      mobileLayout,
      desktopLayout
    }
  }
</script>
