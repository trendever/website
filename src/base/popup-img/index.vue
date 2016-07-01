<template>

  <popup-container>

    <div class="container" v-el:container>
      <div class="img-keeper" v-el:img>

        <img class="picture" @load="resizeImg" :src="url" alt="">

      </div>
    </div>

  </popup-container>

</template>

<style src="./style.pcss" scoped lang="postcss"></style>

<script type="text/babel">

  import listener from 'event-listener'
  import { browser } from 'utils'
  import popupContainer from '../popup-container/index.vue'

  const memoize = {};

  export default {
    data(){

      return {}

    },
    ready(){
      this.resize = listener( window, 'optimizedResize', this.resizeImg.bind( this ) )
    },
    beforeDestroy(){

      this.resize.remove()

    },
    props: {
      url: {
        type: String,
        default: 'https://187308.selcdn.ru/dev/upload/thumbnail/dnvwjKZ/big',
      }
    },
    methods: {

      resizeImg(){

        const { clientWidth, clientHeight } = this.$els.img;
        const { clientWidth: contWidth, clientHeight: contHeight } = this.$els.container;

        let imgWidth  = 0;
        let imgHeight = 0;

        if ( contWidth > 750 ) {

          imgWidth  = contWidth - 208;
          imgHeight = (clientHeight * imgWidth) / clientWidth;

        } else {

          imgWidth = contWidth;
          imgHeight = (clientHeight * imgWidth) / clientWidth;

        }

        if ( imgHeight < contHeight - 208 ) {

          this.$els.img.style.width  = `${imgWidth}px`
          this.$els.img.style.height = `${imgHeight}px`

          this.$els.img.style.marginLeft = `-${imgWidth / 2}px`
          this.$els.img.style.marginTop  = `-${imgHeight / 2}px`

        }

      }

    },
    components: {
      popupContainer
    }
  }
</script>
