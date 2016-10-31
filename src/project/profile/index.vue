<style src='./style.pcss'></style>
<template lang="jade">
scroll-component(v-if="isDone", class="profile-cnt")

  header-component(:title='getUserName', :left-btn-show='leftArrowShow')
    div.profile-right-menu(slot="content", v-if="isMobile && $route.name === 'profile'")
      i.ic-options_menu(@click.stop="showMenu = true")

  header-menu(:show="showMenu")

    .menu-items(slot="items")

      .menu_i(v-on:click="showMenu = false")
        .menu_i_t.__txt-green Отмена
      .menu_i(v-on:click="buyTg")
        .menu_i_t Настройки профиля
      a.menu_i(v-link='{name: "info-instructions-1"}')
        .menu_i_t Как начать продавать?
      .menu_i(v-if="shopId !== 1", v-on:click="buyTg")
        .menu_i_t Подключить продажников
      a.menu_i(v-link='{name: "info-mission"}')
        .menu_i_t Наша миссия
      a.menu_i(v-link='{name: "info-agreement"}')
        .menu_i_t Условия
      a.menu_i(v-link='{name: "info-newshop"}')
        .menu_i_t Помощь магазинам
      a.menu_i(href="https://trendever.payture.com/", target="_blank")
        .menu_i_t Денежный перевод
      .menu_i(v-on:click="logout")
        .menu_i_t.__txt-red Выйти

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
          .profile_desc_t(v-if="getSlogan") {{getSlogan}}
          .profile_desc_caption(v-if="getUserCaption") {{{getUserCaption | captionSpaces}}}

        .profile_insta-link(v-if="$route.name === 'profile'")
          .insta-link-text ссылка на эту витрину
          .insta-link(v-el:insta-link) {{ getUserName }}.tndvr.com

        .profile_filter(v-if="isSelfPage && !noLikes && !noProducts")
          span(v-bind:class="{'seleted': photoType === 'product'}")
            input(type="radio" value="product" v-model="photoType" id="filter-products")
            label(for="filter-products") Мои Товары
          span(v-bind:class="{'seleted': photoType === 'like'}")
            input(type="radio" value="like" v-model="photoType" id="filter-likes")
            label(for="filter-likes") Мои Тренды
       template(v-if="loaded")
        .profile_no-goods(v-if="noLikes && noProducts && $route.name === 'profile'")
         span.empty Нет шопинг-желаний,
         span #[br]... потому что ты пока ничего #[br] не сохранил
        .profile_no-goods-guest(v-if="noLikes && noProducts && $route.name === 'user'") Пока здесь пусто ;( #[br] Пользователь еще не добавил #[br] тренды в свою ленту
        .profile_no-goods-banner(v-if="noLikes && noProducts && isSelfPage") Нажми Сохранить&nbsp
         span под товаром #[br.break_1] или&nbsp
         | напиши&nbsp
         span.save @savetrend&nbsp #[br(v-if="!isMobile")]
         span под постом в #[br.break_2] Instagram, #[br(v-if="!isMobile")] чтобы добавить тренд сюда в ленту

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
  native-popup(:show-popup="showPopup")
    .main-text
      {{message}}
    .button-text(v-on:click="showPopup = false")
      | OK

  .find-bloger-btn(v-if='isSelfPage && isMobile && showBloger', @click="buyServiceProduct") Найти блогера
  .how-to-sell-btn( v-link="{name: 'info-instructions-1'}", v-if="isMobile && noLikes && noProducts") Как начать продавать?
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
  import clipboard from 'clipboard';
  import * as productsService from 'services/products';
  import { urlThumbnail } from 'utils';
  import { createLead } from 'vuex/actions/lead';
  import config from '../../../config';

  import store from 'vuex/store'
  import { openProfile, closeProfile, setMyCurrentList, setTooltip, logOut } from 'vuex/actions/user.js';
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

  import { setCallbackOnSuccessAuth } from 'vuex/actions';

  import HeaderMenu from 'base/menu/header-menu';
  import RightNavComponent from 'base/right-nav/index';
  import ScrollComponent from 'base/scroll/scroll.vue'
  import HeaderComponent from 'base/header/header.vue'
  import PhotosComponent from 'base/photos/photos.vue'
  import NavbarComponent from 'base/navbar/navbar.vue'
  import NativePopup from 'base/popup/native';

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
        isSupplier: false,
        leftArrowShow: true,
        showPopup: false,
        message: '',
        showMenu: false
      }
    },
    route: {
      canReuse: false,
      data( { to: { params: { id } }, from } ) {

        if(!from.name) {
          this.leftArrowShow = false;
        }

        return this.openProfile( id )
        .then(()=>{
          if (!this.$store.invShown){
            if (browser.mobile && !browser.standalone){
              document.location = 'tndvr://shop/'+id;
            }
          }
          this._setTab();
        })
        .catch( () => {
          let try_ = id.replace(new RegExp("-", 'g'),"_");

          return this.openProfile( try_ )
          .then(()=>{
            if (!this.$store.invShown){
              if (browser.mobile && !browser.standalone){
                document.location = 'tndvr://shop/'+try_;
              }
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
      this.$store.state.products.listId = '';

    },
    ready(){
      let id = this.$route.params.id;
      if ( !this.isAuth && !browser.mobile) {
        this.setCallbackOnSuccessAuth(()=>{

          this.$router.go({name: 'user', params: { id }})
        })
        this.$router.replace( { name: 'signup' } );
      }




      if(this.$route.name === 'profile') {

        let self = this;

        self.copy =  new clipboard('.profile_insta-link',{
            text(trigger){
              return self.$els.instaLink.textContent;
            }
          })
        self.copy.on('success',()=>{
          self.message = `Ссылка ${self.getUserName}.tndvr.com скопирована.`;
          self.showPopup = true;

        })

        self.copy.on('error', () =>{
          self.message = 'К сожалению скопировать ссылку не удалось.<br><br> Сделайте это вручную'
          self.showPopup = true;
          self.copy.destroy();
          self.copy = false;
        });

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
      if (this.copy) this.copy.destroy();
      this.$store.invShown = true;
      if ( this.isAuth ) {
        this.closeProfile();
      }
    },
    methods:{
      logout(){

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
        setCallbackOnSuccessAuth,
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
      HeaderMenu,
      NativePopup,
      RightNavComponent,
      ScrollComponent,
      HeaderComponent,
      PhotosComponent,
      NavbarComponent,
    }
  }
</script>
