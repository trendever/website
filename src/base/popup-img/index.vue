<template>

  <popup-container :on-close="onClose">

    <div class="img-container" v-el:container>
      <div class="img-keeper" v-el:img>

        <img class="picture" @load="resizeImg" :src="url" alt="">

      </div>

      <div class="close-block" @click="onClose"></div>

    </div>

  </popup-container>

</template>

<style src="./style.pcss" scoped lang="postcss"></style>

<script type="text/babel">

  import listener from 'event-listener'
  import { browser, ratioFit } from 'utils'
  import popupContainer from '../popup-container/index.vue'

  const memoize = {};

  export default {
    data(){

      return {}

    },
    ready(){
      this.resize = listener( window, 'optimizedResize', this.resizeImg.bind( this ) );
      this.resizeImg();
    },
    beforeDestroy(){

      this.resize.remove()

    },
    props: {
      url: {
        type: String,
        default: 'https://187308.selcdn.ru/dev/upload/thumbnail/dnvwjKZ/big',
      },
      width: {
        type: Number,
        default: 1280
      },
      height: {
        type: Number,
        default: 850
      },
      onClose: {
        type: Function,
        default: () => {
          console.log( 'Вы можете обработать этот эвент закрытия img-container' );
        }
      }
    },
    methods: {

      resizeImg(){

        const { clientWidth: contWidth, clientHeight: contHeight } = this.$els.container;

        const padding = 208;

        const containerWidth  = ( contWidth - padding > this.width ) ? this.width : contWidth - padding;
        const containerHeight = contHeight - padding;

        let imgWidth  = containerWidth;
        let imgHeight = containerHeight;

        if ( contWidth > 750 ) {

          if ( this.height < this.width ) {

            imgHeight = ( this.height * imgWidth ) / this.width;

            if ( imgHeight > containerHeight ) {

              const res = ratioFit( this.width, this.height, imgWidth, containerHeight );

              imgHeight = res.height;

            }

          } else {

            const res = ratioFit( this.width, this.height, imgWidth, imgHeight );

            imgWidth  = res.width;
            imgHeight = res.height;

          }

        } else {

          if ( this.height < this.width ) {

            imgWidth  = contWidth;
            imgHeight = ( this.height * imgWidth ) / this.width;

          } else {

            const res = ratioFit( this.width, this.height, contWidth, imgHeight );

            imgWidth  = res.width;
            imgHeight = res.height;

          }

        }

        if ( imgHeight <= containerHeight ) {

          this.$els.img.style.width  = `${imgWidth}px`;
          this.$els.img.style.height = `${imgHeight}px`;

          this.$els.img.style.marginLeft = `-${imgWidth / 2}px`;
          this.$els.img.style.marginTop  = `-${imgHeight / 2}px`;

        }

      }

    },
    components: {
      popupContainer
    }
  }
</script>
