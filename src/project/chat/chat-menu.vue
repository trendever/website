<style src='./styles/chat-bar.pcss'></style>
<template lang="jade">
div
  menu-component(v-if='getShowMenu && !getShowStatusMenu')
    div.menu-items(slot='items')
      .menu_i(v-if='false')
        .menu_i_t Перечислить деньги
      .menu_i(v-if='false')
        .menu_i_t Выставить счет

      .menu_i(v-if='canCallCustomer', @click='callCustomer()')
        .menu_i_t Позвать покупателя в чат

      .menu_i(v-if='canCallSupplier', @click='callSupplier()')
        .menu_i_t Позвать магазин в чат

      .menu_i(v-if='isAdmin', @click='setShowStatusMenu(true)')
        .menu_i_t Изменить статус заказа
      label(class='menu_i menu_i-send-file') Отправить фото
        input(type='file', hidden, @change='selectedFile')

      .menu_i(v-if='false')
        .menu_i_t Добавить шаблон
      .menu_i(@click='setShowMenu(false)')
        .menu_i_t.__txt-green Отмена

  chat-menu-status( v-if='getShowStatusMenu')

</template>

<script type='text/babel'>
  import {
    getCurrentMember,
    getLeadId,
    getShowMenu,
    getShowStatusMenu,
    getInviteShop,
    getInviteCustomer,
  } from 'vuex/getters/chat.js';
  import {
    setShowMenu,
          setShowStatusMenu,
          addPreLoadMessage
  } from 'vuex/actions/chat.js';
  import * as leads from 'services/leads';
  import * as service from 'services/chat';
  import { ratioFit } from 'utils';

  import MenuComponent from 'base/menu/menu.vue';
  import ChatMenuStatus from './chat-menu-status.vue';

  export default{
    vuex: {
      actions: {
        setShowMenu,
        setShowStatusMenu,
        addPreLoadMessage
      },
      getters: {
        getCurrentMember,
        getLeadId,
        getShowMenu,
        getShowStatusMenu,
        getInviteShop,
        getInviteCustomer,
      }
    },

    methods: {
      selectedFile( { target } ){

        const MIME = target.files[ 0 ].type;
        const file = target.files[ 0 ];
        if ( MIME in { 'image/png': true, 'image/gif': true, 'image/jpg': true, 'image/jpeg': true } ) {

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

              this.setShowMenu( false );

              this.$nextTick( () => {

                window.scrollTo( 0, document.body.scrollHeight );

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
      },
    },

    computed: {
      isAdmin() {
        console.log(this.getCurrentMember.role);
        return !!(this.getCurrentMember.role === leads.USER_ROLES.SUPPLIER.key
        || this.getCurrentMember.role === leads.USER_ROLES.SELLER.key
        || this.getCurrentMember.role === leads.USER_ROLES.SUPER_SELLER.key);

      },
      canCallCustomer(){
        return this.isAdmin && this.getInviteCustomer;
      },
      canCallSupplier() {
        return  !!(this.getCurrentMember.role === leads.USER_ROLES.SELLER.key
                || this.getCurrentMember.role === leads.USER_ROLES.SUPER_SELLER.key)
                && this.getInviteShop;

      }
    },

    components: {
      MenuComponent,
      ChatMenuStatus
    }

  }
</script>
