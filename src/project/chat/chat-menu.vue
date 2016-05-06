<style src="./styles/chat-bar.pcss"></style>
<template lang="jade">
div
  menu-component(v-if="getShowMenu && !getShowStatusMenu")
    div(slot="items")
      //-.menu_i
        .menu_i_t Отправить условия доставки
      //-.menu_i
        .menu_i_t Отправить условия оплаты

      .menu_i(v-if="isAdmin", @click="callCustomer()")
        .menu_i_t Позвать покупателя в чат

      .menu_i(v-if="canCallSupplier", @click="callSupplier()")
        .menu_i_t Позвать магазин в чат

      .menu_i(v-if="isAdmin", @click="setShowStatusMenu(true)")
        .menu_i_t Изменить статус заказа

      //-.menu_i
        .menu_i_t Отправить фото

      .menu_i(@click="setShowMenu(false)")
        .menu_i_t.__txt-green Отмена

  chat-menu-status( v-if="getShowStatusMenu")

</template>

<script>
  import {
    getCurrentMember,
    getId,
    getShowMenu,
    getShowStatusMenu,
  } from 'vuex/getters/chat.js';
  import {
    setShowMenu,
    setShowStatusMenu
  } from 'vuex/actions/chat.js';
  import * as leads from 'services/leads';
  import * as service from 'services/chat';

  import MenuComponent from 'base/menu/menu.vue';
  import ChatMenuStatus from './chat-menu-status.vue';

  export default{
    vuex: {
      actions: {
        setShowMenu,
        setShowStatusMenu,
      },
      getters: {
        getCurrentMember,
        getId,
        getShowMenu,
        getShowStatusMenu,
      }
    },

    methods: {
      callCustomer() {
        service.callCustomer(this.getId);
        this.setShowMenu(false);
      },
      callSupplier() {
        service.callSupplier(this.getId);
        this.setShowMenu(false);
      },
    },

    computed: {
      isAdmin() {
        return !!(this.getCurrentMember.role === leads.USER_ROLES.SUPPLIER.key
        || this.getCurrentMember.role === leads.USER_ROLES.SELLER.key
        || this.getCurrentMember.role === leads.USER_ROLES.SUPER_SELLER.key);

      },
      canCallSupplier() {
        return !!(this.getCurrentMember.role === leads.USER_ROLES.SELLER.key
        || this.getCurrentMember.role === leads.USER_ROLES.SUPER_SELLER.key);

      }
    },

    components: {
      MenuComponent,
      ChatMenuStatus
    }

  }
</script>