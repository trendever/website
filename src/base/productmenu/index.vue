<style src='./menu.pcss'></style>
<template lang="jade">
.header__menu(v-if="isMobile && notFromUser")
 .header__menu-icon(@click.stop='menuOpened = !menuOpened', v-show="showBullets")
  i.ic-menu_bullets
 .header__menu-links.bubble.bubble--arrow.bubble--arrow-ne(v-if="menuOpened")
  a.header__menu-link(@click="menuOpened=false") Отмена
  a.header__menu-link
    service-buy(:product-id="promoProductId") Я блогер
  a(v-if="isAuthUserProduct").header__menu-link
    service-buy(:product-id="editProductId") Редактировать товар
  //-a.header__menu-link(href='#') Найти блогера
  a.header__menu-link(
  v-link='{name:"product_repost", params: {id: productId}}') Пост в Instagram

</template>

<script>
  import listen from 'event-listener';
  import { targetClass } from 'utils';
  import serviceBuy from 'base/service-buy/service-buy';
  import settings from 'settings';
  import { createLead } from 'vuex/actions/lead';
  import { getOpenedProduct, isAuthUserProduct } from 'vuex/getters/products';

  export default{
    components:{
      serviceBuy
    },
    data: function(){

      return {
        menuOpened: false,
        showBullets: true,
        isMobile: window.browser.mobile,
        editProductId: 32929,
        promoProductId: settings.promoProductID

      }
    },
    ready(){
      let scrollCnt = document.querySelector('.scroll-cnt');
      this.scrollListen = listen(scrollCnt, 'click',(e)=>{

        targetClass(e, 'menu-cnt', ()=>{
          if(this.menuOpened) {
             this.menuOpened = false;
          }

        });

      })
      if(window.matchMedia('(max-width: 750px)').matches) {

        this.scrollListen = listen(scrollCnt,'scroll',()=>{

          this.showBullets = scrollCnt.scrollTop > 85 ? false : true;

        });
      }
    },
    beforeDestroy(){
      if(this.scrollListen) {

        this.scrollListen.remove();

      }
    },
    vuex: {
      getters: {
        getOpenedProduct,
        isAuthUserProduct
      },
      actions: {
        createLead
      }
    },
    computed:{
      notFromUser(){
        if (window.entryPoint == "user"){
          return false;
        }
        return true
      },
      productId(){
        if (this.getOpenedProduct) return this.getOpenedProduct.id;
      }
    }
  }
</script>
