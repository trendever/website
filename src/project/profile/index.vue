<style src='./style.pcss'></style>
<template lang="jade">
div.scroll-cnt
  .profile-cnt
    header-component(title='happierall', :left-btn-show='false')

    .section.top.bottom
      .section__content
        .profile
          .profile_info
            //- .profile_info_count
            //-   | 1258
            //-   .profile_info_count_t
            //-     | Подписчики

            .profile_info_img
              img(:src="photo")

            //- .profile_info_count
            //-   | 53
            //-   .profile_info_count_t
            //-     | Подписки

          .profile_desc(v-if="openedUser.instagram_caption")
            .profile_desc_t Слоган профиля
            {{ openedUser.instagram_caption }}

        photos-component
    navbar-component(current='profile')
</template>

<script type='text/babel'>
  import { urlThumbnail } from 'utils'

  import { openUser, closeUser } from 'vuex/actions'
  import { openedUser } from 'vuex/getters'

  import HeaderComponent from 'base/header/header.vue'
  import PhotosComponent from 'base/photos/photos.vue'
  import NavbarComponent from 'base/navbar/navbar.vue'

  export default {
    data(){return {}},
    route: {
      activate({to: {params: { username }}}) {
        var requestData = !username ? {} : { instagram_name: username }
        return this.openUser(requestData).catch( error => {
            console.error( new Error( 'User doesn`t exists or error' ), {
            extra: {errorData: error, username: username}
          });
          this.$router.go({name: '404'});
        })
      },
    },
    vuex: {
      getters: {
        openedUser
      },
      actions: {
        openUser,
        closeUser
      }
    },

    // beforeDestroy(){
    //   this.closeUser()
    // },

    computed: {
      photo() {
        return this.openedUser.instagram_avatar_url;
      },
    },

    components: {
      HeaderComponent,
      PhotosComponent,
      NavbarComponent,
    }
  }
</script>
