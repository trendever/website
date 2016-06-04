<style src='./styles/search.pcss'></style>
<template lang="jade">
.search-placeholder
  #search
    .search-stub(v-if='searchGlued')

    .search-input(:class='{"glued":searchGlued}')
      .search-input__container(:class='{"__focused": inputFocused, "__active": searchValue.length || selectedTags.length}')
        .search-input__search-btn(@click='search()')
          i.ic-search.__mirror

        input.search-input__input(
          v-el:input,
          @keydown='search()',
          :value='searchValue',
          @focus='onFocusInput',
          @blur='onBlurInput',
          type='text',
          placeholder='Ищите или фильтруйте...')

        .search-input__clear-btn
          span.badge(v-if='selectedTags.length') {{ selectedTags.length }}
          span.close(v-show='searchValue.length || selectedTags.length',
                     @click='clearSearch'): i.ic-close
          span.change-col
            span.change-col__two-col( :class='{"active": getColumnNumber === 3}', @click='setColumnNumber(2)')
              span.change-col__big
              span.change-col__big
              span.change-col__big
              span.change-col__big

            span.change-col__three-col( :class='{"active": getColumnNumber === 2}', @click='setColumnNumber(3)')
              span.change-col__sm
              span.change-col__sm
              span.change-col__sm
              span.change-col__sm
              span.change-col__sm
              span.change-col__sm
              span.change-col__sm
              span.change-col__sm
              span.change-col__sm
          span(v-on:click="scrollUp").scroll-top
              img(src='img/to-top.png')

    .search-tags(
      :class='{"__open": showMoreTags}')
      .search-tags__wrap
        ul.search-tags__container(v-el:tags)

          li.search-tags__item__selected(
            v-for='tag in selectedTags | filterBy searchValue in "name"',
            @click='removeTag(tag, $index)',
            @touch='removeTag(tag, $index)')
            span {{ tag.name }}&nbsp;
            i.ic-close

          li.search-tags__item.tag_list(
            v-for='tag in tags | filterBy searchValue in "name"',
            @click='selectTag(tag)') {{ tag.name }}

        .search-tags__button(
          v-if='showMoreButton',
          @click='toggleShowMoreTags')

</template>

<script type='text/babel'>
  import listen from 'event-listener';
  import {
    searchValue,
    tags,
    selectedTags,
    getColumnNumber, // TODO Исправить
  } from 'vuex/getters';
  import { isAuth } from 'vuex/getters/user.js';
  import {
    loadTags,
    setSearchValue,
    selectTag,
    removeTag,
    clearSearch,
    setColumnNumber // TODO Исправить
  } from 'vuex/actions';

  export default {
    data(){
      return {
        showMoreTags: false,
        showMoreButton: false,
        searchGlued: false,
        inputFocused: false,
      }
    },
    ready(){
      this.scrollCnt = document.querySelector('.scroll-cnt');

      //TODO исправить

      if (!this.getColumnNumber) {
        let columnNumber = 3;
        if( document.body.offsetWidth <= 750) {
          columnNumber = 2;
        }
        this.setColumnNumber(columnNumber);
      }

      //

      this.gluingSearch = listen( this.scrollCnt, 'scroll', () => {
        if ( this.isAuth ) {
          let searchHeight = 50;
          if ( window.matchMedia( '(max-width: 750px)' ).matches ) {
            searchHeight = 100;
          }

          if ( this.scrollCnt.scrollTop > searchHeight ) {
            this.$set( 'searchGlued', true );
          } else {
            this.$set( 'searchGlued', false );
          }
        }
      } );

    },
    beforeDestroy(){
      if ( this.isAuth ) {
        this.gluingSearch.remove();
      }
    },
    vuex: {
      getters: {
        searchValue,
        tags,
        selectedTags,
        getColumnNumber,
        isAuth,
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
    created() {
      this.loadTags();
    },
    methods: {
      toggleShowMoreTags() {
        this.$els.tags.scrollTop = 0;
        this.showMoreTags = !this.showMoreTags;
      },

      changeSearchNav() {
        var posBlock = parseInt(getComputedStyle(document.querySelector('.smallHero')).height);
        var blockToggleClass = document.querySelector('.search-input__clear-btn');
        var scrollBlock = this.scrollCnt;
        scrollBlock.onscroll = function () {
          if(scrollBlock.scrollTop > posBlock ){
            blockToggleClass.classList.add('scroll');
          } else {
            blockToggleClass.classList.remove('scroll');
          }
        }
      },

      scrollUp() {
        this.scrollCnt.scrollTop = 0;
      },

      search() {
        this.setSearchValue(this.$els.input.value);
        this.scrollToView();
      },

      scrollToView() {
        if(this.searchValue.trim().length || this.selectedTags.length) {
          // document.getElementById('tags').scrollIntoView();
          //window.body.scrollTop = document.getElementById('tags').offsetTop;
        }
      },

      detectHeightTags() {
        this.$nextTick(() => {
          // TODO - need detect this
          this.showMoreButton = !!(this.$els.tags && (this.$els.tags.scrollHeight > this.$els.tags.clientHeight));
        })
      },

      setPaddingTags(){
        var tags = this.$els.tags.children;
        var wrapWidth = this.$els.tags.offsetWidth;
        var blocksWidth = 0;
        var minPadding = 30;
        for (var i = 0; i < tags.length; i++){
          tags[i].style.width = 'auto';
          tags[i].style.padding = 0;
        }

        for (var i = 0; i < tags.length; i++){
          tags[i].style.width = tags[i].offsetWidth + 'px';
        }

        for(var i = 0, j = 0, count = 1; i < tags.length; i++, count++){
          if ((blocksWidth + tags[i].offsetWidth + minPadding * count) > wrapWidth || i === tags.length - 1) {
            var padding = ((wrapWidth - blocksWidth) / (count - 1)) / 2;

            if (i === tags.length - 1) {
              blocksWidth += tags[i].offsetWidth + 10;
              var padding = ((wrapWidth - blocksWidth) / (count)) / 2;

              for (;j <= i; j++) {
                tags[j].style.padding =  '0 ' + padding + 'px';
              }
            } else {
              for (;j < i; j++) {
                tags[j].style.padding =  '0 ' + padding + 'px';
              }
            }

            blocksWidth = 0;
            count = 1;
            blocksWidth += tags[i].offsetWidth + 10;
          } else {
            blocksWidth += tags[i].offsetWidth + 10;
          }
        }
      },

      onFocusInput() {
        this.showMoreTags = false;
        this.inputFocused = true;
      },

      onBlurInput() {
        this.inputFocused = false;
      }
    },
    watch: {
      searchValue() {
        this.scrollToView();
        this.detectHeightTags();
        this.setPaddingTags();
      },

      selectedTags() {
        this.scrollToView();
        this.detectHeightTags();
        this.setPaddingTags();
      },

      tags() {
        this.showMoreTags = false;
        this.detectHeightTags();
        this.setPaddingTags();
      }
    }
  }
</script>
