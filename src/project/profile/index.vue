<style src='./style.pcss'></style>
<template lang="jade">
scroll-component(v-if="isDone", class="profile-cnt")
  header-component(:title='getUserName', :left-btn-show='true')

  .section.top.bottom
    .section__content
      .profile
        .profile_info

          //.profile_info_count 0
          // .profile_info_count_t Подписчики

          .profile_info_img
            img(:src="getUserPhoto")

          //.profile_info_count 0
          // .profile_info_count_t Подписки 

        .profile_desc
          //.profile_desc_t {{getSlogan}} Слоган Профиля
          .profile_desc_caption(v-if="getUserCaption")
          | {{ getUserCaption }}

        .profile_filter(v-if="isSelfPage && !nolikes && !noProducts")
          span(v-bind:class="{'seleted': photoType === 'product'}")
            input(type="radio" value="product" v-model="photoType" id="filter-products")
            label(for="filter-products") Мои Товары
          span(v-bind:class="{'seleted': photoType === 'like'}")
            input(type="radio" value="like" v-model="photoType" id="filter-likes")
            label(for="filter-likes") Мои Тренды

        .profile_no-goods(v-if="noLikes && noProducts") Здесь пусто, #[br]... потому что ты пока ничего не сохранил.
        

        .profile_no-goods-banner(v-if="noLikes && noProducts") Нажми Сохранить под товаром #[br] или напиши @savetrend под постом в #[br] Instagram, #[br] чтобы добавить тренд сюда в ленту.

        button.btn.btn_primary.__orange.__xl.fast__big__btn.btn_fixed-bottom.profile-btn(@click="subscrib//e") ПОДПИСАТЬСЯ

        //.profile_settings_btn
        //a(href="#")
        //img(src="icons/cogwheel.png")



      photos-component(
        :filter-by-shop-id="shopId",
        :list-id.sync="listId",
        :photo-type="photoType")

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
    user,
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
        photoType: 'product',
        noLikes: false,
        noProducts: false
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
      //check auth
      if ( !this.isAuth ) {
        this.$router.replace( { name: 'signup' } );
      }
    },
    beforeDestroy(){
      if ( this.isAuth ) {
        this.closeProfile();
      }
    },
    events:{
      //logic for show switch buttons
      'noLikes'(){
        this.noLikes = true;
      },
      'noProducts'(){
        this.noProducts = true;
        this.photoType = 'like';
      }
    },
    vuex: {
      actions: {
        openProfile,
        closeProfile
      },
      getters: {
        user,
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
      shopId(){
        if(this.user.supplier_of !== null){
          return this.user.supplier_of[0];
        }

        if(this.user.seller_of !== null){
          return this.user.seller_of[0];
        }

        return null;
      },
      isSelfPage(){
        return this.$store.state.user.id === this.$store.state.user.myId;
      },
      listId(){
        return this.getPhotoConfig.listId;
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
