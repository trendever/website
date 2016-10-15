<template>
  <div class="picture" v-bind:style='{ opacity: opacityImg }' v-el:pic>
    <img :width="width" :height="height" :src="srcImg">
  </div>
</template>

<style src="./style.pcss" scoped lang="postcss"></style>

<script type="text/babel">
  export default {
    data(){
      return {
        srcImg: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
        opacityImg: 0
      }
    },
    ready(){
      this.loadImg( this.img );
      console.log(this.$els.pic.offsetWidth);
    },
    methods: {

      loadImg( url ){
        this.$set( 'opacityImg', 0 );
        this.$set( 'srcImg', url );
        // Load and set full image.
        let img = new Image();
        img.load( url, null, null, () => {
          this.$set( 'srcImg', url );
          this.$set( 'opacityImg', 1 );
          this.$store.state.user.showRootLoader = false;
        } );
      }
    },
    props: {
      img: {
        type: String,
        default: null
      },
      width: {
        type: String,
        default: '100%'
      },
      height: {
        type: String,
        default: '100%'
      }
    },
    watch: {
      img( newImg ){
        this.loadImg( newImg );
      }
    }
  }
</script>
