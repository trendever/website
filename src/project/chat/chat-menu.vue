<style src="./styles/chat-bar.pcss"></style>
<template lang="jade">

div
  menu-component(v-if="menuActive && !statusMenuActive")
    div(slot="items")
      .menu_i
        .menu_i_t Отправить условия доставки
      .menu_i
        .menu_i_t Отправить условия оплаты
      .menu_i
        .menu_i_t Позвать магазин в чат
      .menu_i(@click="statusMenuActive=true")
        .menu_i_t Изменить статус заказа
      .menu_i
        .menu_i_t Отправить фото
      .menu_i(@click="menuActive=false")
        .menu_i_t.__txt-green Отмена

  chat-menu-status(
  v-if="statusMenuActive",
  :status-menu-active.sync="statusMenuActive")

</template>

<script>
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

    components: {
      MenuComponent,
      ChatMenuStatus
    }

  }
</script>