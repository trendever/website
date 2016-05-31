<style src='./navbar.pcss'></style>
<template lang="jade">
-
  feed = '/static/img/feed.png'
  feed_active = '/static/img/feed-active.png'
  chat = '/static/img/chat.png'
  chat_active = '/static/img/chat-active.png'
  profile = '/static/img/profile.png'
  profile_active = '/static/img/profile-active.png'

.navbar-cnt(v-if='isAuth')
  .navbar.section__content
    .navbar_i(:class='{"__active": current=="feed"}', v-link='{name: "home"}')
      .navbar_i_wrap
        i.ic-feed.navbar_i_wrap_ic
        .navbar_i_wrap_t Лента

    .navbar_i(:class='{"__active": current=="chat"}', v-link='{name: "chat_list"}')
      .navbar_i_wrap
        i.ic-cloud.navbar_i_wrap_ic.__chat_ic
        .navbar_i_wrap_t Шопинг-чаты
        .navbar_i_wrap_notify(v-show='getGlobalNotifyCount')
          span {{ getGlobalNotifyCount }}

    .navbar_i(:class='{"__active": current=="profile"}', v-link='{name: "profile"}')
      .navbar_i_wrap
        i.ic-profile.navbar_i_wrap_ic
        .navbar_i_wrap_t Профиль

</template>

<script>
  import { isAuth } from 'vuex/getters';
  import { getGlobalNotifyCount } from 'vuex/getters/lead.js';

  export default{
    data() {
      return {};
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
        getGlobalNotifyCount,
      },
    },
  };
</script>
