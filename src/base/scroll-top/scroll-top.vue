<style src="./style.pcss"></style>
<template lang='jade'>
.scroll-top( @click='up()', v-show="is_visible", :class='{"__fly": !isAuth}' )
  i.ic-arrow-up-thin(:class='{"arrow__down": !toUp}')
</template>

<script type="text/babel">
  import listen from 'event-listener';
  import { isAuth } from 'vuex/getters/user.js';

  export default {
    props:{

      toUp:{
        type: Boolean,
        default: true
      }

    },
    data(){
      return {
        is_visible: false,
      }
    },
    ready() {
      this.scrollCnt = document.querySelector( '.scroll-cnt' )
      this.toggleBtnOnScroll()
      this.scrollEvent = listen( this.scrollCnt, 'scroll', this.toggleBtnOnScroll.bind( this ) )
    },
    beforeDestroy() {
      if ( this.scrollEvent ) {
        this.scrollEvent.remove();
      }
    },
    methods: {
      toggleBtnOnScroll(){

        if ( this.toUp ) {

          this.is_visible = this.scrollCnt.scrollTop - (document.body.offsetHeight * 2) >= 0;

        } else {

          if(this.scrollCnt.scrollTop > 0){

            this.is_visible = this.scrollCnt.scrollTop < ( document.body.offsetHeight * 2 );

          }

        }

      },
      up() {

        if(this.toUp){

          this.scrollCnt.scrollTop = 0;

        } else {

          this.scrollCnt.scrollTop = this.scrollCnt.scrollHeight;

        }

/*        const step = ( scrollTop ) => {

          if ( scrollTop > 0 ) {

            setTimeout( () => {

              const newScrollTop = scrollTop - ( scrollTop / 20 )

              if ( newScrollTop <= 0 ) {

                window.scrollBy( 0, 0 );

              } else {

                window.scrollBy( 0, newScrollTop );

                step(newScrollTop);

              }

            }, 10 )

          }

        };

        step( this.scrollCnt.scrollTop );*/

      }
    },
    vuex: {
      getters: {
        isAuth
      }
    },
  }
</script>
