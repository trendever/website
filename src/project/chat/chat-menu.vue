<style src='./styles/chat-bar.pcss'></style>
<template lang="jade">
div
  .loader-center(v-if="imgLoader"): app-loader
  menu-component(v-if='getShowMenu && !getShowStatusMenu')
    div.menu-items(slot='items', :class="{'directbot-color': isDirectbot}")

      //-.menu_i(v-if='canCallCustomer', @click='callCustomer()')
        .menu_i_t Позвать покупателя в чат

      //-.menu_i(v-if='canCallSupplier', @click='callSupplier()')
        .menu_i_t Позвать магазин в чат

      .menu_i(v-if='notCustomer', @click='setShowStatusMenu(true)')
        .menu_i_t Изменить статус заказа

      .menu_i(@click='openPayment()' v-if="noActivePayments")
        .menu_i_t Запросить деньги

      label(class='menu_i menu_i-send-file') Отправить фото
        input(type='file', hidden, @change='selectedFile')

      .menu_i(v-if='false')
        .menu_i_t Добавить шаблон
      .menu_i(@click='setShowMenu(false)')
        .menu_i_t(:class="{'directbot-color': isDirectbot, '__txt-green': !isDirectbot}") Отмена

  chat-menu-status( v-if='getShowStatusMenu')
  chat-menu-cancel( v-if='getShowCancelMenu')

</template>

<script type='text/babel'>
  import listen from 'event-listener';
  import store from 'vuex/store';
  import { targetClass } from 'utils';
  import {
    getShopId,
    getCurrentMember,
    getLeadId,
    getShowMenu,
    getShowStatusMenu,
    getShowCancelMenu,
    getInviteShop,
    getCustomerId,
    getInviteCustomer,
    getAction,
    imgLoader,
  } from 'vuex/getters/chat.js';

  import { setConversationImgLoader } from 'vuex/actions/chat';
  import { setPayment} from 'vuex/actions/user';

  import {
    setShowMenu,
    setShowStatusMenu,
    addPreLoadMessage,
    setShowCancelMenu,
  } from 'vuex/actions/chat.js';
  import * as leads from 'services/leads';
  import * as service from 'services/chat';
  import { ratioFit } from 'utils';

  import MenuComponent from 'base/menu/menu.vue';
  import ChatMenuStatus from './chat-menu-status.vue';
  import ChatMenuCancel from './chat-menu-cancel.vue';
  import AppLoader from 'base/loader/loader';

  export default{
    vuex: {
      actions: {
        setConversationImgLoader,
        setShowMenu,
        setShowStatusMenu,
        setShowCancelMenu,
        addPreLoadMessage,
        setPayment
      },
      getters: {
        getCustomerId,
        imgLoader,
        getShopId,
        getCurrentMember,
        getLeadId,
        getShowMenu,
        getShowStatusMenu,
        getShowCancelMenu,
        getInviteShop,
        getInviteCustomer,
        getAction,
      }
    },
    data(){
      return {
        loadImg: false
      }
    },
    ready(){
      let scrollCnt = document.querySelector('.scroll-cnt');

      this.outerCloseMenu = listen(scrollCnt, 'click',(e)=>{

        targetClass(e, 'menu-cnt', ()=>{
          if(getShowMenu) {
             this.setShowMenu(false);
             this.setShowStatusMenu(false);
             this.setShowCancelMenu(false);
          }

        });

      })
    },
    beforeDestroy(){
      this.outerCloseMenu.remove();
    },
    methods: {
      openPayment(){
        this.setPayment({shopId: this.paymentShopId(),leadId: this.getLeadId});
        this.$router.go( { name: 'payment'} );
      },
      paymentShopId(){
        //если простой покупатель
        if(this.getCurrentMember.role === 1){
          return 0;
        }
        //если селлер или shop
        return this.getShopId;
      },
      selectedFile( { target } ){
        const MIME = target.files[ 0 ].type;
        const file = target.files[ 0 ];
        if ( MIME in { 'image/png': true, 'image/gif': true, 'image/jpg': true, 'image/jpeg': true } ) {

          this.setShowMenu( false );
          this.setConversationImgLoader(true);

          const reader = new FileReader();
          const image  = new Image();

          reader.addEventListener( 'loadend', () => {

            image.addEventListener("load",() => {

              let base64Prefix = `data:${MIME};base64,`;

              this.addPreLoadMessage(
                reader.result.substr( base64Prefix.length, reader.result.length ),
                reader.result,
                'image/base64',
                ratioFit(image.width, image.height, 570, image.height)
              );



              this.$nextTick( () => {

                window.scrollTo( 0, document.body.scrollHeight );

                this.$dispatch('goToBottom');

              } );

            });

            image.src = reader.result;


          } );

          reader.readAsDataURL( file );

        } else {

          alert(`Выберите картинку в формате: .png, .git, .jpg, .jpeg`);

        }

      },
      callCustomer() {
        service.callCustomer(this.getLeadId);
        this.setShowMenu(false);
      },
      callSupplier() {
        service.callSupplier(this.getLeadId);
        this.setShowMenu(false);
      }
    },

    computed: {
      noActivePayments(){
        console.log("NO ACTIVE")
        console.log(this.getAction !== 'pendingpayment');
        return this.getAction !== 'pendingpayment';
      },
      notCustomer(){
        return this.getCustomerId !== this.$store.state.user.myId;
      },
      canCallCustomer(){
        return this.getCustomerId !== this.$store.state.user.myId && this.getInviteCustomer;
      },
      canCallSupplier() {
        return this.getInviteShop;
      }
    },

    components: {
      AppLoader,
      MenuComponent,
      ChatMenuStatus,
      ChatMenuCancel
    }

  }
</script>
