<template>

  <div class="popup-container" v-if="isOpen">

    <div v-if="!isMobile" class="close" @click="onClose">
      <i></i>
    </div>

    <div v-if="isMobile" class="back-arrow" @click="onClose">
      <i></i>
    </div>

    <slot></slot>

  </div>

</template>

<style src="./style.pcss" scoped lang="postcss"></style>

<script type="text/babel">

  import listener from 'event-listener'
  import { browser } from 'utils'

  export default {
    props: {
      isOpen: {
        type: Boolean,
        default: true
      },
      onClose: {
        type: Function,
        default: () => {
        }
      }
    },
    data(){
      return {
        isMobile: window.matchMedia( '(max-width: 750px)' ).matches
      }
    },
    ready(){

      this.resize = listener( window, 'optimizedResize', () => {

        const mobile = window.matchMedia( '(max-width: 750px)' ).matches;

        if ( mobile !== this.isMobile ) {

          this.$set( 'isMobile', mobile );

        }

      } )

    },
    beforeDestroy(){

      this.resize.remove();

    }
  }
</script>
