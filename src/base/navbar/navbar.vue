<style src="./navbar.pcss"></style>
<template lang="jade">
-
  feed = '/static/img/feed.png'
  feed_active = '/static/img/feed-active.png'
  chat = '/static/img/chat.png'
  chat_active = '/static/img/chat-active.png'
  profile = '/static/img/profile.png'
  profile_active = '/static/img/profile-active.png'

div
  .navbar-cnt
    .navbar.section__content
      .navbar_i(:class="{'__active': current=='feed'}",
      @click="current='feed'",
      v-link="{name: 'home'}")
        .navbar_i_wrap
          img.navbar_i_wrap_ic(src=feed, v-show="current!='feed'")
          img.navbar_i_wrap_ic(src=feed_active, v-show="current=='feed'")

          .navbar_i_wrap_t Лента

      .navbar_i(:class="{'__active': current=='chat'}",
      @click="current='chat'",
      v-link="{name: 'chat_list'}")
        .navbar_i_wrap
          img.navbar_i_wrap_ic(src=chat, v-show="current!='chat'")
          img.navbar_i_wrap_ic(src=chat_active, v-show="current=='chat'")
          .navbar_i_wrap_t Шопинг-чаты
          .navbar_i_wrap_notify(v-show="chatNotifyCount")
            span {{ chatNotifyCount }}

      .navbar_i(:class="{'__active': current=='profile'}",
      @click="current='profile'")
        .navbar_i_wrap
          img.navbar_i_wrap_ic(src=profile, v-show="current!='profile'")
          img.navbar_i_wrap_ic(src=profile_active, v-show="current=='profile'")
          .navbar_i_wrap_t Профиль

</template>

<script>
  import { chatNotifyCount } from 'vuex/getters'


  export default{
    data: () => ({
    }),
    props: {
      current: {
        type: String,
        default: null
      }
    },
    vuex: {
      getters: {
        chatNotifyCount
      }
    }
  }
</script>