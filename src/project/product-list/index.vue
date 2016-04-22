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
    search-component
    photos-component(id="headerAnchor")
    footer-component
    navbar-component(current="feed")
</template>

<script type="text/babel">
import HeaderComponent from 'base/header/header.vue'
import NavbarComponent from 'base/navbar/navbar.vue'

import HeroComponent from './hero.vue'
// import RegisterOffer from './register-offer.vue'
import CaptionComponent from './caption.vue'
import SearchComponent from './search.vue'
import TagsComponent from './tags.vue'
import PhotosComponent from './photos.vue'
import FooterComponent from 'base/footer/footer.vue'

export default {
  components: {
    HeaderComponent,
    NavbarComponent,
    SearchComponent,
    HeroComponent,
    // RegisterOffer,
    CaptionComponent,
    TagsComponent,
    PhotosComponent,
    FooterComponent
  }
}
</script>
