<style src='./style.pcss'></style>
<template lang="jade">
div.scroll-cnt(v-if="isDone")
  .profile-cnt
    header-component(:title='getUserName', :left-btn-show='false')

    .section.top.bottom
      .section__content
        .profile
          .profile_info

            //- .profile_info_count 1258
            //-   .profile_info_count_t Подписчики

            .profile_info_img
              img(:src="getUserPhoto")

            //- .profile_info_count 53
            //-   .profile_info_count_t Подписки

          .profile_desc
            .profile_desc_t {{getSlogan}}
            span(v-if="getUserCaption") {{ getUserCaption }}

        photos-component( :filter-by-user-id.sync="user_id", :filter-by-user-name.sync="userName", :list-id.sync="listId" )
    navbar-component(:current='listId')
</template>
<script type='text/babel'>
  import { urlThumbnail } from 'utils';

  import store from 'vuex/store'
  import { openProfile, closeProfile } from 'vuex/actions/user.js';
  import {
    getUserName,
    getUserPhoto,
    getUserCaption,
    getSlogan,
    isDone,
    getPhotoConfig,
    isAuth
  } from 'vuex/getters/user.js';

  import HeaderComponent from 'base/header/header.vue'
  import PhotosComponent from 'base/photos/photos.vue'
  import NavbarComponent from 'base/navbar/navbar.vue'

  export default {
    route: {
      data( { to: { params: { id } } } ) {
        if ( this.isAuth ) {
          return this.openProfile( id ).catch( () => {
            this.$router.go( { name: '404' } );
          } );
        } else {
          return Promise.resolve();
        }
      }
    },
    ready(){
      if ( !this.isAuth ) {
        this.$router.go( { name: 'signup' } );
      }
    },
    beforeDestroy(){
      if ( this.isAuth ) {
        this.closeProfile();
      }
    },
    vuex: {
      actions: {
        openProfile,
        closeProfile
      },
      getters: {
        isAuth,
        getUserName,
        getUserPhoto,
        getUserCaption,
        getSlogan,
        isDone,
        getPhotoConfig
      }
    },
    computed: {
      user_id(){
        return this.getPhotoConfig.photoFilter.user_id;
      },
      listId(){
        console.log(this.getPhotoConfig.listId);
        return this.getPhotoConfig.listId;
      },
      userName(){
        return this.getPhotoConfig.photoFilter.instagram_name;
      }
    },
    components: {
      HeaderComponent,
      PhotosComponent,
      NavbarComponent,
    }
  }
</script>
