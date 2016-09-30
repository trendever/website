<style src='./header.pcss'></style>
<template lang="jade">
.section.header.section__content
    .header__content.u-fixed(v-show='is_visible')
      .wrapper
        .header__arrow(
          @click='leftBtnAction',
          v-if='leftBtnShow',
          :class="{'show-desktop-arrow': showDesktopArrow}")

          i.header__arrow__ic.ic-arrow-left(
          :class='{"_up": is_action_up}')

        .header__notify-count(v-if='notifyCount')
          span {{ notifyCount }}

        .header__center
          .header__left-logo
           a(v-link="{name: 'home'}")
            img(src="../img/logo-main.svg")
          .header__text(v-if="centerTextLink === null") {{ title }}
          .header__text.active(v-if="centerTextLink !== null", v-link="centerTextLink") {{ title }}
            img.center-avatar(:src="avatarUrl", v-if="page == 'product' && !isMobile")
          slot(name='content')

        .header-right(v-if="avatarUrl !== null && centerTextLink !== null && isMobile", v-link="centerTextLink")
          img(:src="avatarUrl")

      productmenu-component(v-if="page == 'product'")
</template>

<script type='text/babel'>
  import listen from 'event-listener';
  import ProductmenuComponent from '../productmenu/index.vue'

  export default {
    components: {
      ProductmenuComponent
    },
    data(){
      return {
        is_visible: false,
        is_action_up: false,
        scrollEvent: null,
        showOnEl: null,
        isMobile: window.browser.mobile
      }
    },
    props: {
      showDesktopArrow:{
        type: Boolean,
        default: false
      },
      // Title of header
      title: {
        type: String
      },

      // if exists, then btn will work in two mode:
      // 1. Go to prev page
      // 2. Scroll to top (if show_on_elem scrollY is 0 or smaller)
      // Elem Y position must be not ~0px.
      show_on_elem: {
        type: String,
        default: null
      },

      // if header is not main. For example the home page.
      // Header will show if show_on_elem scrollY is 0 or smaller
      is_secondary: {
        type: Boolean,
        default: false
      },

      // If exist, then LeftArrowBtn will redirect to backLink
      // receive reverse url name. Example: home
      backLink: {
        default: false
      },

      forceBackLink: {
        default: false
      },

      // if exists, scroll to position Y this id element
      scrollToElement: {
        type: String,
        default: null
      },

      // Show or Hide back arrow
      leftBtnShow: {
        type: Boolean,
        default: true
      },

      // Show notify badge if exist
      notifyCount: {
        type: Number,
        default: 0
      },
      centerTextLink:{
        type: Object,
        default : null
      },
      avatarUrl:{
        type: String,
        default : null
      },
      page:{
        type: String,
        default : 'home'
      }
    },
    beforeDestroy() {
      if ( this.scrollEvent ) {
        this.scrollEvent.remove();
      }
    },
    ready() {
      this.scrollCnt = document.querySelector( '.scroll-cnt' );

      if ( this.show_on_elem ) {
        this.showOnEl = document.getElementById( this.show_on_elem );
      }

      // Run, function for stopped scroll.
      // Because function work only in motion.
      this.toggleHeaderOnScroll();

      this.scrollEvent = listen( this.scrollCnt, 'scroll', this.toggleHeaderOnScroll.bind( this ) )
    },
    methods: {
      leftBtnAction() {
        if ( this.show_on_elem ) {
          if ( this.scrollCnt.scrollTop - this.showOnEl.offsetTop >= 0 ) {

            if ( this.scrollToElement ) {
              this.scrollCnt.scrollTop = document.getElementById( this.scrollToElement ).offsetTop;
            } else {
              this.scrollCnt.scrollTop = 0;
            }
            return;
          }
        }

        if ( window.history.length > 2 && !this.forceBackLink) {

          window.history.back();

        } else {

          this.$router.go( this.backLink );

        }

      },
      toggleHeaderOnScroll() {

        if ( this.show_on_elem ) {
          // If show_on_elem not exists, then wait when render it.
          // Be careful, it's may cycling as
          // infinity recursion if element not exists.
          if ( !this.showOnEl ) {
            setTimeout( this.toggleHeaderOnScroll.bind( this ), 50 );
            return;
          }

          // Show header, if show_on_elem scrollY is 0 or smaller
          if ( this.scrollCnt.scrollTop - this.showOnEl.offsetTop >= 0 ) {
            this.$set( 'is_visible', true );

            // Left btn now work as ScrollToTop
            this.$set( 'is_action_up', true );
            return;
          }
        }

        // Left btn now work as Go to Prev Page
        this.$set( 'is_action_up', false );

        // if header as secondary header
        if ( this.$get( 'is_secondary' ) ) {
          this.$set( 'is_visible', false );
          return;
        }
        this.$set( 'is_visible', true );
      },
    },
  }

</script>
