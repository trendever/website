<style src="../../base/vars/vars.pcss"></style>
<template lang="jade">
scroll-component
  hero-component
  caption-component

  .section.main
    .section__content
     search-component
     photos-component(:tags="true", :search="true", list-id="home")
     navbar-component(current='feed')
     helps-component
</template>

<script type='text/babel'>
  import listen from 'event-listener';

  import NavbarComponent from 'base/navbar/navbar.vue'
  import ScrollComponent from 'base/scroll/scroll.vue'
  import HeroComponent from './hero.vue'
  import CaptionComponent from './caption.vue'
  import SearchComponent from './search.vue'
  import PhotosComponent from 'base/photos/photos.vue'
  import { setComeBack } from 'vuex/actions/products.js'
  import HelpsComponent from './helps.vue'

  import { isAuth } from 'vuex/getters/user';
  export default {
    created(){
      //Баг подвисания ещё
      this.$store.state.products.listId = '';
    },
    ready(){
      //показываем Auth button
      if( !this.isAuth ) {
        let scrollComp = document.querySelector('.scroll-cnt');
        this.showOnScroll = listen(scrollComp,'scroll',()=>{
          if(window.browser.mobile){
            if(scrollComp.scrollTop > 1200){
              this.$dispatch('showAuthBtn');
            }
          }
          if(!window.browser.mobile) {
            if(scrollComp.scrollTop > 600){
              this.$dispatch('showAuthBtn');
            }
          }

        });
      }

      this.$once('photosIsRun', () => {
        this.$broadcast('update');
      });
    },
    beforeDestroy(){
      if(this.showOnScroll){
        this.showOnScroll.remove();
      }
      this.setComeBack( false );
    },
    components: {
      ScrollComponent,
      NavbarComponent,
      SearchComponent,
      HeroComponent,
      CaptionComponent,
      PhotosComponent,
      HelpsComponent
    },
    vuex: {
      actions: {
        setComeBack
      }
    }
  }
</script>
