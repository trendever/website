<style src='./style.pcss'></style>
<template lang="jade">
scroll-component(v-if="isDone", class="profile-cnt")
  header-component(:title='getUserName', :left-btn-show='true')

  .section.top.bottom
    .section__content(v-cloak)
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

        .profile_filter(v-if="isSelfPage && !noLikes && !noProducts")
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
        photoType: '',
        noLikes: false,
        noProducts: false
      }
    },
    route: {
      canReuse: false,
      data( { to: { params: { id } } } ) {
        if ( this.isAuth ) {
          return this.openProfile( id )
          .then(()=>{
            this._setTab();
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
      if ( !this.isAuth ) {
        this.$router.replace( { name: 'signup' } );
      }

      //this._setTab();

    },
    beforeDestroy(){
      if ( this.isAuth ) {
        this.closeProfile();
      }
    },
    methods:{
      _setTab(){
        this._checkStaff().then(staff=>{
          if(!staff.likes){
            this.$set('noLikes',true);
          } else {
            this.$set('noLikes',false);
          }

          if(!staff.products){
            this.$set('noProducts',true);
            this.$set('photoType','like');
          } else {
            this.$set('noProducts',false);
            this.$set('photoType','product');
          }

        },err=>{

          alert('Server error');

        }).then(()=>{
          if(this.$route.name === 'profile' && this.isSelfPage) {
            if(this.getMyCurrentList){
              this.$set('photoType',this.getMyCurrentList);
            }
          }
        })

      },
      _checkStaff(){
        return new Promise((resolve,reject) => {
          productsService
            .find({ mentioner_id: this.userID })
            .then((data)=>{
              let staff = {};
              if(!data.length){
                staff.likes = false;
              } else {
                staff.likes = true;
              }
              return staff;
            }).then(staff=>{
              productsService
                .find({ shop_id: this.shopId })
                .then((data)=>{
                  if(!data.length){
                    staff.products = false;
                  } else {
                    staff.products = true;
                  }
                  resolve(staff);
              });
            })
        })
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
        if(this.$route.name === 'profile' && this.isSelfPage){
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
        let shopId = '';

        if(this.user.supplier_of !== null){
          shopId = this.user.supplier_of[0];
        }

        if(this.user.seller_of !== null){
          shopId = this.user.seller_of[0];
        }

        if(shopId){
          return shopId;
        }

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
