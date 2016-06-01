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
              //- | 1258
              //- .profile_info_count_t
                //- | Подписчики

            .profile_info_img
              img(:src="photo")

            //- .profile_info_count
              //- | 53
              //- .profile_info_count_t
                //- | Подписки

          .profile_desc
            .profile_desc_t Слоган профиля
            span(v-if="caption") {{ caption }}

        photos-component(:filter-by="photosFilter", :list="list")
    navbar-component(current='profile')
</template>

<script type='text/babel'>
  import { urlThumbnail } from 'utils'

  import store from 'vuex/store'
  import { openProfile } from 'vuex/actions'

  import HeaderComponent from 'base/header/header.vue'
  import PhotosComponent from 'base/photos/photos.vue'
  import NavbarComponent from 'base/navbar/navbar.vue'

  export default {
    data(){return {
      obj: {},
    }},
    init() {
      let username = this.$route.params.username;
      this.requestData = {}
      this.photosFilter = {}
      this.list = null

      if (username) {
        let id = null
        let search_id = username.match(/id(\d+)/)
        if (search_id) {
          id = search_id[1]
        }

        if (id > 0) {
          // Try get user by id in url like /id1
          this.photosFilter.user_id = +id
          this.requestData = { user_id: +id }
          this.list = 'profile_id_' + id
        } else {
          // May be it's username?
          this.photosFilter.instagram_name = username
          this.requestData = { instagram_name: username }
          this.list = 'profile_' + username
        }

      } else {
        // if username and id not present,
        // then get from own profile, if is auth.
        // e.g. url: /profile
        if (!store.state.user.isAuth) {
          this.$router.go({name: 'signup'});
        }
        this.list = 'profile'
        this.photosFilter.instagram_name = store.state.user.instagram_username
      }
    },
    route: {
      data( {to: {params: { username }}} ) {
        return this
        .openProfile(this.requestData)
        .then( (obj) => ({ obj }) )
        .catch( error => {
            console.error( new Error( 'User doesn`t exists or opened incorect url' ), {
            extra: {errorData: error, username: username}
          });
          this.$router.go({name: '404'});
        })
      },
    },
    vuex: {
      actions: {
        openProfile
      }
    },

    computed: {
      isShop() {
        return !!this.obj.Shop
      },
      username(){
        if (this.isShop) {
          return this.obj.Shop.instagram_username;
        }
        return this.obj.User.instagram_username;
      },
      photo() {
        if (this.isShop) {
          return this.obj.Shop.instagram_avatar_url;
        }
        return this.obj.User.instagram_avatar_url;
      },
      caption() {
        if (this.isShop) {
          return this.obj.Shop.caption;
        }
        return this.obj.User.instagram_caption;
      },
    },

    components: {
      HeaderComponent,
      PhotosComponent,
      NavbarComponent,
    }
  }
</script>
