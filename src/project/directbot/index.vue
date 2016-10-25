<style src="../../base/vars/vars.pcss"></style>
<template lang="jade">
.status_bar(v-if='isAuth || showStatusBar')

scroll-component
  hero-component
</template>

<script type='text/babel'>
  import listen from 'event-listener';

  import NavbarComponent from 'base/navbar/navbar.vue'
  import ScrollComponent from 'base/scroll/scroll.vue'
  import HeroComponent from './hero.vue'
  import PhotosComponent from 'base/photos/photos.vue'
  import { setComeBack } from 'vuex/actions/products.js'

  import { isAuth } from 'vuex/getters/user';
  export default {
    data(){
      if (browser.mobile && !browser.standalone){
        document.location = 'tndvr://';
      }
      return {showStatusBar: false};
    },
    created(){
      //Баг подвисания ещё
      this.$store.state.products.listId = '';
    },

    route: {
      canDeactivate({ to, next }){
        if( to.name === 'product_detail') {
          this.$store.state.user.showRootLoader = true;
          next();
        } else {
          next();
        }
      }
    },
    ready(){
      //показываем Auth button
      if( !this.isAuth ) {
        let scrollComp = document.querySelector('.scroll-cnt');
        let lookinside_button = document.getElementById('lookinside');
        this.showOnScroll = listen(scrollComp,'scroll',()=>{
          if(window.browser.mobile){
            if(scrollComp.scrollTop > 2000){
              this.$dispatch('showAuthBtn');
            } else {
              this.$dispatch('hideAuthBtn');
            }
            if(lookinside_button.getBoundingClientRect().top < 0){
              this.showStatusBar = true;
            }else{
              this.showStatusBar = false;
            }
          }
          if(!window.browser.mobile) {
            if(scrollComp.scrollTop > 700){
              this.$dispatch('showAuthBtn');
            } else {
              this.$dispatch('hideAuthBtn');
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
      HeroComponent,
      PhotosComponent,
    },
    vuex: {
      actions: {
        setComeBack
      },
      getters: {
        isAuth
      }
    }
  }
</script>
