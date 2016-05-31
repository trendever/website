<style src='./style.pcss'></style>
<template lang="jade">
div.scroll-cnt
  .profile-cnt
    header-component(:title='username', :left-btn-show='false')

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

          .profile_desc(v-if="caption")
            .profile_desc_t Слоган профиля
            {{ caption }}

        photos-component
    navbar-component(current='profile')
</template>

<script type='text/babel'>
  import { urlThumbnail } from 'utils'

  import { openProfile } from 'vuex/actions'
  import { openedProfile } from 'vuex/getters'

  import HeaderComponent from 'base/header/header.vue'
  import PhotosComponent from 'base/photos/photos.vue'
  import NavbarComponent from 'base/navbar/navbar.vue'

  export default {
    data(){return {}},
    route: {
      activate({to: {params: { username }}}) {
        var requestData = !username ? {} : { instagram_name: username }
        return this.openProfile(requestData)
        .then( profile => {
          console.log(profile);
        })
        .catch( error => {
            console.error( new Error( 'User doesn`t exists or opened incorecct url' ), {
            extra: {errorData: error, username: username}
          });
          this.$router.go({name: '404'});
        })
      },
    },
    vuex: {
      getters: {
        openedProfile
      },
      actions: {
        openProfile
      }
    },

    // beforeDestroy(){
    //   this.closeUser()
    // },

    computed: {
      isShop() {
        return !!this.openedProfile.Shop
      },
      username(){
        if (this.isShop) {
          return this.openedProfile.Shop.instagram_username;
        }
        return this.openedProfile.User.instagram_username;
      },
      photo() {
        if (this.isShop) {
          return this.openedProfile.Shop.instagram_avatar_url;
        }
        return this.openedProfile.User.instagram_avatar_url;
      },
      caption() {
        if (this.isShop) {
          return this.openedProfile.Shop.caption;
        }
        return this.openedProfile.User.instagram_caption;
      },
    },

    components: {
      HeaderComponent,
      PhotosComponent,
      NavbarComponent,
    }
  }
</script>
