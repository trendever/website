<style src='./index.pcss'></style>
<template lang="jade">

  .main-video(v-if='videoShowed')
    i(@click='closeVideo').ic-close
    iframe(v-el:iframe-video, width="100%", src="https://www.youtube.com/embed/QPSw5RKJw3s?autoplay=0&rel=1", frameborder="0", allowfullscreen)

</template>

<script type="text/babel">

  import listen from 'event-listener';
  import { isAuth } from 'vuex/getters/user.js';
  export default {
    data(){
      return {
        videoShowed: false,
        resize: null
      };
    },
    props: {
      isOpen: {
        type: Boolean,
        default: false
      },
      onClose: {
        type: Function,
        default: () => {

        }
      }
    },
    methods: {
      setSize(){
        const height                       = (720 * this.$els.iframeVideo.offsetWidth) / 1280;
        this.$els.iframeVideo.style.height = `${ height }px`;
      },
      openVideo(){

        if ( this.resize === null ) {

          this.$set( 'videoShowed', true );

          this.$nextTick( () => {

            this.$set( 'resize', listen( window, 'optimizedResize', () => {

              this.setSize();

            } ) );

            this.setSize();

          } );

        }

      },
      closeVideo(){

        this.$set( 'videoShowed', false );

        if ( this.resize !== null ) {

          this.resize.remove();

        }

        this.$set( 'resize', null );

        this.onClose();

      }
    },
    watch: {
      isOpen( value ){
        if ( value ) {
          this.openVideo();
        }
      }
    },
    vuex: {
      getters: {
        isAuth,
      },
    },
  };

</script>
