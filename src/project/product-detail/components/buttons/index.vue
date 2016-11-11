<template>
<div v-if="loaded || !isAuth">
  <div class="buttons" :class="{'glued-btns': isMobile && !authSellerProduct}" v-if="!authSellerProduct">
    <div class="leftSide">
      <button class="save_btn" @click="like" :class="{ 'active': isLiked, 'default': !isLiked}">
      {{text}}
      </button>
    </div>
    <div class="rightSide">
      <button class="buy_btn" @click="buy">КУПИТЬ</button>
    </div>
  </div>

  <div class="find-bloger" v-if="authSellerProduct" @click="buyServiceProduct">Найти блогера</div>
</div>

</template>

<style src="./style.pcss" scoped lang="postcss"></style>

<script type="text/babel">
  import { isAuth } from 'vuex/getters/user';
  import { createLead } from 'vuex/actions/lead';
  import config from '../../../../../config';
  export default {
    vuex: {
      getters: {
        isAuth
      },
      actions: {
        createLead
      }
    },
    ready(){
      this.$on('isAuthProduct',()=>{
        this.loaded = true;
      });
    },
    methods:{
      buyServiceProduct(){

        let productId = config.service_product_id === null ? 7833 : config.service_product_id;

        this
          .createLead( productId )
          .then(
            ( lead ) => {
              if ( lead !== undefined && lead !== null ) {
                this.$router.go( { name: 'chat', params: { id: lead.id } } )
              }
            }
          )
          .catch(
            ( error ) => {
              if ( error === leads.ERROR_CODES.UNATHORIZED ) {
                this.$router.go( { name: 'signup' } )
              }
            }
          )
      }
    },
    computed: {
      text(){
        return (this.isLiked) ? 'СОХРАНЕНО' : 'СОХРАНИТЬ';
      }
    },
    props: {
      loaded: {
        type: Boolean,
        default: false
      },
      authSellerProduct: {
        type: Boolean,
        default: false
      },
      isLiked: {
        type: Boolean,
        default: false
      },
      isMobile: {
        type: Boolean,
        default: false
      },
      supplierAvailable: {
        type: Boolean,
        default: false
      },
      productId: {
        type: Number,
        default: 0
      },
      like: {
        type: Function,
        default: () => {

        }
      },
      buy: {
        type: Function,
        default: () => {

        }
      },
      buyPromoProduct: {
        type: Function,
        default: () => {

        }
      }
    }
  }
</script>
