<style src='./style.pcss'></style>
<template lang="jade">
scroll-component(v-if="isDone", class="profile-cnt")
  header-component(:title='getUserName', :left-btn-show='true')

  .section.top.bottom
    .section__content(v-cloak)
      .profile
        .profile_info

          //.profile_info_count 1258
           //.profile_info_count_t Подписчики

          .profile_info_img
            img(:src="getUserPhoto")

          //.profile_info_count 53
           //.profile_info_count_t Подписки

        .profile_desc
          //.profile_desc_t {{getSlogan}} Слоган Профиля
          .profile_desc_caption(v-if="getUserCaption")
          | {{ getUserCaption }}

        .profile_filter(v-if="isSelfPage && !noLikes && !noProducts")
          span(v-bind:class="{'seleted': photoType === 'product'}")
            input(type="radio" value="product" v-model="photoType" id="filter-products")
            label(for="filter-products") Мои Товары
          span(v-bind:class="{'seleted': photoType === 'like'}")
            input(type="radio" value="like" v-model="photoType" id="filter-likes")
            label(for="filter-likes") Мои Тренды

        button.btn.btn_primary.__orange.__xl.fast__big__btn.btn_fixed-bottom.profile-btn(@click="subscrib//e") ПОДПИСАТЬСЯ

        //.profile_settings_btn
        //a(href="#")
        //img(src="icons/cogwheel.png")



      //- лайки
      photos-component(
        v-if="photoType === 'like'",
        :filter-by-mentioner-id="userID",
        :list-id.sync="trendsListId")

      //- товары
      photos-component(
        v-if="photoType === 'product'",
        :filter-by-shop-id="shopId",
        :list-id.sync="listId")

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
  import * as productsService from 'services/products';
  import { urlThumbnail } from 'utils';

  import store from 'vuex/store'
  import { openProfile, closeProfile, setMyCurrentList } from 'vuex/actions/user.js';
  import {
    userID,
    user,
    getUserName,
    getUserPhoto,
    getUserCaption,
    getSlogan,
    isDone,
    getPhotoConfig,
    isAuth,
    getMyCurrentList
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
          return this.openProfile( id )
          .then(()=>{
            productsService
            .find({ mentioner_id: this.userID })
            .then((data)=>{
              if(!data.length){
                 this.$set('noLikes',true);
                 //console.log('нету лайков')
                  //hack так как при преходе с дргого юзера
                  //пропы остаются теми же, не совсем корректно работает Vue
              }
            });
          })
          .catch( () => {
            this.$router.go( { name: '404' } );
          } );
        } else {
          return Promise.resolve();
        }
      }
    },
    created(){
      //Баг подвисания ещё
      this.$store.state.products.listId = '';
    },
    ready(){
      //check auth
      if(this.getMyCurrentList){
        this.$set('photoType',this.getMyCurrentList);
      }
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
        setMyCurrentList,
        openProfile,
        closeProfile
      },
      getters: {
        getMyCurrentList,
        userID,
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
    watch:{
      photoType(val){
        if(this.isSelfPage){
          if(val === 'like'){
            this.setMyCurrentList('like');
          }

          if(val === 'product'){
            this.setMyCurrentList('product');
          }
        }
      }
    },
    computed: {
      shopId(){
        if(this.user.supplier_of !== null){
          console.log(this.user);
          this.$set('photoType','product');
          return this.user.supplier_of[0];
        }

        if(this.user.seller_of !== null){
          this.$set('photoType','product');
          return this.user.seller_of[0];
        }

        this.$set('photoType','like');
        this.$set('noProducts', true);

        //даем серверу несуществующий айди,
        //так как надо чтобы сервер ничего не прислал
        return 1;

      },
      isSelfPage(){
        return this.$store.state.user.id === this.$store.state.user.myId;
      },
      listId(){
        return this.getPhotoConfig.listId;
      },
      trendsListId(){
        return this.listId + '_trends';
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
