<template lang="jade">
.right-nav(v-if="isAuth && !isMobile")
  .right-nav_i(:class='{"__active": current=="profile"}', v-link='{name: "profile"}')
    i.ic-user_menu
  .right-nav_i(:class='{"__active": current=="chat"}', v-link='{name: "chat_list"}')
    i.ic-chats_menu
    .notify-cout(v-if="getGlobalNotifyCount")
      span {{ getGlobalNotifyCount }}
  .right-nav_i(:class='{"__active": current=="feed"}', v-link='{name: "home"}')
    i.ic-gallery_menu
</template>

<script>
import { isAuth } from 'vuex/getters/user';
import { getGlobalNotifyCount } from 'vuex/getters/lead.js';
export default {
  vuex:{
    getters:{
      isAuth,
      getGlobalNotifyCount
    }
  },
  props:{
    current: {
      type: String,
      default: null
    }
  },
  data () {
    return {

    };
  },

  computed:{
    isMobile(){
      return window.browser.mobile;
    }
  }
};
</script>

<style lang="postcss">

@import 'base/vars/vars.pcss';

.right-nav {

  position: absolute;
  top:0;
  right:18px;
  z-index: 999;

  .right-nav_i {
    position: relative;
    height: 50px;
    width: 50px;
    display: inline-block;
    float: right;
    text-align: center;
    vertical-align:middle;
    padding-top: 8px;
    cursor:pointer;
    &:hover {
      background: $color__dark-green;
    }
    &.__active {
      background: $color__dark-green;
    }
    i.ic-user_menu{
      width: 50px;
      height: 60px;
    }
    i.ic-user_menu, i.ic-gallery_menu, i.ic-chats_menu  {
      font-size: 32px;
      color: white;
    }

    .notify-cout{
      position: absolute;
      z-index: 1000;
      top: 3px;
      right: 3px;
      display: flex;
      min-width: 23px;
      height: 23px;
      padding: 0 3px;

      border-radius: 15px;
      background: #EF3758;
      font-size: 10px;
      align-items: center;
      justify-content: center;
      span {
        color: white;
      }
    }
  }
}

</style>
