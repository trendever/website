<style src="../../base/vars/vars.pcss"></style>
<style>
  .hello__auth__btn{
    position: absolute;
    bottom: 0;
    z-index: 100;
  }
  @media only screen and (min-width: 752px) and (max-width: 2560px) {
    button.hello__auth__btn{
      display: none;
    }
  }
</style>
<template lang="jade">
scroll-component
  hero-component
  caption-component

  .section.main
    .section__content
     search-component
     photos-component(:tags="true", :search="true", list-id="home")
     button(v-if="!isAuth").btn.btn_primary.__orange.__xl.hello__auth__btn.fast__big__btn( v-link="{ name: 'signup' }") Вход и регистрация
     navbar-component(current='feed')
     helps-component
</template>

<script type='text/babel'>
  import NavbarComponent from 'base/navbar/navbar.vue'
  import ScrollComponent from 'base/scroll/scroll.vue'
  import HeroComponent from './hero.vue'
  import CaptionComponent from './caption.vue'
  import SearchComponent from './search.vue'
  import PhotosComponent from 'base/photos/photos.vue'
  import { setComeBack } from 'vuex/actions/products.js'
  import HelpsComponent from './helps.vue'


  export default {
    created(){
      //Баг подвисания ещё
      this.$store.state.products.listId = '';
    },
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
