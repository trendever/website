<template>

  <popup-container :on-close="onClose">

    <div class="img-container" v-el:container>
      <div class="img-keeper" v-el:img>

        <img v-el:picture class="picture" @load="resizeImg"
         :src="url" alt=""
         v-touch:pinchMove="pinchMove($event)"
         v-touch:pinchEnd="pinchEnd($event)"
         v-touch:panMove="panMove($event)"
         v-touch:panEnd="panEnd($event)"
         v-touch-options:pan="{ threshold: 20 }"
         v-touch:doubletap="imgTaps">
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

      return {
        deltaY: 0,
        deltaX: 0,
        currentScale: 1,
        isScaled: false
      }

    },
    ready(){
      this.scrollcnt = document.querySelector('.scroll-cnt');
      this.scrollcnt.style.overflow = 'hidden';


      this.resize = listener( window, 'optimizedResize', this.resizeImg.bind( this ) );
      this.resizeImg();
    },
    beforeDestroy(){
      this.scrollcnt.style.overflow = 'auto';
      this.resize.remove();

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
      imgTaps(){
        if(!window.browser.mobile){
          return;
        }
        if(!this.isScaled){
          this.$set('isScaled', true);
          this.$set('currentScale', 2 );
          this.$els.picture.style.transform = `translate(${this.deltaX}px,${this.deltaY}px) scale(${this.currentScale})`;

          return;
        }
        this.$set('currentScale', 1 );
        this.$set('deltaX', 0 );
        this.$set('deltaY', 0 );
        this.$set('isScaled', false);

        this.$els.picture.style.transform = `translate(${this.deltaX}px,${this.deltaY}px) scale(${this.currentScale})`;

      },
      pinchMove(e){

        let scale = getRelativeScale(e.scale, this.currentScale);
        event.target.style.transform = `translate(${this.deltaX}px,${this.deltaY}px) scale(${scale})`;
      },
      pinchEnd(e){

        let scale = getRelativeScale(e.scale, this.currentScale);
        this.currentScale = scale;
        this.$set('isScaled', true);
      },
      panMove(event){
        if(!window.browser.mobile){
          return;
        }
        let DeltaX = this.deltaX + event.deltaX;
        let DeltaY = this.deltaY + event.deltaY;
        event.target.style.transform = `translate(${DeltaX}px,${DeltaY}px) scale(${this.currentScale})`;

      },
      panEnd(event){
        this.deltaX += event.deltaX;
        this.deltaY += event.deltaY;

      },
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
              imgWidth = res.width;

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


  function getRelativeScale(scale,currentScale) {
    return scale * currentScale;
  }
</script>
