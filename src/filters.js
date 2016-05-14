import Vue from 'vue';
import { urlThumbnail } from './utils';

export default function() {

  Vue.filter('url_thumbnail', function(url, size = null, originalWidth = null, originalHeight = null) {
    /**
     *  Changed instagram photo url, for crop image.
     *  Supports sizes: 150, 306, 480, 640 (width=height)
     *  if width and height not size, then will get original
     * @type {string} url
     * @type {number} size
     */
    return urlThumbnail(url, size, originalWidth, originalHeight);

  });

  Vue.filter('curency_spaces', function(value) {
    return (value + '').replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
  });
}
