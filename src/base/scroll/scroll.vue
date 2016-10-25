<style src="./style.pcss"></style>
<template lang="jade">
.scroll-cnt(v-on:touchstart="onStart",
            v-on:touchmove="onMove",
            v-on:touchend="onEnd",
            ref="scrollEl")

  //- h1(v-if="showUpdate",
    style="position: fixed; top: 50px; left: 0; z-index: 100; background: blue; height: 50px; width: 300px")
              | Pull down to reload

  //-.splash-spinner(v-if="updating")
    splash-spinner-component

  slot
</template>

<script type="text/babel">
  import listen from 'event-listener'

  import { browser } from 'utils'
  //-import SplashSpinnerComponent from 'base/splash-spinner/splash-spinner.vue'

  export default {
    data(){
      return {
        showUpdate: false,
        updating: false,
        startPanY: null,
        endPanY: null,
        updateOnPanDown: false,
      }
    },

    components: {
      //-SplashSpinnerComponent
    },

    beforeDestroy() {
      if ( this.rubberEvent ) {
        this.rubberEvent.remove()
      }
    },

    mounted(){
      this.$nextTick(()=>{

        this.updateOnPanDown = browser.standalone

        if ( browser.ios ) {
          // Disable rubber scroll in ios devices
          this.rubberEvent = listen(this.$refs.scrollEl , "touchstart", () => {

              var top = this.$refs.scrollEl.scrollTop,
                  totalScroll = this.$refs.scrollEl.scrollHeight,
                  currentScroll = top + this.$refs.scrollEl.offsetHeight

              if ( top === 0 ) {
                  this.$refs.scrollEl.scrollTop = 1
              } else if ( currentScroll === totalScroll ) {
                  this.$refs.scrollEl.scrollTop = top - 1
              }

          } );

        }

      })

    },

    computed: {
      minPanToUpdate() {
        return document.body.offsetHeight * 0.30
      },
      distanceFromStartPanY() {
        return this.endPanY - this.startPanY
      },
    },

    methods: {
      onStart(e){
        if (!this.updateOnPanDown) {
          return
        }

        this.endPanY = null
      },

      onMove(e){

        if (!this.updateOnPanDown) {
          return
        }

        if (this.$refs.scrollEl.scrollTop <= 0) {

          if (this.startPanY === null) {
            this.startPanY = e.changedTouches[0].clientY
            return
          }

          this.endPanY = e.changedTouches[0].clientY

          if ((this.minPanToUpdate / 2 - this.distanceFromStartPanY) <= 0) {
            this.showUpdate = true
            //document.body.style.background = "red"
          } else {
            this.showUpdate = false
            document.body.style.background = "white"
          }
          //console.log("to update", this.minPanToUpdate - this.distanceFromStartPanY);
        }

      },

      onEnd(e){
        if (!this.updateOnPanDown) {
          return
        }

        if (this.distanceFromStartPanY >= this.minPanToUpdate) {
          this.updating = true
          window.location.reload()
        }

        document.body.style.background = "white"
        this.showUpdate = false
        this.startPanY = null
      },
    },
  }
</script>
