<style src='./navbar.pcss'></style>
<template lang="jade">
-
  feed = '/static/img/rss.svg'
  feed_active = '/static/img/rss_active.svg'
  chat = '/static/img/chats_inactive.svg'
  chat_active = '/static/img/chats_active.svg'
  profile = '/static/img/user_inactive.svg'
  profile_active = '/static/img/user_active.svg'

.navbar-cnt(v-if='isAuth && isMobile && !fakeuser')
  .navbar.section__content
    .navbar_i(:class='{"__active": current=="feed"}', v-link='{name: "home"}', @click="scrollTop")
      .navbar_i_wrap
        i.ic-gallery_menu_active.navbar_i_wrap_ic(v-if="current ==='feed'")
        i.ic-gallery_menu_inactive.navbar_i_wrap_ic(v-if="current !=='feed'")
        .navbar_i_wrap_t Лента

    .navbar_i(:class='{"__active": current=="chat"}', v-link='{name: "chat_list"}', @click="scrollTop")
      .navbar_i_wrap
        i.ic-cloud.navbar_i_wrap_ic.__chat_ic
        .navbar_i_wrap_t Чаты
        .navbar_i_wrap_notify(v-show='getGlobalNotifyCount')
          span {{ getGlobalNotifyCount }}

    .navbar_i(:class='{"__active": current=="profile"}', v-link='{name: "profile"}', @click="scrollTop")
      .navbar_i_wrap
        i.ic-profile.navbar_i_wrap_ic
        .navbar_i_wrap_t Профиль

</template>

<script>
  import { isAuth,isFake } from 'vuex/getters/user.js';
  import { getGlobalNotifyCount } from 'vuex/getters/lead.js';

  export default{
    data() {
      return {
        fakeuser: this.isFake
      };
    },
    props: {
      current: {
        type: String,
        default: null,
      },
    },
    vuex: {
      getters: {
        isAuth,
        isFake,
        getGlobalNotifyCount,
      },
    },
    computed:{
      isMobile(){
        return window.browser.mobile;
      }
    },
    methods:{

      scrollTop(){
        document.querySelector('.scroll-cnt').scrollTop = 0;
      }
    }
  };
</script>
