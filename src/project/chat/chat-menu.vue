<style src="./styles/chat-bar.pcss"></style>
<template lang="jade">

div
  menu-component(v-if="menuActive && !statusMenuActive")
    div(slot="items")
      //-.menu_i
        .menu_i_t Отправить условия доставки
      //-.menu_i
        .menu_i_t Отправить условия оплаты

      .menu_i(v-if="isAdmin")
        .menu_i_t Позвать покупателя в чат

      .menu_i(v-if="canCallSupplier")
        .menu_i_t Позвать магазин в чат

      .menu_i(v-if="isAdmin",
              @click="statusMenuActive=true")
        .menu_i_t Изменить статус заказа

      //-.menu_i
        .menu_i_t Отправить фото

      .menu_i(@click="menuActive=false")
        .menu_i_t.__txt-green Отмена

  chat-menu-status(
  v-if="statusMenuActive",
  :status-menu-active.sync="statusMenuActive")

</template>

<script>
  import {
    currentChatMember,
  } from 'vuex/getters';
  import * as leads from 'services/leads';

  import MenuComponent from 'base/menu/menu.vue';
  import ChatMenuStatus from './chat-menu-status.vue';

  export default{
    data: () => ({
      statusMenuActive: false,
    }),

    props: {
      menuActive: {
        type: Boolean,
        required: true,
      }
    },

    vuex: {
      getters: {
        currentChatMember,
      }
    },

    computed: {
      isAdmin: function() {
        if (this.currentChatMember.role === leads.USER_ROLES.SUPPLIER.key
          || this.currentChatMember.role === leads.USER_ROLES.SELLER.key
          || this.currentChatMember.role === leads.USER_ROLES.SUPER_SELLER.key) {
          return true;
        }
        return false;
      },
      canCallSupplier: function() {
        if (this.currentChatMember.role === leads.USER_ROLES.SELLER.key
          || this.currentChatMember.role === leads.USER_ROLES.SUPER_SELLER.key) {
          return true;
        }
        return false;
      }
    },

    components: {
      MenuComponent,
      ChatMenuStatus
    }

  }
</script>