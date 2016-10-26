<style src='./styles/profile-directbot.pcss'></style>
<template lang="jade">
scroll-component(v-if="isDone", class="profile-cnt")
  header-component(:title='getUserName', :left-btn-show='true').directbot-header
      div.profile-right-menu(slot="content", v-if="isMobile && $route.name === 'profile'")
        i.ic-options_menu(@click="buyTg")
      div.profile-days(slot="content")
        span 3
        span.day д

  .section.top.bottom
    .section__content(v-cloak)
      .profile
        .profile_info

          .profile_info_img()
            img(:src="getUserPhoto")


       template(v-if="loaded")
        .profile_inactive
          img(src="./img/empty-directbot-profile.png")
          span.empty Деактивирован
          span #[br]мониторю 3 поста #[br] отправил 5 сообщений
        .profile_active(v-if="false")
          img(src="./img/active-directbot-profile.png")
          p.bold Активирован... #[br]
          p мониторю 3 поста #[br] отправил 5 сообщений
        .profile_no-goods-banner(v-if="noLikes && noProducts && isSelfPage")
          span Все готово для подключения #[br] Instagram профиля к #[br]
          span.save Directbot


        button.btn.btn_primary.__orange.__xl.fast__big__btn.btn_fixed-bottom.turn-on-bot-btn(v-link="{ name: 'turn-on-bot' }") ПОДКЛЮЧИТЬ БОТА
        button.bot-active-btn(v-if="false") БОТ АКТИВЕН
          i.ic-close

        a(class='profile-header__menu-link', @click="logout", v-if="isAuth") Выход
  navbar-component(:current='listId').directbot-navbar

</template>
<script type='text/babel'>
  import { logOut } from 'vuex/actions/user.js'
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
        showBloger: true,
        isSeller: false,
        isSupplier: false
      }
    },
    route: {
      canReuse: false,
      data( { to: { params: { id } } } ) {
        return this.openProfile( id )
        .then(()=>{
          if (browser.mobile && !browser.standalone){
            document.location = 'tndvr://shop/'+id;
          }
          this._setTab();
        })
        .catch( () => {
          let try_ = id.replace(new RegExp("-", 'g'),"_");

          return this.openProfile( try_ )
          .then(()=>{
            if (browser.mobile && !browser.standalone){
              document.location = 'tndvr://shop/'+try_;
            }
            this._setTab();
          })
          .catch( () => {
            this.$router.go( { name: '404' } );
          });
        });
      },
      canDeactivate({ to, next }){
        if( to.name === 'product_detail') {
          this.$store.state.user.showRootLoader = true;
          next();
        } else {
          next();
        }
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
    filters:{
      captionSpaces(val){
        return val.replace(/\r\n\r\n/g,"<br/><br/>");
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
      logout(){

        this.$set('menuOpened', false);
        this.logOut();
        window.location = '/';

      },
      buyTg(){
        this
          .createLead( 32158 )
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
              if(this.isSeller) {
                this.$set('photoType','like');
                return;
              }
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
        closeProfile,
        logOut,
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
          this.$set('isSupplier', true);
        }

        if(this.user.seller_of !== null){
          shopId = this.user.seller_of[0];
          this.$set('isSeller', true);
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
