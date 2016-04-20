<template lang="jade">
header-component(
  title="Новые тренды",
  show_on_elem="headerAnchor",
  :is_secondary="true",
  scroll-to-element='tags')

hero-component
caption-component

.section.main
  .section__content
    // register-offer
    tags-component
    //search-component(
      show_on_elem='headerAnchor')
    photos-component#headerAnchor
    footer-component
    navbar-component(current="feed")
</template>

<script>
import HeaderComponent from 'base/header/header.vue'
import NavbarComponent from 'base/navbar/navbar.vue'

import HeroComponent from './hero.vue'
// import RegisterOffer from './register-offer.vue'
import CaptionComponent from './caption.vue'

// import SearchComponent from './../search.vue'

import TagsComponent from './tags.vue'
import PhotosComponent from './photos.vue'
import FooterComponent from 'base/footer/footer.vue'

export default {
  data: () => ({
  }),
  components: {
    HeaderComponent,
    NavbarComponent,
    // SearchComponent,
    HeroComponent,
    // RegisterOffer,
    CaptionComponent,
    TagsComponent,
    PhotosComponent,
    FooterComponent
  }
}
</script>
