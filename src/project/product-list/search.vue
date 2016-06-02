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

    .search-tags(
      :class='{"__open": showMoreTags}')
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
  } from 'vuex/getters';
  import { isAuth } from 'vuex/getters/user.js';
  import {
    loadTags,
    setSearchValue,
    selectTag,
    removeTag,
    clearSearch
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
        isAuth,
      },
      actions: {
        loadTags,
        setSearchValue,
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
      },

      selectedTags() {
        this.scrollToView();
        this.detectHeightTags();
      },

      tags() {
        this.showMoreTags = false;
        this.detectHeightTags();
      }
    }
  }
</script>
