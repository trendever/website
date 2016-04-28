<style src="./header.pcss"></style>
<template lang="jade">
.section.header.u-fixed(v-show="is_visible")
  .section__content.header__content
    .header__arrow(@click="leftBtnAction" v-if="leftBtnShow")
      i.header__arrow__ic.ic-arrow-left(
        :class="{'_up': is_action_up}")

    .header__notify-count(v-if="notifyCount")
      span {{ notifyCount }}

    .header__center
      .header__text {{{ title }}}
      slot(name="content")

    //- .header__menu
      .header__menu-icon
      .header__menu-links
        a.header__menu-link(href="#") Настройки
        a.header__menu-link(href="#") Выйти
</template>

<script type="text/babel">
import listen from 'event-listener';

export default {
  data: () => ({
    is_visible: false,
    is_action_up: false,
    scrollEvent: null,
    showOnEl: null,
  }),
  props: {
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

    // if exists, scroll to position Y this id element
    scrollToElement: {
      type: String,
      default: null
    },

    // If exist, then LeftArrowBtn will redirect to backLink
    // receive reverse url name. Example: home
    backLink: {
      default: false
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
    }
  },
  beforeDestroy() {
    this.scrollEvent.remove();
  },
  ready() {
    if (this.show_on_elem) {
      this.showOnEl = document.getElementById(this.show_on_elem);
    }

    // Run, function for stopped scroll.
    // Because function work only in motion.
    this.toggleHeaderOnScroll();

    this.scrollEvent = listen(window, 'scroll', this.toggleHeaderOnScroll.bind(this))
  },
  methods: {
    leftBtnAction() {
      if (this.show_on_elem) {
        let scrollY = window.pageYOffset || document.documentElement.scrollTop;
        let elemY = this.showOnEl.offsetTop;
        if (scrollY - elemY >= 0) {

          if (this.scrollToElement) {
            window.body.scrollTop = document.getElementById(this.scrollToElement).offsetTop;
          } else {
            window.body.scrollTop = 0;
          }
          return;
        }
      }

      var backLink = this.$get('backLink');
      var path = this.$router._currentTransition.from.path;

      if (backLink) {
        this.$router.go(backLink);
      } else if (path && path == '/') { // ToDo not optimal. Have bugs
        this.$router.go(window.history.back());
      } else {
        this.$router.go({ name: 'home' });
      }
    },
    toggleHeaderOnScroll() {
      if (this.show_on_elem) {
        // If show_on_elem not exists, then wait when render it.
        // Be careful, it's may cycling as
        // infinity recursion if element not exists.
        if (!this.showOnEl) {
          setTimeout(this.toggleHeaderOnScroll.bind(this), 50);
          return;
        }

        // Show header, if show_on_elem scrollY is 0 or smaller
        let scrollY = window.pageYOffset || document.documentElement.scrollTop;
        let elemY = this.showOnEl.offsetTop;

        if (scrollY - elemY >= 0) {
          this.$set('is_visible', true);

          // Left btn now work as ScrollToTop
          this.$set('is_action_up', true);
          return;
        }
      }

      // Left btn now work as Go to Prev Page
      this.$set('is_action_up', false);

      // if header as secondary header
      if (this.$get('is_secondary')) {
        this.$set('is_visible', false);
        return;
      }
      this.$set('is_visible', true);
    },
  },
}

</script>