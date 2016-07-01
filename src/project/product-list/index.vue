<template lang="jade">
scroll-component
  hero-component
  caption-component

  .section.main
    .section__content
      search-component
      photos-component(:tags="true", :search="true", list-id="home")
      navbar-component(current='feed')
</template>

<script type='text/babel'>
  import NavbarComponent from 'base/navbar/navbar.vue'
  import ScrollComponent from 'base/scroll/scroll.vue'
  import HeroComponent from './hero.vue'
  import CaptionComponent from './caption.vue'
  import SearchComponent from './search.vue'
  import PhotosComponent from 'base/photos/photos.vue'
  import { setComeBack } from 'vuex/actions/products.js'


  export default {
    ready(){
      this.$once('photosIsRun', () => {
        this.$broadcast('update');
      });
    },
    beforeDestroy(){
      this.setComeBack( false );
    },
    components: {
      ScrollComponent,
      NavbarComponent,
      SearchComponent,
      HeroComponent,
      CaptionComponent,
      PhotosComponent
    },
    vuex: {
      actions: {
        setComeBack
      }
    }
  }
</script>
