<style src='./style.pcss'></style>
<template lang="jade">
scroll-component(v-if="isDone", class="profile-cnt")
  header-component(:title='getUserName', :left-btn-show='true')
    div.profile-right-menu(slot="content", v-if="isMobile && $route.name === 'profile'")
      i.ic-options_menu(@click="buyTg")
  right-nav-component(current="profile")

  .section.top.bottom
    .section__content(v-cloak)
      .profile
        .profile_info

          //.profile_info_count 01
          // .profile_info_count_t Подписчики

          .profile_info_img()
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
       template(v-if="loaded")
        .profile_no-goods(v-if="noLikes && noProducts && $route.name === 'profile'")
         span.empty Здесь пусто,
         span #[br]... потому что ты пока ничего не сохранил.
        .profile_no-goods-guest(v-if="noLikes && noProducts && $route.name === 'user'") Пока здесь пусто ;( #[br] Пользователь еще не добавил #[br] тренды в свою ленту
        .profile_no-goods-banner(v-if="noLikes && noProducts && isSelfPage") Нажми Сохранить&nbsp
         span под товаром #[br.break_1] или&nbsp
         | напиши&nbsp
         span.save @savetrend&nbsp
         span под постом в #[br.break_2] Instagram, #[br.break_3] чтобы добавить тренд сюда в ленту.

        button.btn.btn_primary.__orange.__xl.fast__big__btn.btn_fixed-bottom.profile-btn(@click="subscrib//e") ПОДПИСАТЬСЯ

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

  .find-bloger-btn(v-if='isSelfPage && shopId !== 1 && isMobile && showBloger', @click="buyServiceProduct") Найти блогера

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
  import RightNavComponent from 'base/right-nav/index';
  import * as productsService from 'services/products';
  import { urlThumbnail } from 'utils';
  import { createLead } from 'vuex/actions/lead';
  import config from '../../../config';

  import store from 'vuex/store'
  import { openProfile, closeProfile, setMyCurrentList, setTooltip } from 'vuex/actions/user.js';
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
    getMyCurrentList,
    getTooltips
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
        noLikes: true,
        noProducts: true,
        loaded: false,
        isMobile: window.browser.mobile,
        showBloger: true
      }
    },
    route: {
      canReuse: false,
      data( { to: { params: { id } } } ) {
        if (browser.mobile && !browser.standalone){
          document.location = 'tndvr://shop/' + this.getUserName;
        }

        return this.openProfile( id )
        .then(()=>{
          this._setTab();
        })
        .catch( () => {
          this.$router.go( { name: '404' } );
        } );        
      }
    },
    created(){
      //Баг подвисания ещё
      this.$store.state.products.listId = '';

    },
    ready(){

      if ( !this.isAuth && !browser.mobile) {
        this.$router.replace( { name: 'signup' } );
      }

    },
    events:{
      'show-bloger-btn'(){
        this.$set('showBloger', true);
      },
      'hide-bloger-btn'(){
        this.$set('showBloger', false);
      }
    },
    beforeDestroy(){
      if ( this.isAuth ) {
        this.closeProfile();
      }
    },
    methods:{
      buyTg(){
        this
          .createLead( 21499 )
          .then(
            ( lead ) => {
              if ( lead !== undefined && lead !== null ) {
                this.$router.go( { name: 'chat', params: { id: lead.id } } )
              }
            }
          )
          .catch(
            ( error ) => {
              if ( error === leads.ERROR_CODES.UNATHORIZED ) {
                this.$router.go( { name: 'signup' } )
              }
            }
          )

      },

      buyServiceProduct(){

        let productId = config.service_product_id === null ? 7833 : config.service_product_id;

        this
          .createLead( productId )
          .then(
            ( lead ) => {
              if ( lead !== undefined && lead !== null ) {
                this.$router.go( { name: 'chat', params: { id: lead.id } } )
              }
            }
          )
          .catch(
            ( error ) => {
              if ( error === leads.ERROR_CODES.UNATHORIZED ) {
                this.$router.go( { name: 'signup' } )
              }
            }
          )
      },
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

            if(this.$route.name === 'profile' && this.isSelfPage) {

              if(this.getMyCurrentList){

                this.$set('photoType',this.getMyCurrentList);

              }

            } else {

              this.$set('photoType','product');

            }
          }
          this.$set('loaded',true);

        },err=>{

          alert('Server error');

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
        createLead,
        setTooltip,
        setMyCurrentList,
        openProfile,
        closeProfile
      },
      getters: {
        getTooltips,
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
      showTooltip(){
        if(this.noProducts && this.noLikes){
          if(this.getTooltips.profile){
            return true;
          }
          return false;
        }
        return false;
      },
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
        if (this.$store){
          return this.$store.state.user.id === this.$store.state.user.myId;
        }else{
          return false;
        }
      },
      listId(){
        return this.getPhotoConfig.listId;
      },
      trendsListId(){
        return this.listId + '_trends';
      }
    },
    components: {
      RightNavComponent,
      ScrollComponent,
      HeaderComponent,
      PhotosComponent,
      NavbarComponent,
    }
  }
</script>
