<style src='./menu.pcss'></style>
<style lang="postcss">
@import 'base/vars/vars.pcss';

.profile-header__menu-links.__desktop {
    position: absolute 54px * * 230px;
    margin: initial;
    max-width: 210px;
    border: 1px solid #BFBFBF;
    border-radius: 5px;
    box-shadow: 1px 1px 3px grey;
    background-color: #F0F0F0;

    &::before {
      content: '';
      position: absolute -13px * * 30px;
      size: 0;
      border-left: 11px solid transparent;
      border-right: 11px solid transparent;
      border-bottom: 13px solid #BFBFBF;

    }

    &::after {
      content: '';
      position: absolute -12px * * 30px;
      size: 0;
      border-left: 11px solid transparent;
      border-right: 11px solid transparent;
      border-bottom: 13px solid #F0F0F0;

    }

    :first-child{
      border-top-right-radius: 4px;
      border-top-left-radius: 4px;
    }

    :last-child {
      border-bottom-right-radius: 5px;
      border-bottom-left-radius: 5px;
    }

    .profile-header__menu-link {
      text-align: left;
      line-height: 2.8rem;
      font-size: 1.4rem;
      background-color: initial;
      width: 208px;
      border: initial;
      &:hover {
        color: $color__green;
        background: #D9D9D9;
      }
    }
}

</style>
<template lang="jade">
.header__menu
 .header__menu-icon(@click='menuOpened = !menuOpened')
  i.ic-menu_bullets
 .header__menu-links.bubble.bubble--arrow.bubble--arrow-ne(v-if="menuOpened")
  a.header__menu-link(@click="menuOpened=false") Отмена
  a.header__menu-link(@click="buyPromoProduct") Я блогер
  //a.header__menu-link(href='#') Найти блогера
  a.header__menu-link(
  v-link='{name:"product_repost", params: {id: productId}}',
  v-if="isMobile") Пост в Instagram

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
    events:{
      'closeProductMenu'(){
        this.menuOpened = false;
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
