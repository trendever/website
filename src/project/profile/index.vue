<style src='./style.pcss'></style>
<template lang="jade">
scroll-component(v-if="isDone", class="profile-cnt")
  header-component(:title='getUserName', :left-btn-show='true')

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

        .profile_filter(v-if="isSelfPage")
          span(v-bind:class="{'seleted': photoType === 'product'}") 
            input(type="radio" value="product" v-model="photoType" id="filter-products")
            label(for="filter-products") Товары 
          span(v-bind:class="{'seleted': photoType === 'like'}")  
            input(type="radio" value="like" v-model="photoType" id="filter-likes") 
            label(for="filter-likes") Тренды

        .profile_desc
          .profile_desc_t {{getSlogan}}
          span(v-if="getUserCaption") {{ getUserCaption }}

      photos-component( :filter-by-user-id.sync="user_id", :filter-by-user-name.sync="userName", :list-id.sync="listId", :filter-by-photo-type.sync="photoType")
  navbar-component(:current='listId')

.help-wrapper(v-if='isFirst')
  .attention(v-if='isFirst')
    p Для корректного отображения подсказок переверните устройство в портретную ориентацию
  .help(@click='isFirst=false')
    .help__profile
      .help-conteiner
        .help-text Это лента ваших трендов.#[br]  Сюда сохраняются все товары, которые вы:
          ul
            li 1. Лайкнули на Trendever
            li 2. Отметили под постом в инсте
        .help__profile-round
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

  import ScrollComponent from 'base/scroll/scroll.vue'
  import HeaderComponent from 'base/header/header.vue'
  import PhotosComponent from 'base/photos/photos.vue'
  import NavbarComponent from 'base/navbar/navbar.vue'

  export default {
    data(){
      return {
        isFirst: false,
        photoType: 'product'
      }
    },
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
        this.$router.replace( { name: 'signup' } );
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
      isSelfPage(){
        return this.$store.state.user.id === this.$store.state.user.myId;
      },
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
      ScrollComponent,
      HeaderComponent,
      PhotosComponent,
      NavbarComponent,
    }
  }
</script>
