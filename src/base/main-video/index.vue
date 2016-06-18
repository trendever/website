<style src='./index.pcss'></style>
<template lang="jade">

  .main-video
    i(@click='closeVideo').ic-close
    iframe(v-if='isMobile',
      v-el:iframe-video-mobile,
      v-bind:style="{ height: width, width: width }",
      src="https://www.youtube.com/embed/IldZHx-naRA?autoplay=0&rel=1&vq=hd720",
      frameborder="0",
      allowfullscreen)

    iframe(v-if='!isMobile',
      v-el:iframe-video,
      v-bind:style="{ height: height, width: width }",
      src="https://www.youtube.com/embed/QPSw5RKJw3s?autoplay=0&rel=1",
      frameborder="0",
      allowfullscreen)

</template>

<script type="text/babel">

  import listen from 'event-listener';

  export default {
    data(){
      return {
        height:'300px',
        width:'300px',
        isMobile: false
      };
    },

    ready(){
      this.detectDevice();

      this.resize = listen( window, 'optimizedResize', () => {

        this.setSize();

      } ) ;

      this.$nextTick( () => {

        this.setSize();

      } );

    },

    beforeDestroy(){
      this.resize.remove();
    },

    methods: {
      detectDevice() {
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      },

      setSize(){
        const width = document.body.offsetWidth;
        const height = (720 * width) / 1280;
        this.$set( 'height', `${ height }px` );
        this.$set( 'width', `${ width }px` );
      },

      closeVideo(){
        window.history.back();
      }
    },

  };

</script>
