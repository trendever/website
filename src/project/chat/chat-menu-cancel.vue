<style src='./styles/chat-bar.pcss'></style>
<template lang="jade">
menu-component
  div.menu-items(slot='items')
    .menu_i(v-for="reason in cancelReasons" @click='setStatus("CANCEL", "lead.state.changed", reason.id)')
      .menu_i_t {{ reason.name }}
    .menu_i(@click='setShowCancelMenu(false),setShowStatusMenu(true)')
      .menu_i_t.__txt-green Назад
</template>

<script>
  import { setStatus, setShowStatusMenu, setShowCancelMenu } from 'vuex/actions/chat.js';

  import MenuComponent from 'base/menu/menu.vue';
  import * as leadService from 'services/leads';

  export default{
    data(){
      return {
        cancelReasons: []
      }
    },
    vuex: {
      actions: {
        setStatus,
        setShowStatusMenu,
        setShowCancelMenu,
      }
    },
    components: {
      MenuComponent
    },
    ready(){
      leadService.getCancelReasons().then(data=>{

        let reasons = data.reasons.filter(item=>{
          return item.id !== 1 && item.id !== 2;
        });

        this.$set('cancelReasons', reasons);

      })
    }
  }
</script>
