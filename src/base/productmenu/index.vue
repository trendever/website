<style src='./menu.pcss'></style>
<template lang="jade">
.header__menu(v-if="mobile")
 .header__menu-icon(@click='menuOpened = !menuOpened')
  ._bullet
 .header__menu-links.bubble.bubble--arrow.bubble--arrow-ne(v-if="menuOpened")
  a.header__menu-link(@click="menuOpened=false") Отмена
  //a.header__menu-link(@click="buyPromoProduct") Я блогер
  //a.header__menu-link(href='#') Найти блогера
  a.header__menu-link(v-link='{name:"product_repost", params: {id: productId}}') Пост в Instagram

</template>

<script>
  import settings from 'settings';
  import { createLead } from 'vuex/actions/lead';
  import { getOpenedProduct } from 'vuex/getters/products';
  export default{
    data: function(){
      
      return {
        menuOpened: false,
        mobile: window.browser.mobile
      }
    },
    vuex: {
      getters: {
        getOpenedProduct
      },
      actions: {
        createLead
      }
    },
    computed:{
      productId(){
        if (this.getOpenedProduct) return this.getOpenedProduct.id;
      }
    },
    methods: {
      buyPromoProduct(){
        this.createLead( settings.promoProductID )
            .then(
              ( lead ) => {
                if ( lead !== undefined && lead !== null ) {
                  this.$router.go( { name: 'chat', params: { id: lead.id } } );
                }
              }
            );
      }
    }
  }
</script>
