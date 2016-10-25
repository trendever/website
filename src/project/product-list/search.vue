<style src='./styles/search.pcss'></style>
<template lang="jade">
.search-placeholder
  #search(:class="{'desktop-topspace': !isMobile && isAuth}")
    //-.search-stub(v-if='searchGlued')

    .search-input(v-if="isAuth && isMobile")
      .search-input__container(:class='{"__focused": inputFocused, "__active": searchValue.length || selectedCount > 0}')
        .search-input__search-btn(v-on:click='search()')
          i.ic-search.__mirror

        input.search-input__input(
          ref="input",
          v-on:keyup='search()',
          :value='searchValue',
          v-on:focus='onFocusInput',
          v-on:blur='onBlurInput',
          type='text',
          placeholder='Ищи текстом или жми теги...'
        )

        .search-input__clear-btn
          span.badge(v-if='selectedCount > 0') {{ selectedCount }}
          span.close(v-show='searchValue.length || selectedCount > 0', v-on:click='clear'): i.ic-close
          span.change-col
            span.change-col__two-col( :class='{"active": getColumnCount === 3}', v-on:click='setColumnNumber(2)')
              span.change-col__big
              span.change-col__big
              span.change-col__big
              span.change-col__big

            span.change-col__three-col( :class='{"active": getColumnCount === 2}', v-on:click='setColumnNumber(3)')
              span.change-col__sm
              span.change-col__sm
              span.change-col__sm
              span.change-col__sm
              span.change-col__sm
              span.change-col__sm
              span.change-col__sm
              span.change-col__sm
              span.change-col__sm

    .tags-wrapper( ref="tags" )
      tags-component(
        :tags="tags",
        :text-font-size="tagsFontSize",
        :text-line-height="tagsLineHeight",
        :search-string="searchValue",
        :del-tag="removeTag",
        :add-tag="selectTag",
        :is-open.sync="isOpenTags",
        :is-pending="getPendingStatus",
        :margin-bottom="marginBottom",
        :margin-right="marginRight",
        :base-height="baseHeight",
        :max-height="maxHeight"
      )
</template>

<script type='text/babel'>
  import Vue from 'vue';
  import listen from 'event-listener';
  import tagsComponent from 'base/tags/index.vue';

  import { searchValue, tags, selectedCount, getPendingStatus } from 'vuex/getters/search.js';
  import { loadTags, setSearchValue, selectTag, removeTag, clearSearch } from 'vuex/actions/search.js';

  import { isAuth } from 'vuex/getters/user.js';
  import { setColumnNumber } from 'vuex/actions/products';
  import { getColumnCount } from 'vuex/getters/products';


  export default {
    components: {
      tagsComponent
    },
    data(){
      return {
        searchGlued: false,
        inputFocused: false,
        isOpenTags: false,
        isMobile: window.browser.mobile
      }
    },
    ready(){

      if ( this.isAuth ) {

        this.scrollCnt = document.querySelector( '.scroll-cnt' );

        this.gluingSearch = listen( this.scrollCnt, 'scroll', () => {

          if ( this.isAuth ) {

            let searchHeight = 50;

            if ( window.matchMedia( '(max-width: 750px)' ).matches ) {

              searchHeight = 100;

            }

            if ( this.scrollCnt.scrollTop > searchHeight ) {

              Vue.set( 'searchGlued', true );

            } else {

              Vue.set( 'searchGlued', false );

            }

          }

        } );

      }

    },
    beforeDestroy(){

      if ( this.isAuth ) {

        if ( this.gluingSearch ) {

          this.gluingSearch.remove();

        }

      }

    },
    vuex: {
      getters: {
        searchValue,
        tags,
        selectedCount,
        getColumnCount,
        isAuth,
        getPendingStatus
      },
      actions: {
        loadTags,
        setSearchValue,
        setColumnNumber,
        selectTag,
        removeTag,
        clearSearch
      }
    },
    activate(done) {

      this.loadTags().then(() => {
        done();
      });

    },
    computed:{
      maxHeight(){
        if(window.matchMedia('(max-width: 750px)').matches){
          return 76 * 6.5 + 6 + 'px';
        } else {
          return 39 * 3.5 - 2 + 'px';
        }
      },
      baseHeight(){
        if(!window.matchMedia('(max-width: 750px)').matches){
          return 78;
        } else {
          return;
        }
      },
      marginBottom(){
        if(window.matchMedia('(max-width: 750px)').matches){
          return;
        } else {
          return 5;
        }

      },
      marginRight(){
        if(window.matchMedia('(max-width: 750px)').matches){
          return;
        } else {
          return 5;
        }
      },
      tagsFontSize(){
        if(window.browser.mobile){
          return null;
        }
        return '16px';

      },
      tagsLineHeight(){
        if(window.matchMedia('(max-width: 750px)').matches){
          return '37px';
        } else {
          return '28px';
        }

      }
    },
    methods: {

      clear(){
        this.clearSearch();
        this.scrollCnt.scrollTop = 0;
        Vue.set('isOpenTags', false);
      },

      search() {
        this.setSearchValue( this.$refs.input.value );
      },
      onFocusInput() {
        Vue.set('isOpenTags', true)
        this.inputFocused = true;
      },
      onBlurInput() {
        this.inputFocused = false;
      }
    }
  }
</script>
