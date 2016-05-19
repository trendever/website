<style src="./navbar.pcss"></style>
<template lang="jade">
-
  feed = '/static/img/feed.png'
  feed_active = '/static/img/feed-active.png'
  chat = '/static/img/chat.png'
  chat_active = '/static/img/chat-active.png'
  profile = '/static/img/profile.png'
  profile_active = '/static/img/profile-active.png'

.navbar-cnt(v-if="isAuth")
  .navbar.section__content
    .navbar_i(:class="{'__active': current=='feed'}", v-link="{name: 'home'}")
      .navbar_i_wrap
        img.navbar_i_wrap_ic(src=feed, v-show="current!='feed'")
        img.navbar_i_wrap_ic(src=feed_active, v-show="current=='feed'")

        .navbar_i_wrap_t Лента

    .navbar_i(:class="{'__active': current=='chat'}", v-link="{name: 'chat_list'}")
      .navbar_i_wrap
        img.navbar_i_wrap_ic(src=chat, v-show="current!='chat'")
        img.navbar_i_wrap_ic(src=chat_active, v-show="current=='chat'")
        .navbar_i_wrap_t Шопинг-чаты
        .navbar_i_wrap_notify(v-show="getGlobalNotifyCount")
          span {{ getGlobalNotifyCount }}

    .navbar_i(v-if="false", :class="{'__active': current=='profile'}")
      .navbar_i_wrap
        img.navbar_i_wrap_ic(src=profile, v-show="current!='profile'")
        img.navbar_i_wrap_ic(src=profile_active, v-show="current=='profile'")
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