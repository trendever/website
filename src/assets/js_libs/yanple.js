window.__debugMode = true;
window._wf = 0; // window focused

if (!yan) {
  var yan = {};
}

if (!window._ua) {
  var _ua = navigator.userAgent.toLowerCase();
}
var parseJSON = (window.JSON && JSON.parse) ? function (obj) {
  try {
    return JSON.parse(obj);
  } catch (e) {
    topError('<b>parseJSON:</b> ' + e.message, {
      dt: -1,
      type: 5,
      answer: obj
    });
    return eval('(' + obj + ')');
  }
} : function (obj) {
  return eval('(' + obj + ')');
};

var cur = {destroy: [], templates: {}}; // Current page variables and navigation map.
var browser = {
  version: (_ua.match(/.+(?:me|ox|on|rv|it|era|opr|ie)[\/: ]([\d.]+)/) || [0, '0'])[1],
  opera: (/opera/i.test(_ua) || /opr/i.test(_ua)),
  msie: (/msie/i.test(_ua) && !/opera/i.test(_ua) || /trident\//i.test(_ua)),
  msie6: (/msie 6/i.test(_ua) && !/opera/i.test(_ua)),
  msie7: (/msie 7/i.test(_ua) && !/opera/i.test(_ua)),
  msie8: (/msie 8/i.test(_ua) && !/opera/i.test(_ua)),
  msie9: (/msie 9/i.test(_ua) && !/opera/i.test(_ua)),
  mozilla: /firefox/i.test(_ua),
  chrome: /chrome/i.test(_ua),
  chrome_mobile: /CriOS/i.test(_ua),
  safari: (!(/chrome/i.test(_ua)) && /webkit|safari|khtml/i.test(_ua)),
  iphone: /iphone/i.test(_ua),
  ipod: /ipod/i.test(_ua),
  iphone4: /iphone.*OS 4/i.test(_ua),
  ipod4: /ipod.*OS 4/i.test(_ua),
  ipad: /ipad/i.test(_ua),
  android: /android/i.test(_ua),
  bada: /bada/i.test(_ua),
  mobile: /iphone|ipod|ipad|opera mini|opera mobi|iemobile|android/i.test(_ua),
  msie_mobile: /iemobile/i.test(_ua),
  safari_mobile: /iphone|ipod|ipad/i.test(_ua),
  opera_mobile: /opera mini|opera mobi/i.test(_ua),
  opera_mini: /opera mini/i.test(_ua),
  mac: /mac/i.test(_ua),
  search_bot: /(yandex|google|stackrambler|aport|slurp|msnbot|bingbot|twitterbot|ia_archiver|facebookexternalhit)/i.test(_ua)
};

window.locHost = location.host;
window.locProtocol = location.protocol;
window.__dev = /[a-z0-9_\-]+\.[a-z0-9_\-]+\.[a-z0-9_\-]+\.[a-z0-9_\-]+/i.test(locHost) || location.hostname == "localhost";
if (!__dev) __debugMode = false;
window.locHash = location.hash.replace('#/', '').replace('#!', '');
window.locBase = location.toString().replace(/#.+$/, '');

function topMsg(text, seconds, color) {
  if (!color) color = '#D6E5F7';
  if (!text) {
    hide('system_msg');
  } else {
    clearTimeout(window.topMsgTimer);
    var el = ge('system_msg');
    el.style.backgroundColor = color;
    el.innerHTML = text;
    show(el);
    if (seconds) {
      window.topMsgTimer = setTimeout(topMsg.pbind(false), seconds * 1000);
    }
  }
}

function topError(text, opts) {
  if (!opts) opts = {};
  if (text.message) {
    var e = text;
    text = '<b>JavaScript error:</b> ' + e.message;
    opts.stack = e.stack;
    if (e.stack && __debugMode) text += '<br/>' + e.stack.replace(/\n/g, '<br/>');
    try {
      console.log(e.stack);
    } catch (e2) {
    }

  }
  if (!opts.stack) {
    try {
      eval('0 = 1');
    } catch (e) {
      opts.stack = e.stack;
    }
  }

  if (opts.dt != -1) {
    topMsg(text, opts.dt, '#FFB4A3');
  }
  //if (!__dev && !ge('debuglogwrap')) {
  //    delete(opts.dt);
  //    ajax.plainpost('/errors', extend(opts, {
  //        msg: opts.msg || text,
  //        module: (window.cur || {}).module,
  //        id: yan.id,
  //        host: locHost,
  //        lang: yan.lang,
  //        loc: (window.nav || {}).strLoc,
  //        realloc: location.toString()
  //    }));
  //}
}

// Debug Log
var _logTimer = (new Date()).getTime();
function debugLog(msg) {
  if (!__debugMode) return;
  try {
    window.debuglogClient && debuglogClient(msg);
    if (window.console && console.log) {
      var args = Array.prototype.slice.call(arguments);
      if (browser.msie || browser.mobile) {
        console.log(args.join(' '));
      } else {
        console.log.apply(console, args);
      }
    }
  } catch (e) {
  }
}
function debugEl(el) {
  return el && (((el.tagName || '').toLowerCase() + (el.className ? '.' + el.className.replace(/\s+/g, '.') : '') + (el.id && !/^__vk/.test(el.id) ? '#' + el.id : '')) || el.toString()) || '[NULL]';
}

// DOM
function qs(selector, scope) {
  return (scope || document).querySelector(selector);
}
function qsa(selector, scope) {
  return (scope || document).querySelectorAll(selector);
}
function ge(el) {
  return (typeof el == 'string' || typeof el == 'number') ? document.getElementById(el) : el;
}
function geByTag(searchTag, node) {
  node = ge(node) || document;
  return node.getElementsByTagName(searchTag);
}
function geByTag1(searchTag, node) {
  node = ge(node) || document;
  return node.querySelector && node.querySelector(searchTag) || geByTag(searchTag, node)[0];
}
function geByClass(searchClass, node, tag) {
  node = ge(node) || document;
  tag = tag || '*';
  var classElements = [];

  if (!browser.msie8 && node.querySelectorAll && tag != '*') {
    return node.querySelectorAll(tag + '.' + searchClass);
  }
  if (node.getElementsByClassName) {
    var nodes = node.getElementsByClassName(searchClass);
    if (tag != '*') {
      tag = tag.toUpperCase();
      for (var i = 0, l = nodes.length; i < l; ++i) {
        if (nodes[i].tagName.toUpperCase() == tag) {
          classElements.push(nodes[i]);
        }
      }
    } else {
      classElements = Array.prototype.slice.call(nodes);
    }
    return classElements;
  }

  var els = geByTag(tag, node);
  var pattern = new RegExp('(^|\\s)' + searchClass + '(\\s|$)');
  for (var i = 0, l = els.length; i < l; ++i) {
    if (pattern.test(els[i].className)) {
      classElements.push(els[i]);
    }
  }
  return classElements;
}
function _geByClass(searchClass, node) {
  if (document.getElementsByClassName) {
    getElementsByClass = function (searchClass, node) {
      return ge(node) || document.getElementsByClassName(searchClass)
    }
  } else {
    getElementsByClass = function (searchClass, node) {
      node = ge(node) || document;
      list = node.getElementsByTagName('*'),
        length = list.length,
        classArray = classList.split(/\s+/),
        classes = classArray.length,
        result = [], i, j
      for (i = 0; i < length; i++) {
        for (j = 0; j < classes; j++) {
          if (list[i].className.search('\\b' + classArray[j] + '\\b') != -1) {
            result.push(list[i])
            break
          }
        }
      }

      return result
    }
  }
}
function geByClass1(searchClass, node, tag) {
  node = ge(node) || document;
  tag = tag || '*';
  return !browser.msie8 && node.querySelector && node.querySelector(tag + '.' + searchClass) || geByClass(searchClass, node, tag)[0];
}
function gpeByClass(className, elem) {
  elem = ge(elem);
  if (!elem) return null;
  while (elem = elem.parentNode) {
    if (hasClass(elem, className)) return elem;
  }
  return null;
}
function ce(tagName, attr, style) {
  var el = document.createElement(tagName);
  if (attr) extend(el, attr);
  if (style) setStyle(el, style);
  return el;
}
function rmEl(elem) {
  elem = ge(elem);
  if (!elem || !elem.style) {
    return;
  }
  elem.parentNode.removeChild(elem);
}

window.cf = (function (doc) {
  var frag = doc.createDocumentFragment(),
    elem = doc.createElement('div'),
    range = doc.createRange && doc.createRange();
  frag.appendChild(elem);
  range && range.selectNodeContents(elem);

  return range && range.createContextualFragment ?
    function (html) {
      if (!html) return doc.createDocumentFragment();
      return range.createContextualFragment(html);
    } :
    function (html) {
      if (!html) return doc.createDocumentFragment();
      elem.innerHTML = html;
      var frag = doc.createDocumentFragment();
      while (elem.firstChild) {
        frag.appendChild(elem.firstChild);
      }
      return frag;
    };
})(document);

function re(el) {
  el = ge(el);
  if (el && el.parentNode) el.parentNode.removeChild(el);
  return el;
}

function se(html) {
  return ce('div', {innerHTML: html}).firstChild;
}
function prepend(parent, obj) {
  var el = ge(parent);
  if (Object.prototype.toString.call(obj) === '[object String]') {
    obj = se(obj);
  }
  el.insertBefore(obj, el.firstChild);
}
function append(parent, obj) {
  var el = ge(parent);
  if (Object.prototype.toString.call(obj) === '[object String]') {
    obj = se(obj);
  }
  parent.appendChild(obj)
}
function rs(html, repl) {
  each(repl, function (k, v) {
    html = html.replace(new RegExp('%' + k + '%', 'g'), v);
  });
  return html;
}

function domEL(el, p) {
  p = p ? 'previousSibling' : 'nextSibling';
  while (el && !el.tagName) el = el[p];
  return el;
}
function domNS(el) {
  return domEL((el || {}).nextSibling);
}
function domPS(el) {
  return domEL((el || {}).previousSibling, 1);
}
function domFC(el) {
  return domEL((el || {}).firstChild);
}
function domLC(el) {
  return domEL((el || {}).lastChild, 1);
}
function domPN(el) {
  return (el || {}).parentNode;
}

function isAncestor(el, ancestor) {
  var current = ge(el);
  ancestor = ge(ancestor);
  if (!el || !ancestor) {
    return false;
  }
  while (current = current.parentNode) {
    if (current == ancestor) {
      return true;
    }
  }
  return false;
}

function show(elem) {
  var l = arguments.length;
  if (l > 1) {
    for (var i = 0; i < l; i++) {
      show(arguments[i]);
    }
    return;
  }

  elem = ge(elem);
  if (!elem || !elem.style) return;

  var old = elem.olddisplay;
  var newStyle = 'block';
  var tag = elem.tagName.toLowerCase();
  elem.style.display = old || '';

  if (getStyle(elem, 'display') !== 'none') {
    return;
  }

  if (hasClass(elem, 'inline')) {
    newStyle = 'inline';
  } else if (tag === 'tr' && !browser.msie) {
    newStyle = 'table-row';
  } else if (tag === 'table' && !browser.msie) {
    newStyle = 'table';
  } else {
    newStyle = 'block';
  }
  elem.style.display = elem.olddisplay = newStyle;
}

function hide(elem) {
  var l = arguments.length;
  if (l > 1) {
    for (var i = 0; i < l; i++) {
      hide(arguments[i]);
    }
    return;
  }

  elem = ge(elem);
  if (!elem || !elem.style) return;

  var display = getStyle(elem, 'display');
  elem.olddisplay = ((display != 'none') ? display : '');
  elem.style.display = 'none';
}

function isVisible(elem) {
  elem = ge(elem);
  if (!elem || !elem.style) return false;
  return getStyle(elem, 'display') != 'none';
}

function toggle(elem, v) {
  if (v === undefined) {
    v = !isVisible(elem);
  }
  if (v) {
    show(elem);
  } else {
    hide(elem);
  }
}

function getXY(obj, forFixed) {
  obj = ge(obj);
  if (!obj) return [0, 0];

  var left = 0, top = 0, pos, lastLeft;
  if (obj.offsetParent) {
    do {
      left += (lastLeft = obj.offsetLeft);
      top += obj.offsetTop;
      pos = getStyle(obj, 'position');
      if (pos == 'fixed' || pos == 'absolute' || (pos == 'relative')) {
        left -= obj.scrollLeft;
        top -= obj.scrollTop;
        if (pos == 'fixed' && !forFixed) {
          left += ((obj.offsetParent || {}).scrollLeft || bodyNode.scrollLeft || htmlNode.scrollLeft);
          top += ((obj.offsetParent || {}).scrollTop || bodyNode.scrollTop || htmlNode.scrollTop);
        }
      }
    } while (obj = obj.offsetParent);
  }
  if (forFixed && browser.msie && intval(browser.version) < 9) {
    if (lastLeft) {
      left += ge('page_layout').offsetLeft;
    }
  }
  return [left, top];
}

function getSize(elem, withoutBounds) {
  elem = ge(elem);
  var s = [0, 0], de = document.documentElement;
  if (elem == document) {
    s = [Math.max(
      de.clientWidth,
      bodyNode.scrollWidth, de.scrollWidth,
      bodyNode.offsetWidth, de.offsetWidth
    ), Math.max(
      de.clientHeight,
      bodyNode.scrollHeight, de.scrollHeight,
      bodyNode.offsetHeight, de.offsetHeight
    )];
  } else if (elem) {
    function getWH() {
      s = [elem.offsetWidth, elem.offsetHeight];
      if (!withoutBounds) return;
      var padding = 0, border = 0;
      each(s, function (i, v) {
        var which = i ? ['Top', 'Bottom'] : ['Left', 'Right'];
        each(which, function () {
          s[i] -= parseFloat(getStyle(elem, 'padding' + this)) || 0;
          s[i] -= parseFloat(getStyle(elem, 'border' + this + 'Width')) || 0;
        });
      });
      s = [Math.round(s[0]), Math.round(s[1])];
    }

    if (!isVisible(elem)) {
      var props = {
        position: 'absolute',
        visibility: 'hidden',
        display: 'block'
      };
      var old = {};
      each(props, function (i, v) {
        old[i] = elem.style[i];
        elem.style[i] = v;
      });
      getWH();
      each(props, function (i, v) {
        elem.style[i] = old[i];
      });
    } else getWH();

  }
  return s;
}

function getZoom() {
  var r1 = ge('zoom_test_1') || document.body.appendChild(ce('div', {id: 'zoom_test_1'}, {
        left: '10%',
        position: 'absolute',
        visibility: 'hidden'
      })),
    r2 = ge('zoom_test_2') || document.body.appendChild(ce('div', {id: 'zoom_test_2'}, {
        left: r1.offsetLeft + 'px',
        position: 'absolute',
        visibility: 'hidden'
      }));
  return r2.offsetLeft / r1.offsetLeft;
}

//
//  Useful utils
//

Function.prototype.pbind = function () {
  var args = Array.prototype.slice.call(arguments);
  args.unshift(window);
  return this.bind.apply(this, args);
};
Function.prototype.bind = function () {
  var func = this, args = Array.prototype.slice.call(arguments);
  var obj = args.shift();
  return function () {
    var curArgs = Array.prototype.slice.call(arguments);
    return func.apply(obj, args.concat(curArgs));
  }
};
function rand(mi, ma) {
  return Math.random() * (ma - mi + 1) + mi;
}
function irand(mi, ma) {
  return Math.floor(rand(mi, ma));
}
function isFunction(obj) {
  return Object.prototype.toString.call(obj) === '[object Function]';
}
function isArray(obj) {
  return Object.prototype.toString.call(obj) === '[object Array]';
}
function isObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}
function isNumber(obj) {
  return Object.prototype.toString.call(obj) === '[object Number]';
}
function isString(obj) {
  return Object.prototype.toString.call(obj) === '[object String]';
}
function isEmpty(o) {
  if (Object.prototype.toString.call(o) !== '[object Object]') {
    return false;
  }
  for (var i in o) {
    if (o.hasOwnProperty(i)) {
      return false;
    }
  }
  return true;
}
function yanNow() {
  return +new Date;
}
function yanImage() { // temp
  return window.Image ? (new Image()) : ce('img');
}
// IE8 workaround
function trim(text) {
  return (text || '').replace(/^\s+|\s+$/g, '');
}
function stripHTML(text) {
  return text ? text.replace(/<(?:.|\s)*?>/g, '') : '';
}
function escapeRE(s) {
  return s ? s.replace(/([.*+?^${}()|[\]\/\\])/g, '\\$1') : '';
}
function intval(value) {
  if (value === true) return 1;
  return parseInt(value) || 0;
}
function floatval(value) {
  if (value === true) return 1;
  return parseFloat(value) || 0;
}
function positive(value) {
  value = intval(value);
  return value < 0 ? 0 : value;
}

function winToUtf(text) {
  return text.replace(/&#(\d\d+);/g, function (s, c) {
    c = intval(c);
    return (c >= 32) ? String.fromCharCode(c) : s;
  }).replace(/&quot;/gi, '"').replace(/&lt;/gi, '<').replace(/&gt;/gi, '>').replace(/&amp;/gi, '&');
}
function replaceEntities(str) {
  return se('<textarea>' + ((str || '').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')) + '</textarea>').value;
}
function clean(str) {
  if (str && str.length) {
    str = str.toString();
    return str ? str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;') : '';
  }
  return '';
}

function escapeRegExp(string) {
  return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}
function str_replace(find, replace, string) {
  return string.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

//
//  Arrays, objects
//

//test = new Array("","One","Two","", "Three","","Four").clean("");
//test2 = [1,2,,3,,3,,,,,,4,,4,,5,,6,,,,];
//test2.clean(undefined);
Array.prototype.clean = function (deleteValue) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == deleteValue) {
      this.splice(i, 1);
      i--;
    }
  }
  return this;
};

function each(object, callback) {
  var name, i = 0, length = object.length;

  if (length === undefined) {
    for (name in object)
      if (callback.call(object[name], name, object[name]) === false)
        break;
  } else {
    for (var value = object[0];
         i < length && callback.call(value, i, value) !== false;
         value = object[++i]) {
    }
  }

  return object;
}
function indexOf(arr, value, from) {
  for (var i = from || 0, l = (arr || []).length; i < l; i++) {
    if (arr[i] == value) return i;
  }
  return -1;
}
function inArray(value, arr) {
  return indexOf(arr, value) != -1;
}
function clone(obj, req) {
  var newObj = isArray(obj) ? [] : {};
  for (var i in obj) {
    if (i !== "position" && i !== "totalSize") {
      if (/webkit/i.test(_ua) && (i == 'layerX' || i == 'layerY')) continue;
      if (req && typeof(obj[i]) === 'object' && i !== 'prototype') {
        newObj[i] = clone(obj[i]);
      } else {
        newObj[i] = obj[i];
      }
    }

  }
  return newObj;
}
function arrayKeyDiff(a) {   // Computes the difference of arrays by keys and values
  var arr_dif = {}, i = 1, argc = arguments.length, argv = arguments, key, found;
  for (key in a) {
    found = false;
    for (i = 1; i < argc; i++) {
      if (argv[i][key] && (argv[i][key] == a[key])) {
        found = true;
      }
    }
    if (!found) {
      arr_dif[key] = a[key];
    }
  }
  return arr_dif;
}
function extend() {
  var a = arguments, target = a[0] || {}, i = 1, l = a.length, deep = false, options;

  if (typeof target === 'boolean') {
    deep = target;
    target = a[1] || {};
    i = 2;
  }

  if (typeof target !== 'object' && !isFunction(target)) target = {};

  for (; i < l; ++i) {
    if ((options = a[i]) != null) {
      for (var name in options) {
        var src = target[name], copy = options[name];

        if (target === copy) continue;

        if (deep && copy && typeof copy === 'object' && !copy.nodeType) {
          target[name] = extend(deep, src || (copy.length != null ? [] : {}), copy);
        } else if (copy !== undefined) {
          target[name] = copy;
        }
      }
    }
  }

  return target;
}
function addToObjects(arr, path) {
  return each(arr, function (id, obj) {
    arr[id] = extend(obj, path)
  });
}
function dictToLst(dict) {
  return Object.keys(dict).map(function (key) {
    return dict[key];
  });
}

// CSS classes

function hasClass(obj, name) {
  obj = ge(obj);
  return obj && (new RegExp('(\\s|^)' + name + '(\\s|$)')).test(obj.className);
}
function addClass(obj, name) {
  if ((obj = ge(obj)) && !hasClass(obj, name)) {
    obj.className = (obj.className ? obj.className + ' ' : '') + name;
  }
}
function removeClass(obj, name) {
  if (obj = ge(obj)) {
    obj.className = trim((obj.className || '').replace((new RegExp('(\\s|^)' + name + '(\\s|$)')), ' '));
  }
}
function toggleClass(obj, name, v) {
  if (v === undefined) {
    v = !hasClass(obj, name);
  }
  (v ? addClass : removeClass)(obj, name);
  return v;
}
function replaceClass(obj, oldName, newName) {
  removeClass(obj, oldName);
  addClass(obj, newName);
}

// Get computed style
function getStyle(elem, name, force) {
  elem = ge(elem);
  if (isArray(name)) {
    var res = {};
    each(name, function (i, v) {
      res[v] = getStyle(elem, v);
    });
    return res;
  }
  if (force === undefined) {
    force = true;
  }
  if (!force && name == 'opacity' && browser.msie) {
    var filter = elem.style['filter'];
    return filter ? (filter.indexOf('opacity=') >= 0 ?
    (parseFloat(filter.match(/opacity=([^)]*)/)[1]) / 100) + '' : '1') : '';
  }
  if (!force && elem.style && (elem.style[name] || name == 'height')) {
    return elem.style[name];
  }

  var ret, defaultView = document.defaultView || window;
  if (defaultView.getComputedStyle) {
    name = name.replace(/([A-Z])/g, '-$1').toLowerCase();
    var computedStyle = defaultView.getComputedStyle(elem, null);
    if (computedStyle) {
      ret = computedStyle.getPropertyValue(name);
    }
  } else if (elem.currentStyle) {
    if (name == 'opacity' && browser.msie) {
      var filter = elem.currentStyle['filter'];
      return filter && filter.indexOf('opacity=') >= 0 ?
      (parseFloat(filter.match(/opacity=([^)]*)/)[1]) / 100) + '' : '1';
    }
    var camelCase = name.replace(/\-(\w)/g, function (all, letter) {
      return letter.toUpperCase();
    });
    ret = elem.currentStyle[name] || elem.currentStyle[camelCase];
    //dummy fix for ie
    if (ret == 'auto') {
      ret = 0;
    }

    ret = (ret + '').split(' ');
    each(ret, function (i, v) {
      if (!/^\d+(px)?$/i.test(v) && /^\d/.test(v)) {
        var style = elem.style, left = style.left, rsLeft = elem.runtimeStyle.left;
        elem.runtimeStyle.left = elem.currentStyle.left;
        style.left = v || 0;
        ret[i] = style.pixelLeft + 'px';
        style.left = left;
        elem.runtimeStyle.left = rsLeft;
      }
    });
    ret = ret.join(' ');
  }

  if (force && (name == 'width' || name == 'height')) {
    var ret2 = getSize(elem, true)[({'width': 0, 'height': 1})[name]];
    ret = (intval(ret) ? Math.max(floatval(ret), ret2) : ret2) + 'px';
  }

  return ret;
}

function setStyle(elem, name, value) {
  elem = ge(elem);
  if (!elem) return;
  if (typeof name == 'object') return each(name, function (k, v) {
    setStyle(elem, k, v);
  });
  if (name == 'opacity') {
    if (browser.msie) {
      if ((value + '').length) {
        if (value !== 1) {
          elem.style.filter = 'alpha(opacity=' + value * 100 + ')';
        } else {
          elem.style.filter = '';
        }
      } else {
        elem.style.cssText = elem.style.cssText.replace(/filter\s*:[^;]*/gi, '');
      }
      elem.style.zoom = 1;
    }
    elem.style.opacity = value;
  } else {
    try {
      var isN = typeof(value) == 'number';
      if (isN && (/height|width/i).test(name)) value = Math.abs(value);
      elem.style[name] = isN && !(/z-?index|font-?weight|opacity|zoom|line-?height/i).test(name) ? value + 'px' : value;
    } catch (e) {
      debugLog('setStyle error: ', [name, value], e);
    }
  }
}

//
// Store data connected to element
//
var yanExpand = 'YAN' + yanNow(), yanUUID = 0, yanCache = {};

function cache(elem, name, data) {
  var id = elem[yanExpand], undefined;
  if (!id) {
    id = elem[yanExpand] = ++yanUUID;
  }

  if (data !== undefined) {
    if (!yanCache[id]) {
      yanCache[id] = {};
      if (__debugMode) yanCache[id].__elem = elem;
    }
    yanCache[id][name] = data;
  }

  return name ? yanCache[id] && yanCache[id][name] : id;
}
function removeAttr(el) {
  for (var i = 0, l = arguments.length; i < l; ++i) {
    var n = arguments[i];
    if (el[n] === undefined) continue;
    try {
      delete el[n];
    } catch (e) {
      try {
        el.removeAttribute(n);
      } catch (e) {
      }
    }
  }
}
function removeCache(elem, name) {
  var id = elem ? elem[yanExpand] : false;
  if (!id) return;

  if (name) {
    if (yanCache[id]) {
      delete yanCache[id][name];
      name = '';

      var count = 0;
      for (name in yanCache[id]) {
        if (name !== '__elem') {
          count++;
          break;
        }
      }

      if (!count) {
        removeCache(elem);
      }
    }
  } else {
    removeEvent(elem);
    removeAttr(elem, yanExpand);
    delete yanCache[id];
  }
}
function cleanElems() {
  var a = arguments;
  for (var i = 0; i < a.length; ++i) {
    var el = ge(a[i]);
    if (el) {
      removeCache(el);
      removeAttr(el, 'btnevents');
    }
  }
}

// Simple FX
function animate(el, params, speed, callback) {
  el = ge(el);
  if (!el) return;
  var _cb = isFunction(callback) ? callback : function () {
  };
  var options = extend({}, typeof speed == 'object' ? speed : {
    duration: speed,
    onComplete: _cb
  });
  var fromArr = {}, toArr = {}, visible = isVisible(el), self = this, p;
  options.orig = {};
  params = clone(params);
  if (params.discrete) {
    options.discrete = 1;
    delete(params.discrete);
  }
  if (browser.iphone)
    options.duration = 0;
  var tween = cache(el, 'tween'), i, name, toggleAct = visible ? 'hide' : 'show';
  if (tween && tween.isTweening) {
    options.orig = extend(options.orig, tween.options.orig);
    tween.stop(false);
    if (tween.options.show) toggleAct = 'hide';
    else if (tween.options.hide) toggleAct = 'show';
  }
  for (p in params) {
    if (!tween && (params[p] == 'show' && visible || params[p] == 'hide' && !visible)) {
      return options.onComplete.call(this, el);
    }
    if ((p == 'height' || p == 'width') && el.style) {
      if (!params.overflow) {
        if (options.orig.overflow == undefined) {
          options.orig.overflow = getStyle(el, 'overflow');
        }
        el.style.overflow = 'hidden';
      }
      if (!hasClass(el, 'inl_bl') && el.tagName != 'TD') {
        el.style.display = 'block';
      }
    }
    if (/show|hide|toggle/.test(params[p])) {
      if (params[p] == 'toggle') {
        params[p] = toggleAct;
      }
      if (params[p] == 'show') {
        var from = 0;
        options.show = true;
        if (options.orig[p] == undefined) {
          options.orig[p] = getStyle(el, p, false) || '';
          setStyle(el, p, 0);
        }

        var o;
        if (p == 'height' && browser.msie6) {
          o = '0px';
          el.style.overflow = '';
        } else {
          o = options.orig[p];
        }

        var old = el.style[p];
        el.style[p] = o;
        params[p] = parseFloat(getStyle(el, p, true));
        el.style[p] = old;

        if (p == 'height' && browser.msie && !params.overflow) {
          el.style.overflow = 'hidden';
        }
      } else {
        if (options.orig[p] == undefined) {
          options.orig[p] = getStyle(el, p, false) || '';
        }
        options.hide = true;
        params[p] = 0;
      }
    }
  }
  if (options.show && !visible) {
    show(el);
  }
  tween = new Fx.Base(el, options);
  each(params, function (name, to) {
    if (/backgroundColor|borderBottomColor|borderLeftColor|borderRightColor|borderTopColor|color|borderColor|outlineColor/.test(name)) {
      var p = (name == 'borderColor') ? 'borderTopColor' : name;
      from = getColor(el, p);
      to = getRGB(to);
      if (from === undefined) return;
    } else {
      var parts = to.toString().match(/^([+-]=)?([\d+-.]+)(.*)$/),
        start = tween.cur(name, true) || 0;
      if (parts) {
        to = parseFloat(parts[2]);
        if (parts[1]) {
          to = ((parts[1] == '-=' ? -1 : 1) * to) + to;
        }
      }

      if (options.hide && name == 'height' && browser.msie6) {
        el.style.height = '0px';
        el.style.overflow = '';
      }
      from = tween.cur(name, true);
      if (options.hide && name == 'height' && browser.msie6) {
        el.style.height = '';
        el.style.overflow = 'hidden';
      }
      if (from == 0 && (name == 'width' || name == 'height'))
        from = 1;

      if (name == 'opacity' && to > 0 && !visible) {
        setStyle(el, 'opacity', 0);
        from = 0;
        show(el);
      }
    }
    if (from != to || (isArray(from) && from.join(',') == to.join(','))) {
      fromArr[name] = from;
      toArr[name] = to;
    }
  });
  tween.start(fromArr, toArr);
  cache(el, 'tween', tween);

  return tween;
}
function cubicBezier(x1, y1, x2, y2, t, dt) {
  var curveX = function (t) {
    var v = 1 - t;
    return 3 * v * v * t * x1 + 3 * v * t * t * x2 + t * t * t;
  };
  var curveY = function (t) {
    var v = 1 - t;
    return 3 * v * v * t * y1 + 3 * v * t * t * y2 + t * t * t;
  };
  var derivativeCurveX = function (t) {
    var v = 1 - t;
    return 3 * (2 * (t - 1) * t + v * v) * x1 + 3 * (-t * t * t + 2 * v * t) * x2;
  };
  var x = t, t0, t1, t2, xx, d2, i;

  // First try a few iterations of Newton's method -- normally very fast.
  for (t2 = x, i = 0; i < 8; i++) {
    xx = curveX(t2) - x;
    if (Math.abs(xx) < dt) {
      return curveY(t2);
    }
    d2 = derivativeCurveX(t2);
    if (Math.abs(d2) < 1e-6) break;
    t2 = t2 - xx / d2;
  }

  t0 = 0, t1 = 1, t2 = x;

  if (t2 < t0) return curveY(t0);
  if (t2 > t1) return curveY(t1);

  // Fallback to the bisection method for reliability.
  while (t0 < t1) {
    xx = curveX(t2);
    if (Math.abs(xx - x) < dt) return curveY(t2);
    if (x > xx) t0 = t2;
    else t1 = t2;
    t2 = (t1 - t0) * .5 + t0;
  }

  // Failure
  return curveY(t2);
}

function fadeTo(el, speed, to, callback) {
  return animate(el, {opacity: to}, speed, callback);
}

var Fx = {
  Transitions: {
    linear: function (t, b, c, d) {
      return c * t / d + b;
    },
    sineInOut: function (t, b, c, d) {
      return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
    },
    halfSine: function (t, b, c, d) {
      return c * (Math.sin(Math.PI * (t / d) / 2)) + b;
    },
    easeOutBack: function (t, b, c, d) {
      var s = 1.70158;
      return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
    },
    easeInCirc: function (t, b, c, d) {
      return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
    },
    easeOutCirc: function (t, b, c, d) {
      return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
    },
    easeInQuint: function (t, b, c, d) {
      return c * (t /= d) * t * t * t * t + b;
    },
    easeOutQuint: function (t, b, c, d) {
      return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
    },
    easeOutCubic: function (t, b, c, d) {
      return c * ((t = t / d - 1) * t * t + 1) + b;
    },
    swiftOut: function (t, b, c, d) {
      return c * cubicBezier(0.4, 0, 0.22, 1, t / d, 4 / d) + b;
    }
  },
  Attrs: [
    ['height', 'marginTop', 'marginBottom', 'paddingTop', 'paddingBottom'],
    ['width', 'marginLeft', 'marginRight', 'paddingLeft', 'paddingRight'],
    ['opacity', 'left', 'top']
  ],
  Timers: [],
  TimerId: null
}, fx = Fx;

Fx.Base = function (el, options, name) {
  this.el = ge(el);
  this.name = name;
  this.options = extend({
    onComplete: function () {
    },
    transition: options.transition || Fx.Transitions.sineInOut,
    duration: 500
  }, options || {});
};

function genFx(type, num) {
  var obj = {};
  each(Fx.Attrs.concat.apply([], Fx.Attrs.slice(0, num)), function () {
    obj[this] = type;
  });
  return obj;
}

// Shortcuts for custom animations
each({
  slideDown: genFx('show', 1),
  slideUp: genFx('hide', 1),
  slideToggle: genFx('toggle', 1),
  fadeIn: {opacity: 'show'},
  fadeOut: {opacity: 'hide'},
  fadeToggle: {opacity: 'toggle'}
}, function (f, v) {
  window[f] = function (el, speed, callback) {
    return animate(el, v, speed, callback);
  }
});

Fx.Base.prototype = {
  start: function (from, to) {
    this.from = from;
    this.to = to;
    this.time = yanNow();
    this.isTweening = true;

    var self = this;

    function t(gotoEnd) {
      return self.step(gotoEnd);
    }

    t.el = this.el;
    if (t() && Fx.Timers.push(t) && !Fx.TimerId) {
      Fx.TimerId = setInterval(function () {
        var timers = Fx.Timers, l = timers.length;
        for (var i = 0; i < l; i++) {
          if (!timers[i]()) {
            timers.splice(i--, 1);
            l--;
          }
        }
        if (!l) {
          clearInterval(Fx.TimerId);
          Fx.TimerId = null;
        }
      }, 13);
    }
    return this;
  },

  stop: function (gotoEnd) {
    var timers = Fx.Timers;

    for (var i = timers.length - 1; i >= 0; i--) {
      if (timers[i].el == this.el) {
        if (gotoEnd) {
          timers[i](true);
        }
        timers.splice(i, 1);
      }
    }
    this.isTweening = false;
  },

  step: function (gotoEnd) {
    var time = yanNow();
    if (!gotoEnd && time < this.time + this.options.duration) {
      this.cTime = time - this.time;
      this.now = {};
      for (p in this.to) {
        // color fx
        if (isArray(this.to[p])) {
          var color = [], j;
          for (j = 0; j < 3; j++) {
            if (this.from[p] === undefined || this.to[p] === undefined) {
              return false;
            }
            color.push(Math.min(parseInt(this.compute(this.from[p][j], this.to[p][j])), 255));
          }
          this.now[p] = color;
        } else {
          this.now[p] = this.compute(this.from[p], this.to[p]);
          if (this.options.discrete) this.now[p] = intval(this.now[p]);
        }
      }
      this.update();
      return true;
    } else {
      setTimeout(this.options.onComplete.bind(this, this.el), 10);
      this.now = extend(this.to, this.options.orig);
      this.update();
      if (this.options.hide) hide(this.el);
      this.isTweening = false;
      return false;
    }
  },

  compute: function (from, to) {
    var change = to - from;
    return this.options.transition(this.cTime, from, change, this.options.duration);
  },

  update: function () {
    for (var p in this.now) {
      if (isArray(this.now[p])) setStyle(this.el, p, 'rgb(' + this.now[p].join(',') + ')');
      else this.el[p] != undefined ? (this.el[p] = this.now[p]) : setStyle(this.el, p, this.now[p]);
    }
  },

  cur: function (name, force) {
    if (this.el[name] != null && (!this.el.style || this.el.style[name] == null))
      return this.el[name];
    return parseFloat(getStyle(this.el, name, force)) || 0;
  }
};

// Parse strings looking for color tuples [255,255,255]
function getRGB(color) {
  var result;
  if (color && isArray(color) && color.length == 3)
    return color;
  if (result = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(color))
    return [parseInt(result[1]), parseInt(result[2]), parseInt(result[3])];
  if (result = /rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(color))
    return [parseFloat(result[1]) * 2.55, parseFloat(result[2]) * 2.55, parseFloat(result[3]) * 2.55];
  if (result = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(color))
    return [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)];
  if (result = /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(color))
    return [parseInt(result[1] + result[1], 16), parseInt(result[2] + result[2], 16), parseInt(result[3] + result[3], 16)];
}

function getColor(elem, attr) {
  var color;
  do {
    color = getStyle(elem, attr);
    if (!color.indexOf('rgba')) color = '';
    if (color != '' && color != 'transparent' || elem.nodeName.toLowerCase() == 'body') {
      break;
    }
    attr = 'backgroundColor';
  } while (elem = elem.parentNode);
  return getRGB(color);
}

function scrollToY(y, speed, anim, topLink) {
  if (speed == undefined) speed = 400;

  var isTouchDevice = ('ontouchstart' in document.documentElement);
  if (isTouchDevice) {
    speed = 0;
  }

  // Safari workaround
  clearTimeout(cur.scrollFinalTO);
  cur.scrollFinalY = y;
  cur.scrollFinalTO = setTimeout(function () {
    delete cur.scrollFinalY;
  }, speed + 50);

  if (browser.msie6) {
    if (cache(pageNode, 'tween')) cache(pageNode, 'tween').stop(false);
  } else {
    if (cache(bodyNode, 'tween')) cache(bodyNode, 'tween').stop(false);
    if (cache(htmlNode, 'tween')) cache(htmlNode, 'tween').stop(false);
  }
  window.scrollAnimation = false;
  if (speed) {
    var updT = function () {
      window.scrollAnimation = false;
    };
    window.scrollAnimation = true;
    if (browser.msie6) {
      animate(pageNode, {scrollTop: y}, speed, updT);
    } else {
      animate(htmlNode, {
        scrollTop: y,
        transition: Fx.Transitions.easeInCirc
      }, speed, updT);
      animate(bodyNode, {
        scrollTop: y,
        transition: Fx.Transitions.easeInCirc
      }, speed, updT);
    }
  } else {
    if (anim && anim !== 2) {
      var diff = scrollGetY() - y;
      if (Math.abs(diff) > 6) {
        scrollToY(y + (diff > 0 ? 6 : -6), 0, 2);
      }
      clearTimeout(window.scrlToTO);
      window.scrlToTO = setTimeout(scrollToY.pbind(y, 100, 2), 0);
      return;
    }
    window.scroll(scrollGetX(), y);
    if (browser.msie6) {
      pageNode.scrollTop = y;
    }
  }
}

function scrollToTop(speed) {
  return scrollToY(0, speed);
}

function scrollGetX() {
  return window.pageXOffset || scrollNode.scrollLeft || document.documentElement.scrollLeft;
}

function scrollGetY(withFinal) {
  // withFinal - use last value from scrollToY, when available
  if ((withFinal || (browser.safari && withFinal === undefined)) && cur.scrollFinalY !== undefined) {
    return cur.scrollFinalY;
  }
  return window.pageYOffset || scrollNode.scrollTop || document.documentElement.scrollTop;
}

//
// Events
//

var KEY = window.KEY = {
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  DEL: 8,
  TAB: 9,
  RETURN: 13,
  ENTER: 13,
  ESC: 27,
  PAGEUP: 33,
  PAGEDOWN: 34,
  SPACE: 32
};

function addEvent(elem, types, handler, custom, context) {
  elem = ge(elem);
  if (!elem || elem.nodeType == 3 || elem.nodeType == 8) { // 3 - Node.TEXT_NODE, 8 - Node.COMMENT_NODE
    return;
  }

  var realHandler = context ? function () {
    var newHandler = function (e) {
      var prevData = e.data;
      e.data = context;
      var ret = handler.apply(this, [e]);
      e.data = prevData;
      return ret;
    }
    newHandler.handler = handler;
    return newHandler;
  }() : handler;

  // For IE
  if (elem.setInterval && elem != window) elem = window;

  var events = cache(elem, 'events') || cache(elem, 'events', {}),
    handle = cache(elem, 'handle') || cache(elem, 'handle', function () {
        _eventHandle.apply(arguments.callee.elem, arguments);
      });
  // to prevent a memory leak
  handle.elem = elem;

  each(types.split(/\s+/), function (index, type) {
    if (!events[type]) {
      events[type] = [];
      if (!custom && elem.addEventListener) {
        elem.addEventListener(type, handle, false);
      } else if (!custom && elem.attachEvent) {
        elem.attachEvent('on' + type, handle);
      }
    }
    events[type].push(realHandler);
  });

  elem = null;
}
function removeEvent(elem, types, handler) {
  elem = ge(elem);
  if (!elem) return;
  var events = cache(elem, 'events');
  if (!events) return;
  if (typeof (types) != 'string') {
    for (var i in events) {
      removeEvent(elem, i);
    }
    return;
  }

  each(types.split(/\s+/), function (index, type) {
    if (!isArray(events[type])) return;
    var l = events[type].length;
    if (isFunction(handler)) {
      for (var i = l - 1; i >= 0; i--) {
        if (events[type][i] && (events[type][i] === handler || events[type][i].handler === handler)) {
          events[type].splice(i, 1);
          l--;
          break;
        }
      }
    } else {
      for (var i = 0; i < l; i++) {
        delete events[type][i];
      }
      l = 0;
    }
    if (!l) {
      if (elem.removeEventListener) {
        elem.removeEventListener(type, cache(elem, 'handle'), false);
      } else if (elem.detachEvent) {
        elem.detachEvent('on' + type, cache(elem, 'handle'));
      }
      delete events[type];
    }
  });
  if (isEmpty(events)) {
    removeCache(elem, 'events');
    removeCache(elem, 'handle');
  }
}
function triggerEvent(elem, type, ev, now) {
  elem = ge(elem);
  var handle = cache(elem, 'handle');
  if (handle) {
    var f = function () {
      handle.call(elem, extend((ev || {}), {type: type, target: elem}))
    };
    now ? f() : setTimeout(f, 0);
  }
}
function cancelEvent(event) {
  event = (event || window.event);
  if (!event) return false;
  while (event.originalEvent) {
    event = event.originalEvent;
  }
  if (event.preventDefault) event.preventDefault();
  if (event.stopPropagation) event.stopPropagation();
  event.cancelBubble = true;
  event.returnValue = false;
  return false;
}
function _eventHandle(event) {
  event = normEvent(event);

  var handlers = cache(this, 'events');
  if (!handlers || typeof(event.type) != 'string' || !handlers[event.type] || !handlers[event.type].length) {
    return;
  }

  var eventHandlers = (handlers[event.type] || []).slice();
  for (var i in eventHandlers) {
    if (event.type == 'mouseover' || event.type == 'mouseout') {
      var parent = event.relatedElement;
      while (parent && parent != this) {
        try {
          parent = parent.parentNode;
        }
        catch (e) {
          parent = this;
        }
      }
      if (parent == this) {
        continue
      }
    }
    var ret = eventHandlers[i].apply(this, arguments);
    if (ret === false || ret === -1) {
      cancelEvent(event);
    }
    if (ret === -1) {
      return false;
    }
  }
}

function normEvent(event) {
  event = event || window.event;

  var originalEvent = event;
  event = clone(originalEvent);
  event.originalEvent = originalEvent;

  if (!event.target) {
    event.target = event.srcElement || document;
  }

  // check if target is a textnode (safari)
  if (event.target.nodeType == 3) {
    event.target = event.target.parentNode;
  }

  if (!event.relatedTarget && event.fromElement) {
    event.relatedTarget = event.fromElement == event.target;
  }

  if (event.pageX == null && event.clientX != null) {
    var doc = document.documentElement, body = bodyNode;
    event.pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc.clientLeft || 0);
    event.pageY = event.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc.clientTop || 0);
  }

  if (!event.which && ((event.charCode || event.charCode === 0) ? event.charCode : event.keyCode)) {
    event.which = event.charCode || event.keyCode;
  }

  if (!event.metaKey && event.ctrlKey) {
    event.metaKey = event.ctrlKey;
  } else if (!event.ctrlKey && event.metaKey && browser.mac) {
    event.ctrlKey = event.metaKey;
  }

  // click: 1 == left; 2 == middle; 3 == right
  if (!event.which && event.button) {
    event.which = (event.button & 1 ? 1 : ( event.button & 2 ? 3 : ( event.button & 4 ? 2 : 0 ) ));
  }

  return event;
}


var _layerAnim = false;
// Layers
var layers = {
  sh: (!_layerAnim || browser.msie || browser.iphone) ? function (el, done) {
    show(el);
    if (done) done();
  } : function (el, done) {
    fadeIn(el, 200, done);
  },
  hd: (!_layerAnim || browser.msie || browser.iphone) ? function (el, done) {
    hide(el);
    if (done) done();
  } : function (el, done) {
    fadeOut(el, 200, done);
  },
  visible: false,
  _show: function (el, con, opacity, color) {
    setStyle(el, {opacity: opacity || '', backgroundColor: color || ''});
    if (!layers.visible) {
      if (browser.mozilla) {
        window._oldScroll = htmlNode.scrollTop;
        pageNode.style.height = (_oldScroll + lastWindowHeight) + 'px';
        pageNode.style.marginTop = -_oldScroll + 'px';
      } else if (!browser.msie6) {
        (browser.msie7 ? htmlNode : bodyNode).style.overflow = 'hidden';
      }
    }
    layers.visible = true;
    addClass(document.body, 'layers_shown');
    if (con.visibilityHide) {
      removeClass(con, 'box_layer_hidden');
    } else {
      show(con);
    }
    layers.sh(el);
    window.updateWndVScroll && updateWndVScroll();
  },
  _hide: function (el, con) {
    var done = function () {
      if (con && con.visibilityHide) {
        addClass(con, 'box_layer_hidden');
      } else {
        hide(con);
      }
      if (!isVisible(layerWrap) && !cur._inLayer && (!isVisible(boxLayerWrap) || boxLayerWrap.visibilityHide)
        && ((window.mvcur && mvcur.minimized)
        || !isVisible(window.mvLayerWrap))
        && !isVisible(window.wkLayerWrap)) {
        layers.visible = false;
        removeClass(document.body, 'layers_shown');
        if (browser.mozilla) {
          pageNode.style.height = 'auto';
          pageNode.style.marginTop = '0px';
          if (window._oldScroll) {
            htmlNode.scrollTop = _oldScroll;
          }
        } else if (!browser.msie6) {
          (browser.msie7 ? htmlNode : bodyNode).style.overflow = 'auto';
        }
      }
      window.updateWndVScroll && updateWndVScroll();
    };
    layers.hd(el, done);
  }
}, __lq = layerQueue = {
  push: function (onShow) {
    var clayer, last = __lq.count() ? __lq._layers[__lq._layers.length - 1] : false;
    if (cur.pvShown && cur.pvListId != 'temp') {
      clayer = ['photo', cur.pvData[cur.pvListId][cur.pvIndex].id, cur.pvListId, {
        onHide: cur.pvOptions.onHide,
        scroll: layerWrap.scrollTop,
        onShow: onShow,
        noHistory: !!cur.pvNoHistory,
        histLen: cur.pvHistoryLength
      }];
    } else if (window.mvcur && mvcur.mvShown && !mvcur.minimized) {
      var opts = {
        scroll: mvLayerWrap.scrollTop,
        noHistory: !!mvcur.noHistory,
        nomin: true,
        prevLoc: mvcur.mvPrevLoc
      };
      if (window.Videocat && Videocat.getCurrentPlaylistId()) {
        opts = extend(opts, {
          playlistId: Videocat.getCurrentPlaylistId(),
          module: Videocat.VIDEO_MODULE,
          addParams: {force_no_repeat: 1, show_next: 1},
        });
      }
      clayer = ['video', mvcur.videoRaw, mvcur.listId, opts];
    } else if (window.wkcur && wkcur.shown) {
      clayer = ['wiki', wkcur.wkRaw, false, {
        toScroll: wkLayerWrap.scrollTop,
        prevLoc: wkcur.prevLoc,
        myLoc: wkcur.myLoc
      }];
    } else {
      return false;
    }
    if (!last || clayer[0] != last[0] || clayer[1] != last[1] || clayer[2] != last[2]) {
      __lq._layers.push(clayer);
    }
    __lq.skipVideo = false;
    return true;
  },
  noHistory: function () {
    for (var a = __lq._layers, i = a.length; i > 0; --i) {
      if (a[i - 1][0] == 'photo') {
        a[i - 1][3].noHistory = 1;
      } else if (a[i - 1][0] == 'video') {
        a[i - 1][3].noHistory = 1;
      }
    }
  },
  hide: function () {
    __lq._bl = true;
    if (window.WkView && layers.fullhide == WkView.hide) {
      debugLog('hiding only wkLayerWrap');
      hide(wkLayerWrap);
      clearTimeout(wkcur.showT);
    } else {
      debugLog('hiding full in layerQueue.hide');
      if (layers.fullhide) layers.fullhide(true, true);
    }
    setTimeout(layerQueue.unblock, 5);
  },
  unblock: function () {
    __lq._bl = false;
  },
  pop: function () {
    if (!__lq.count() || __lq._bl) return;
    debugLog('popping..');
    __lq._layers.pop();
  },
  back: function (type, id, type2, id2) {
    debugLog('pop from back');
    for (var a = __lq._layers, i = a.length; i > 0; --i) {
      if ((a[i - 1][0] == type && a[i - 1][1] == id) || (a[i - 1][0] == type2 && a[i - 1][1] == id2)) {
        __lq._layers = a.slice(0, i);
        __lq.pop();
        return true;
      }
    }
    debugLog('not found: ' + type + ' ' + id + ' ' + type2 + ' ' + id2);
    return false;
  },
  count: function () {
    return __lq._layers.length;
  },
  clear: function () {
    debugLog('clearing..');
    __lq._layers = [];
  },
  _layers: []
};


function onCtrlEnter(ev, handler) {
  ev = ev || window.event;
  if (ev.keyCode == 10 || ev.keyCode == 13 && (ev.ctrlKey || ev.metaKey && browser.mac)) {
    handler();
    cancelEvent(ev);
  }
}
function onEnter(ev, handler) {
  ev = ev || window.event;
  if (ev.keyCode == 13) {
    handler();
    cancelEvent(ev);
  }
}

function setFavIcon(href, force) {
  if (!window.icoNode) return;
  if (icoNode.href == href && !force) return;
  var ico = ce('link', {
    rel: 'shortcut icon',
    type: 'image/gif',
    href: href + '?' + ((stVersions || {}).favicon || '')
  });
  headNode.replaceChild(ico, icoNode);
  icoNode = ico;
}

var layoutWidth = 980;
function domStarted() {
  window.headNode = geByTag1('head');

  extend(window, {
    icoNode: geByTag1('link', headNode),
    bodyNode: geByTag1('body'),
    htmlNode: geByTag1('html'),
    utilsNode: ge('utils')
  });
  //bodyNode.onresize = onBodyResize.pbind(false);
  if (!utilsNode) return;

  var l = ge('layer_bg'),
    lw = ge('layer_wrap'),
    bl = ge('box_layer_bg'),
    blw = ge('box_layer_wrap');

  extend(window, {
    layerBG: l,
    boxLayerBG: bl,
    layerWrap: lw,
    layer: domFC(lw),
    boxLayerWrap: blw,
    boxLayer: domFC(blw),
    boxLoader: domFC(domFC(blw))
  });

  if (browser.mozilla) {
    addClass(bodyNode, 'firefox');
  } else if (browser.msie6) {
    addClass(bodyNode, 'nofixed');
  } else if (browser.mobile) {
    addClass(bodyNode, 'mobfixed');
  }

  //addEvent(boxLayerWrap, 'click', __bq.hideLastCheck);

  extend(layers, {
    show: layers._show.pbind(l, lw),
    boxshow: layers._show.pbind(bl, blw),
    wrapshow: layers._show.pbind(l),
    hide: layers._hide.pbind(l, lw),
    boxhide: layers._hide.pbind(bl, blw),
    wraphide: layers._hide.pbind(l)
  });

  // fix bug: remove fire event if open page (safari)
  if (!window.addEventListener)
    return;
  var blockPopstateEvent = document.readyState != "complete";
  window.addEventListener("load", function () {
    // The timeout ensures that popstate-events will be unblocked right
    // after the load event occured, but not in the same event-loop cycle.
    setTimeout(function () {
      blockPopstateEvent = false;
    }, 0);
  }, false);
  window.addEventListener("popstate", function (evt) {
    if (blockPopstateEvent && document.readyState == "complete") {
      evt.preventDefault();
      evt.stopImmediatePropagation();
    }
  }, false);
  // end fix bug
}

yan.started = yanNow();
function domReady() {
  if (!utilsNode) return;

  extend(window, {
    pageNode: ge('page_wrap')
  });

  window.scrollNode = browser.msie6 ? pageNode : ((browser.chrome || browser.safari) ? bodyNode : htmlNode);

  onBodyResize();

  var dt = Math.max(yanNow() - yan.started, 10), speed = intval((yan.contlen || 1) / dt * 1000);
  if (browser.mozilla && browser.version >= 4) {
    speed /= 2.5;
  } else if (browser.mozilla) {
    speed *= 1.5;
  } else if (browser.msie && browser.version >= 7) {
    speed /= 1.5;
  } else if (browser.msie) {
    speed *= 2.5;
  }

  //var scrolledNode = browser.msie6 ? pageNode : window;
  //addEvent(scrolledNode, 'scroll', function(){});

  window.debuglogInit && debuglogInit();
}

function serializeForm(elem) {
  var form = ge(elem);
  if (typeof(form) != 'object') {
    return false;
  }
  var result = {};
  var g = function (n) {
    return geByTag(n, form);
  };
  var nv = function (i, e) {
    if (!e.name) return;
    if (e.type == 'text' || !e.type) {
      result[e.name] = val(e);
    }
    else if (e.type == 'checkbox') {
      result[e.name] = e.checked
    } else {
      result[e.name] = (browser.msie && !e.value && form[e.name]) ? form[e.name].value : e.value;
    }
  };
  each(g('input'), function (i, e) {
    if (e.type == "radio") {
      if (e.checked) {
        return nv(i, e)
      } else {
        return
      }
    }
    return nv(i, e);
  });
  each(g('select'), nv);
  each(g('textarea'), nv);

  return result;
}

function ajx2q(qa) {
  var query = [], enc = function (str) {
    if (window._decodeEr && _decodeEr[str]) {
      return str;
    }
    try {
      return encodeURIComponent(str);
    } catch (e) {
      return str;
    }
  };

  for (var key in qa) {
    if (qa[key] == null || isFunction(qa[key])) continue;
    if (isArray(qa[key])) {
      for (var i = 0, c = 0, l = qa[key].length; i < l; ++i) {
        if (qa[key][i] == null || isFunction(qa[key][i])) {
          continue;
        }
        query.push(enc(key) + '[' + c + ']=' + enc(qa[key][i]));
        ++c;
      }
    } else {
      query.push(enc(key) + '=' + enc(qa[key]));
    }
  }
  query.sort();
  return query.join('&');
}
function q2ajx(qa) {
  if (!qa) return {};
  var query = {}, dec = function (str) {
    try {
      return decodeURIComponent(str);
    } catch (e) {
      window._decodeEr = window._decodeEr || {};
      _decodeEr[str] = 1;
      return str;
    }
  };
  qa = qa.split('&');
  each(qa, function (i, a) {
    var t = a.split('=');
    if (t[0]) {
      var v = dec(t[1] + '');
      if (t[0].substr(t.length - 2) == '[]') {
        var k = dec(t[0].substr(0, t.length - 2));
        if (!query[k]) {
          query[k] = [];
        }
        query[k].push(v);
      } else {
        query[dec(t[0])] = v;
      }
    }
  });
  return query;
}

function getQueryVar(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  }
  return (false);
}

function getQueryVars() {
  var query = window.location.search.substring(1),
    vars = query.split("&"),
    params = {};
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    params[pair[0]] = pair[1]
  }
  return params;
}

function Buffer(handler) {
  var queue = [];

  function run() {
    var callback = function () {
      // when the handler says it's finished (i.e. runs the callback)
      // We check for more tasks in the queue and if there are any we run again
      if (queue.length > 0) {
        run();
      }
    };
    // give the first item in the queue & the callback to the handler
    handler(queue.shift(), callback);
  }

  // push the task to the queue. If the queue was empty before the task was pushed
  // we run the task.
  this.append = function (task) {
    queue.push(task);
    if (queue.length === 1) {
      run();
    }
  }
}
function Ajax_process() {
  var process = [];

  return {
    append: function (xhr) {
      process.push(xhr)
    },
    abort_all: function () {
      each(process, function (i, xhr) {
        xhr.abort();
      })
      process = [];
    }
  }
}
var ajax_process = new Ajax_process();

var ajax = {
  req: function (args) {
    var _ref, _ref1, _ref10, _ref11, _ref12, _ref13,
      _ref15, _ref16, _ref2, _ref3, _ref4, _ref5,
      _ref6, _ref7, _ref8, _ref9;

    // default headers
    var headers = {'Content-type': 'application/json; charset=utf-8'};
    if (yan.csrftoken && yan.csrftoken.length) {
      headers['X-CSRFToken'] = yan.csrftoken
    }

    if (args.method == "patch") {
      // Fix bug for nginx or browser. Patch doesn't work.
      headers['X-HTTP-Method-Override'] = 'PATCH';
      args.method = "post"
    }

    // Parse args
    var opts = {
      url: (_ref = args.url) != null ? _ref : null,
      method: (_ref1 = args.method) != null ? _ref1 : 'GET',
      json: (_ref2 = args.json) != null ? _ref2 : true,
      body: (_ref3 = args.body) != null ? _ref3 : null,
      mime: (_ref4 = args.mime) != null ? _ref4 : null,
      timeout: (_ref5 = args.timeout) != null ? _ref5 : 0,
      headers: (_ref6 = args.headers) != null ? _ref6 : headers,
      username: (_ref7 = args.username) != null ? _ref7 : null,
      password: (_ref8 = args.password) != null ? _ref8 : null,
      async: (_ref9 = args.async) != null ? _ref9 : true,
      queue: (_ref16 = args.queue) != null ? _ref16 : true,
      done: (_ref10 = args.done) != null ? _ref10 : null,
      loadstart: (_ref11 = args.loadstart) != null ? _ref11 : null,
      progress: (_ref12 = args.progress) != null ? _ref12 : null,
      loadend: (_ref13 = args.loadend) != null ? _ref13 : null
    };

    // Add to Queue or run async (between ajax calls)
    if (_ref16) {
      ajax_buffer.append(opts);
    } else {
      ajax.run(opts);
    }
  },
  run: function (opts, callback) {
    callback = callback ? callback : null;
    if (callback) ajax_process.abort_all();

    var xhr = new XMLHttpRequest;
    var key, onload, onprogress, val, _ref14;

    onload = function (thisArg, options) {
      if (callback) {
        // call the buffer callback
        callback();
      }

      var response = {
        text: thisArg.responseText,
        status: thisArg.status,
        headers: (function (thisArg) {
          var headers;
          headers = {};
          thisArg.getAllResponseHeaders().split('\n').filter(function (header) {
            return header !== '';
          }).map(function (header) {
            return header.split(':');
          }).forEach(function (splitHeaders, idx, arr) {
            if (splitHeaders.length > 1) {
              return headers[splitHeaders[0].trim()] = splitHeaders[1].trim();
            }
          });
          return headers;
        })(thisArg)
      };
      if (((response.headers['Content-Type'] != null) && response.headers['Content-Type'] === 'application/json') || options.json) {
        response.json = parseJSON(response.text);
      }
      return options.done(null, response);
    };
    onprogress = function (chunk, options) {
      return typeof options.progress === "function" ? options.progress({
        percent: parseFloat(chunk.loaded) / parseFloat(chunk.total) * 100.0,
        loaded: chunk.loaded,
        total: chunk.total,
        timestamp: chunk.timeStamp
      }) : void 0;
    };

    if (typeof opts.done === 'function') {
      var handlerLoad = function (e) {
        removeEvent(xhr, 'load', handlerLoad);
        return onload(this, opts);
      };
      var handlerTimeout = function (e) {
        removeEvent(xhr, 'timeout', handlerTimeout);
        return opts.done({
          timeout: true
        }, null);
      };
      var handlerAbort = function (e) {
        removeEvent(xhr, 'abort', handlerAbort);
        return opts.done({
          abort: true
        }, null);
      };
      var handlerError = function (e) {
        removeEvent(xhr, 'error', handlerError);
        return opts.done({
          error: true
        }, null);
      };
      var handlerLoadStart = function (e) {
        removeEvent(xhr, 'loadstart', handlerLoadStart);
        return typeof opts.loadstart === "function" ? opts.loadstart(e) : void 0;
      };
      var handlerOnprogress = function (e) {
        if (e.lengthComputable) {
          if (e.loaded === e.total) {
            removeEvent(xhr.upload, 'progress', handlerOnprogress);
          }
          return onprogress(e, opts);
        }
      };
      var handlerLoadEnd = function (e) {
        removeEvent(xhr, 'loadend', handlerLoadEnd);
        return typeof opts.loadend === "function" ? opts.loadend(e) : void 0;
      };

      addEvent(xhr, 'load', handlerLoad);
      addEvent(xhr, 'timeout', handlerTimeout);
      addEvent(xhr, 'abort', handlerAbort);
      addEvent(xhr, 'error', handlerError);
      addEvent(xhr, 'loadstart', handlerLoadStart);

      if (!browser.chrome_mobile) {
        addEvent(xhr.upload, 'progress', handlerOnprogress);
      } else {
        typeof opts.progress === "function" ? opts.progress({
          percent: 100.0,
          loaded: 100,
          total: 100,
          incorect: true
        }) : void 0;
      }
      addEvent(xhr, 'loadend', handlerLoadEnd);

      if (opts.url) {
        if (opts.username && opts.password) {
          xhr.open(opts.method, opts.url, opts.async, opts.username, opts.password);
        } else {
          xhr.open(opts.method, opts.url, opts.async);
        }
        if (opts.timeout > 0 && opts.async) {
          xhr.timeout = opts.timeout;
        }
        if (opts.headers !== null) {
          _ref14 = opts.headers;
          for (key in _ref14) {
            val = _ref14[key];
            xhr.setRequestHeader(key, val);
          }
        }
        if (opts.mime !== null) {
          xhr.overrideMimeType(opts.mime);
        }

        ajax_process.append(xhr)

        return xhr.send(opts.body);
      } else {
        throw '[Ajax] `url` is undefined.';
      }
    } else {
      throw '[Ajax] `done` handler is undefined.';
    }
  }
};
var ajax_buffer = new Buffer(ajax.run);


function checkEvent(e) {
  return ((e = (e || window.event)) && (e.type == 'click' || e.type == 'mousedown' || e.type == 'mouseup') && (e.which > 1 || e.button > 1 || e.ctrlKey || e.shiftKey || browser.mac && e.metaKey)) || false;
}

function checkOver(e, target) {
  if (!e) return true;
  e = e.originalEvent || e;
  target = target || e.target;
  var related = e.fromElement || e.relatedTarget;
  if (!related || related == target || related == target.parentNode) {
    return true;
  }
  while (related != target && related.parentNode && related.parentNode != bodyNode) {
    related = related.parentNode;
  }
  return (related != target);
}

function processDestroy(c) {
  if (!c.destroy || !c.destroy.length) return;
  for (var i in c.destroy) {
    try {
      c.destroy[i](c);
    } catch (e) {
      try {
        console.log(e.stack);
      } catch (e2) {
      }
    }
  }
}

//
// Cookies

getCookie =  function(name) {
  var nameEQ = name + "=",
    ca = document.cookie.split(';'),
    value = '',
    firstChar = '',
    parsed={};
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      value = decodeURIComponent(c.substring(nameEQ.length, c.length));
      firstChar = value.substring(0, 1);
      if(firstChar=="{"){
        try {
          parsed = JSON.parse(value);
          if("v" in parsed) return parsed.v;
        } catch(e) {
          return value;
        }
      }
      if (value=="undefined") return undefined;
      return value;
    }
  }
  return null;
};
setCookie = function(name, value, days, path, secure) {
  var date = new Date(),
    expires = '',
    type = typeof(value),
    valueToUse = '',
    secureFlag = '';
  path = path || "/";
  if (days) {
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  if (type === "object"  && type !== "undefined") {
    if(!("JSON" in window)) throw "Bummer, your browser doesn't support JSON parsing.";
    valueToUse = encodeURIComponent(JSON.stringify({v:value}));
  } else {
    valueToUse = encodeURIComponent(value);
  }
  if (secure){
    secureFlag = "; secure";
  }

  document.cookie = name + "=" + valueToUse + expires + "; path=" + path + secureFlag;
};

removeCookie = function (name) {
  setCookie(name, "", -1);
};


//Time offset stuff

if (yan.time && !browser.opera_mobile) setTimeout(function () {
  var t = new Date(), time = [0, t.getMonth() + 1, t.getDate(), t.getHours(), t.getMinutes()];
  if (time[1] == 1 && yan.time[1] == 12) {
    yan.time[1] = 0;
  } else if (time[1] == 12 && yan.time[1] == 1) {
    time[1] = 0;
  } else if (time[1] > yan.time[1] + 1 || yan.time[1] > time[1] + 1) {
    time[1] = yan.time[1] = time[2] = yan.time[2] = 0;
  }
  if (time[1] > yan.time[1] && time[2] == 1) {
    if (yan.time[2] == 31 || (yan.time[1] == 4 || yan.time[1] == 6 || yan.time[1] == 9 || yan.time[1] == 11) && yan.time[2] == 30 || yan.time[1] == 2 && (yan.time[2] == 29 || yan.time[2] == 28 && (yan.time[0] % 4))) {
      yan.time[2] = 0;
    } else {
      yan.time[2] = time[2] = 0;
    }
  } else if (yan.time[1] > time[1] && yan.time[2] == 1) {
    if (time[2] == 31 || (time[1] == 4 || time[1] == 6 || time[1] == 9 || time[1] == 11) && time[2] == 30 || time[1] == 2 && (time[2] == 29 || time[2] == 28 && (yan.time[0] % 4))) {
      time[2] = 0;
    } else {
      time[2] = yan.time[2] = 0;
    }
  }
  if (time[2] > yan.time[2] + 1 || yan.time[2] > time[2] + 1) {
    time[2] = yan.time[2] = 0;
  }

  var realDt = (((time[2] - yan.time[2]) * 24 + (time[3] - yan.time[3])) * 60 + (time[4] - yan.time[4])) * 60;
  if (realDt < -15.5 * 3600) {
    realDt += 24 * 3600;
  } else if (realDt > 10.5 * 3600) {
    realDt -= 24 * 3600;
  }
  var finalDt = 0, minDt = Math.abs(realDt), dts = [-12, -11, -10, -9, -8, -7, -6, -5, -4.5, -4, -3.5, -3, -2.5, -2, -1, 0, 1, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 5.75, 6, 6.5, 7, 8, 8.5, 9, 9.5, 10, 11, 12, 13];
  for (var i in dts) {
    var dt = Math.round((dts[i] - 3) * 3600), checkDt = Math.abs(realDt - dt);
    if (checkDt < minDt) {
      minDt = checkDt;
      finalDt = dt;
    }
  }
  yan.dt = finalDt;
  if (getCookie('remixdt') != yan.dt) {
    setCookie('remixdt', yan.dt, 365);
  }
  var rtc = intval(getCookie('remixrt'));
  if (window.devicePixelRatio >= 2 && !browser.iphone) {
    if (!(rtc & 1)) {
      setCookie('remixrt', rtc | 1, 365);
      window._retinaInit = function () {
        stManager.add(['retina.css']);
        addClass(document.body, 'is_2x');
      };
      if (window._initedCheck) {
        window._retinaInit();
      }
    }
  } else {
    if (rtc & 1) {
      setCookie('remixrt', rtc ^ 1, 365);
    }
  }
}, 0);

//
// Other stuff
//

function parseLatin(text) {
  var outtext = text;
  var lat1 = ['yo', 'zh', 'kh', 'ts', 'ch', 'sch', 'shch', 'sh', 'eh', 'yu', 'ya', 'YO', 'ZH', 'KH', 'TS', 'CH', 'SCH', 'SHCH', 'SH', 'EH', 'YU', 'YA', "'"];
  var rus1 = ['ё', 'ж', 'х', 'ц', 'ч', 'щ', 'щ', 'ш', 'э', 'ю', 'я', 'Ё', 'Ж', 'Х', 'Ц', 'Ч', 'Щ', 'Щ', 'Ш', 'Э', 'Ю', 'Я', 'ь'];
  for (var i = 0, l = lat1.length; i < l; i++) {
    outtext = outtext.split(lat1[i]).join(rus1[i]);
  }
  var lat2 = 'abvgdezijklmnoprstufhcyABVGDEZIJKLMNOPRSTUFHCYёЁ';
  var rus2 = 'абвгдезийклмнопрстуфхцыАБВГДЕЗИЙКЛМНОПРСТУФХЦЫеЕ';
  for (var i = 0, l = lat2.length; i < l; i++) {
    outtext = outtext.split(lat2.charAt(i)).join(rus2.charAt(i));
  }
  return (outtext == text) ? null : outtext;
}

function txaAutoSize(el) {
  if (browser.mozilla) {
    return
  }

  function fn() {
    var diff, height;
    height = el.offsetHeight;
    diff = parseInt(getStyle(el, "border-bottom"));
    if (trim(val(el)).length) {
      var currentScrollPosition = scrollGetY();
      setStyle(el, "height", 0);
      setStyle(el, "height", el.scrollHeight + diff + "px");
      scrollToY(currentScrollPosition, 0);
    } else if (el.hasAttribute("placeholder")) {
      var test_el = ce("div", {
        innerHTML: el.getAttribute("placeholder")
      }, {
        "padding": getStyle(el, "padding"),
        "font-size": getStyle(el, "font-size"),
        "font-weight": getStyle(el, "font-weight"),
        "font-family": getStyle(el, "font-family"),
        "line-height": getStyle(el, "line-height"),
        "width": el.offsetWidth,
        "visibility": "hidden",
        "left": "-9999px",
        "position": "absolute"
      });
      append(utilsNode, test_el);
      setStyle(el, "height", test_el.offsetHeight + "px");
      re(test_el);
    }
  }

  fn();

  addEvent(el, "input keyup", fn);
  addEvent(window, "resize", fn);
  cur.destroy.push(function () {
    removeEvent(el, "input keyup", fn);
    removeEvent(window, "resize", fn);
  });
}

function formatPhone(phonenum, simpleOut) {
  phonenum = phonenum.replace(/[^\+0-9]/gi, '')
  var regexObj = /^(?:\+?7?8?[-. ]?)?(?:\(?([0-9]{3})\)?[-. ]?)?([0-9]{3})[-. ]?([0-9]{2})([0-9]{2})$/;
  if (regexObj.test(phonenum)) {
    var parts = phonenum.match(regexObj);
    var phone = "";
    if (simpleOut) {
      if (parts[1]) {
        phone += "7" + parts[1];
      }
      phone += parts[2] + parts[3] + parts[4];
      return phone
    }
    if (parts[1]) {
      phone += "+7 (" + parts[1] + ") ";
    }
    phone += parts[2] + "-" + parts[3] + "-" + parts[4];
    return phone;
  }
  else {
    //invalid phone number
    return phonenum;
  }
}

function pluralize(number, titles) {
  var cases = [2, 0, 1, 1, 1, 2];
  return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
}

function placeholderSetup(id, opts) {
  var el = ge(id);
  var ph;
  var o = opts ? clone(opts) : {};
  if (!el || (el.phevents && !o.reload) || !(ph = (el.getAttribute('placeholder') || el.placeholder))) {
    return;
  }

  el.removeAttribute('placeholder');

  var pad = {};
  var dirs = ['Top', 'Bottom', 'Left', 'Right'];
  if (o.pad) {
    pad = o.pad;
  } else {
    if (o.fast) {
      for (var i = 0; i < 4; ++i) {
        pad['padding' + dirs[i]] = 3;
        pad['margin' + dirs[i]] = 0;
      }
      extend(pad, o.styles || {});
    } else {
      var prop = [];
      for (var i = 0; i < 4; ++i) {
        prop.push('margin' + dirs[i]);
        prop.push('padding' + dirs[i]);
      }
      pad = getStyle(el, prop);
    }
    for (var i = 0; i < 4; ++i) { // add border 1px
      var key = 'margin' + dirs[i];
      pad[key] = (intval(pad[key]) + 1) + 'px';
    }
  }

  if (o.reload) {
    var prel = el.previousSibling;
    if (prel && hasClass(prel, 'input_back_wrap')) rmEl(prel);
  }
  var b1 = el.phcont = el.parentNode.insertBefore(ce('div', {
    className: 'input_back_wrap no_select',
    innerHTML: '<div class="input_back"><div class="input_back_content' + (o.big ? ' big' : '') + '" style="width: ' + (getSize(el)[0] - 20) + 'px;">' + ph + '</div></div>'
  }), el);
  var b = domFC(b1);
  var c = domFC(b);
  setStyle(b, pad);

  var cv = __phCheck.pbind(el, o.back, o.editable), checkValue = browser.mobile ? cv : function (f, b) {
    setTimeout(cv.pbind(f, b), 0);
  };

  if (browser.msie && browser.version < 8) {
    setStyle(b, {marginTop: 1});
  }
  el.phonfocus = function (hid) {
    el.focused = true;
    cur.__focused = el;
    if (hid === true) {
      setStyle(el, {backgroundColor: '#FFF'});
      hide(b);
    }
    checkValue(true, false);
  };
  el.phonblur = function () {
    cur.__focused = el.focused = false;
    show(b);
    checkValue(false, true);
  };
  el.phshown = true, el.phanim = null;

  if (el.value || (o.editable && ((el.textContent !== undefined ? el.textContent : el.innerText) || geByTag('img', el).length))) {
    el.phshown = false;
    hide(b1);
  }

  if (!browser.opera_mobile) {
    addEvent(b1, 'focus click', function (ev) {
      if (o.editableFocus) {
        setTimeout(o.editableFocus.pbind(el), 0);
        el.phonfocus();
      } else {
        el.blur();
        el.focus();
      }
    });
    addEvent(el, 'focus' + (o.editable ? ' click' : ''), el.phonfocus);
    addEvent(el, 'keydown paste cut input', checkValue);
  }
  addEvent(el, 'blur', el.phonblur);
  el.check = checkValue;

  el.getValue = function () {
    return o.editable ? el.innerHTML : el.value;
  };
  el.setValue = function (v) {
    if (o.editable) {
      el.innerHTML = v;
    } else {
      el.value = v;
    }
    __phCheck(el, o.back, o.editable);
  };
  el.phevents = true;
  el.phonsize = function () {
  };

  if (o.global) return;

  if (!o.reload) {
    if (!cur.__phinputs) {
      cur.__phinputs = [];
      cur.destroy.push(function () {
        for (var i = 0, l = cur.__phinputs.length; i < l; ++i) {
          removeCache(cur.__phinputs[i]);
        }
      });
    }
    cur.__phinputs.push(el);
  }
}

function val(input, value, nofire) {
  input = ge(input);
  if (!input) return;

  if (value !== undefined) {
    if (input.setValue) {
      input.setValue(value);
      !nofire && input.phonblur && input.phonblur();
    } else if (input.tagName == 'INPUT' || input.tagName == 'TEXTAREA') {
      input.value = value
    } else {
      input.innerHTML = value
    }
  }
  return input.getValue ? input.getValue() :
    (((input.tagName == 'INPUT' || input.tagName == 'TEXTAREA') ? input.value : input.innerHTML) || '');
}

function elfocus(el, from, to) {
  el = ge(el);
  try {
    el.focus();
    if (from === undefined || from === false) from = el.value.length;
    if (to === undefined || to === false) to = from;
    if (el.createTextRange) {
      var range = el.createTextRange();
      range.collapse(true);
      range.moveEnd('character', to);
      range.moveStart('character', from);
      range.select();
    } else if (el.setSelectionRange) {
      el.setSelectionRange(from, to);
    }
  } catch (e) {
  }
}

function guid() {
  var lut = [];
  for (var i = 0; i < 256; i++) {
    lut[i] = (i < 16 ? '0' : '') + (i).toString(16);
  }
  return function e7() {
    var d0 = Math.random() * 0xffffffff | 0;
    var d1 = Math.random() * 0xffffffff | 0;
    var d2 = Math.random() * 0xffffffff | 0;
    var d3 = Math.random() * 0xffffffff | 0;
    return lut[d0 & 0xff] + lut[d0 >> 8 & 0xff] + lut[d0 >> 16 & 0xff] + lut[d0 >> 24 & 0xff] + '-' +
      lut[d1 & 0xff] + lut[d1 >> 8 & 0xff] + '-' + lut[d1 >> 16 & 0x0f | 0x40] + lut[d1 >> 24 & 0xff] + '-' +
      lut[d2 & 0x3f | 0x80] + lut[d2 >> 8 & 0xff] + '-' + lut[d2 >> 16 & 0xff] + lut[d2 >> 24 & 0xff] +
      lut[d3 & 0xff] + lut[d3 >> 8 & 0xff] + lut[d3 >> 16 & 0xff] + lut[d3 >> 24 & 0xff];
  }()
}

function simpleGuid() {
  return Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
}


// Message box
var _message_box_guid = 0, _message_boxes = [];

var __bq = boxQueue = {
  hideAll: function () {
    if (__bq.count()) {
      var box = _message_boxes[__bq._boxes.pop()];
      box._in_queue = false;
      box._hide();
    }
    while (__bq.count()) {
      var box = _message_boxes[__bq._boxes.pop()];
      box._in_queue = false;
    }
  },
  hideLast: function (check, e) {
    if (__bq.count()) {
      var box = _message_boxes[__bq._boxes[__bq.count() - 1]];
      if (check === true && (box.changed || __bq.skip || e && e.target && e.target.tagName && e.target.tagName.toLowerCase() != 'input' && cur.__mdEvent && e.target != cur.__mdEvent.target)) {
        __bq.skip = false;
        return;
      }
      box.hide();
    }
    if (e && e.type == 'click') return cancelEvent(e);
  },
  hideBGClick: function (e) {
    if (e && e.target && /^box_layer/.test(e.target.id)) {
      __bq.hideLast();
    }
  },
  count: function () {
    return __bq._boxes.length;
  },
  _show: function (guid) {
    var box = _message_boxes[guid];
    if (!box || box._in_queue) return;
    if (__bq.count()) {
      _message_boxes[__bq._boxes[__bq.count() - 1]]._hide(true, true);
    } else if (window.tooltips) {
      tooltips.hideAll();
    }
    box._in_queue = true;
    var notFirst = __bq.count() ? true : false;
    __bq.curBox = guid;
    box._show(notFirst || __bq.currHiding, notFirst);
    __bq._boxes.push(guid);
  },
  _hide: function (guid) {
    var box = _message_boxes[guid];
    if (!box || !box._in_queue || __bq._boxes[__bq.count() - 1] != guid || !box.isVisible()) return;
    box._in_queue = false;
    __bq._boxes.pop();
    box._hide(__bq.count() ? true : false);
    if (__bq.count()) {
      var prev_guid = __bq._boxes[__bq.count() - 1];
      __bq.curBox = prev_guid;
      _message_boxes[prev_guid]._show(true, true, true);
    }
  },
  _boxes: [],
  curBox: 0
};

__bq.hideLastCheck = __bq.hideLast.pbind(true);
function curBox() {
  var b = _message_boxes[__bq.curBox];
  return (b && b.isVisible()) ? b : null;
}

if (!browser.mobile) {
  addEvent(document, 'keydown', function (e) {
    _wf = 1;
    if (e.keyCode == KEY.ESC && __bq.count() && !cur._noEscHide) {
      __bq.hideLast();
      return -1;
    }
  });
}

function boxRefreshCoords(cont) {
  var height = window.innerHeight ? window.innerHeight : (document.documentElement.clientHeight ? document.documentElement.clientHeight : boxLayerBG.offsetHeight);
  var top = browser.mobile ? intval(window.pageYOffset) : 0;
  containerSize = getSize(cont);
  cont.style.marginTop = Math.max(10, top + (height - containerSize[1]) / 3) + 'px';
}

function MessageBox(options, dark) {
  var defaults = {
    title: false,
    width: 410,
    height: 'auto',
    shadow: 3,
    animSpeed: 0,
    bodyStyle: '',
    dark: false,
    selfDestruct: true,
    progress: false,
    hideOnBGClick: true,
    hideButtons: false,
    onShow: false,
    onHideAttempt: false,
    onBeforeHide: false,
    onHide: false,
    onClean: false,
    onDestroy: false
  };

  options = extend(defaults, options);
  if (dark) {
    options.dark = 1;
  }

  var buttonsCount = 0,
    boxContainer, boxBG, boxLayout;
  var boxTitleWrap, boxTitle, boxCloseButton, boxBody;
  var boxControlsWrap, boxControls, boxButtons, boxProgress, boxControlsText;
  var guid = _message_box_guid++, visible = false;

  if (!options.progress) options.progress = 'box_progress' + guid;

  var controlsStyle = options.hideButtons ? ' style="display: none"' : '';
  boxContainer = ce('div', {
    className: 'popup_box_container' + (options.dark ? ' box_dark' : '') + (options.shadow ? ' __shadow-' + options.shadow : ''),
    innerHTML: '\
            <div class="box_layout" onclick="__bq.skip=true;">\
            <div class="box_title_wrap"><div class="box_x_button">✖' + (options.dark ? 'Закрыть' : '') + '</div><div class="box_title"></div></div>\
            <div class="box_body" style="' + options.bodyStyle + '"></div>\
            <div class="box_controls_wrap"' + controlsStyle + '><div class="box_controls">\
            <div class="box_controls_btns"></div>\
            <div class="progress" id="' + options.progress + '"></div>\
            <div class="box_controls_text"></div>\
            </div></div>\
            </div>'
  }, {
    display: 'none'
  });
  hide(boxContainer);

  boxLayout = domFC(boxContainer);

  boxTitleWrap = domFC(boxLayout);
  boxCloseButton = domFC(boxTitleWrap);
  boxTitle = domNS(boxCloseButton);

  if (options.noCloseButton) hide(boxCloseButton);

  boxBody = domNS(boxTitleWrap);

  boxControlsWrap = domNS(boxBody);
  boxControls = domFC(boxControlsWrap);
  boxButtons = domFC(boxControls);
  boxProgress = domNS(boxButtons);
  boxControlsText = domNS(boxProgress);

  boxLayer.appendChild(boxContainer);

  refreshBox();
  boxRefreshCoords(boxContainer);

  // Refresh box properties
  function refreshBox() {
    // Set title
    if (options.title) {
      boxTitle.innerHTML = options.title;
      removeClass(boxBody, 'box_no_title');
      show(boxTitleWrap);
    } else {
      addClass(boxBody, 'box_no_title');
      hide(boxTitleWrap);
    }

    // Set box dimensions
    boxContainer.style.width = typeof(options.width) == 'string' ? options.width : options.width + 'px';
    boxContainer.style.height = typeof(options.height) == 'string' ? options.height : options.height + 'px';
  }

  // Add button
  function addButton(label, onclick, type) {
    if (options.dark && type == 'no' && !options.forceNoBtn) {
      return false;
    }
    ++buttonsCount;
    var btnClass = 'btn __sm';
    if (type != 'no' && type != 'gray') {
      btnClass += ' __primary';
    }
    var buttonWrap = ce('button', {
      className: btnClass,
      innerHTML: label
    });
    boxButtons.appendChild(buttonWrap);
    createBtn(buttonWrap, onclick);
    return buttonWrap;
  }

  // Add custom controls text
  function setControlsText(text) {
    boxControlsText.innerHTML = text;
  }

  // Remove buttons
  function removeButtons() {
    var btns = boxButtons.children;
    var c = 5;
    //while (boxButtons.children.length) {
    while (c > 1) {
      cleanElems(btns[0]);
      re(btns[0]);
      c -= 1;
    }
  }

  var destroyMe = function () {
    if (isFunction(options.onClean)) options.onClean();
    if (isFunction(options.onDestroy)) options.onDestroy();
    removeButtons();
    cleanElems(boxContainer, boxCloseButton, boxTitleWrap, boxControlsWrap);
    boxLayer.removeChild(boxContainer);
    delete _message_boxes[guid];
  };

  // Hide box
  var hideMe = function (showingOther, tempHiding) {
    if (!visible) return;
    visible = false;

    var speed = (showingOther === true) ? 0 : options.animSpeed;

    if (options.hideOnBGClick) {
      removeEvent(document, 'click', __bq.hideBGClick);
    }

    if (isFunction(options.onBeforeHide)) {
      options.onBeforeHide();
    }

    if (_layerAnim && !showingOther) {
      layers.boxhide();
    }

    var onHide = function () {
      if (__bq.currHiding == _message_boxes[guid]) {
        __bq.currHiding = false;
      }
      if (!_layerAnim && !_message_boxes[guid].shOther && !showingOther) {
        layers.boxhide();
      }
      if (!tempHiding && options.selfDestruct) {
        destroyMe();
      } else {
        hide(boxContainer);
      }
      if (isFunction(options.onHide)) {
        options.onHide();
      }
    };
    if (speed > 0) {
      __bq.currHiding = _message_boxes[guid];
      fadeOut(boxContainer, speed, onHide);
    } else {
      onHide();
    }
  };

  // Show box
  function showMe(noAnim, notFirst, isReturned) {
    if (visible || !_message_boxes[guid]) return;
    visible = true;

    var speed = (noAnim === true || notFirst) ? 0 : options.animSpeed;

    if (options.hideOnBGClick) {
      addEvent(document, 'click', __bq.hideBGClick);
    }

    // Show blocking background
    if (!notFirst) {
      layers.boxshow();
    }

    if (__bq.currHiding) {
      __bq.currHiding.shOther = true;
      var cont = __bq.currHiding.bodyNode.parentNode.parentNode;
      cache(cont, 'tween').stop(true);
    }

    // Show box
    if (speed > 0) {
      fadeIn(boxContainer, speed);
    } else {
      show(boxContainer);
    }

    boxRefreshCoords(boxContainer);
    if (options.onShow) {
      options.onShow(isReturned);
    }

    _message_box_shown = true;

    if (options.dark) {
      addClass(boxLayerBG, 'bg_dark');
    }
  }

  if (options.dark) {
    re(domFC(boxCloseButton));
  }
  addEvent(boxCloseButton, 'click', __bq.hideLast);

  var retBox = _message_boxes[guid] = {
    guid: guid,
    _show: showMe,
    _hide: hideMe,

    bodyNode: boxBody,

    dark: options.dark,

    // Show box
    show: function () {
      __bq._show(guid);
      return this;
    },
    progress: boxProgress,
    showProgress: function () {
      hide(boxControlsText);
      show(boxProgress);
    },
    hideProgress: function () {
      hide(boxProgress);
      show(boxControlsText);
    },

    // Hide box
    hide: function (attemptParam) {
      if (isFunction(options.onHideAttempt) && !options.onHideAttempt(attemptParam)) return false;
      if (options.dark) {
        removeClass(boxLayerBG, 'bg_dark');
      }
      __bq._hide(guid);
      return true;
    },

    isVisible: function () {
      return visible;
    },
    bodyHeight: function () {
      return getStyle(boxBody, 'height');
    },

    // Insert html content into the box
    content: function (html) {
      if (options.onClean) options.onClean();
      boxBody.innerHTML = html;
      boxRefreshCoords(boxContainer);
      refreshBox();
      return this;
    },

    // Add button
    addButton: function (label, onclick, type, returnBtn) {
      var btn = addButton(label, onclick ? onclick : this.hide, type);
      return (returnBtn) ? btn : this;
    },

    setButtons: function (yes, onYes, no, onNo) {
      var b = this.removeButtons();
      //if (!yes) return b.addButton(box_close);
      if (no) b.addButton(no, onNo, 'no');
      return b.addButton(yes, onYes);
    },

    // Set controls text
    setControlsText: setControlsText,

    // Remove buttons
    removeButtons: function () {
      removeButtons();
      return this;
    },

    destroy: destroyMe,

    // Update box options
    setOptions: function (newOptions) {
      if (options.hideOnBGClick) {
        removeEvent(document, 'click', __bq.hideBGClick);
      }
      options = extend(options, newOptions);
      if ('bodyStyle' in newOptions) {
        var items = options.bodyStyle.split(';');
        for (var i = 0, l = items.length; i < l; ++i) {
          var name_value = items[i].split(':');
          if (name_value.length > 1 && name_value[0].length) {
            boxBody.style[trim(name_value[0])] = trim(name_value[1]);
            if (boxBody.style.setProperty) {
              boxBody.style.setProperty(trim(name_value[0]), trim(name_value[1]), '');
            }
          }
        }
      }
      if (options.hideOnBGClick) {
        addEvent(document, 'click', __bq.hideBGClick);
      }
      toggle(boxControlsWrap, !options.hideButtons);
      refreshBox();
      boxRefreshCoords(boxContainer);
      return this;
    },
    evalBox: function (js, url, params) {
      var scr = '((function() { return function() { var box = this; ' + (js || '') + ';}; })())'; // IE :(
      if (__debugMode) {
        var fn = eval(scr);
        fn.apply(this, [url, params]);
      } else try {
        var fn = eval(scr);
        fn.apply(this, [url, params]);
      } catch (e) {
        topError(e, {
          dt: 15,
          type: 7,
          url: url,
          query: params ? ajx2q(params) : undefined,
          js: js
        });
      }
    }
  };
  return retBox;
}

function showBox(url, params, options, e) {
  if (checkEvent(e)) return false;

  var opts = options || {};
  var boxParams = opts.params || {};
  if (opts.dark) {
    boxParams.dark = opts.dark;
  }
  var box = new MessageBox(boxParams);
  var p = {
    onDone: function (title, html, js, data) {
      if (opts.onDone) {
        opts.onDone(box);
      }
      if (!box.isVisible()) return;
      try {
        show(boxLayerBG);
        box.setOptions({
          title: title,
          hideButtons: boxParams.hideButtons || false
        });
        if (opts.showProgress) {
          box.show();
        } else {
          show(box.bodyNode);
        }
        box.content(html);
        box.evalBox(js, url, params);
        if (opts.onDone) opts.onDone(box, data);
      } catch (e) {
        topError(e, {
          dt: 15,
          type: 103,
          url: url,
          query: ajx2q(params),
          answer: Array.prototype.slice.call(arguments).join('<!>')
        });
        if (box.isVisible()) box.hide();
      }
    },
    onFail: function (error) {
      box.failed = true;
      setTimeout(box.hide, 0);
      if (isFunction(opts.onFail)) return opts.onFail(error);
    },
    cache: opts.cache,
    stat: opts.stat,
    fromBox: true
  };

  if (opts.prgEl) {
    opts.showProgress = showGlobalPrg.pbind(opts.prgEl, {
      cls: opts.prgClass,
      w: opts.prgW,
      h: opts.prgH,
      hide: true
    });
    opts.hideProgress = hide.pbind('global_prg');
  }
  if (opts.showProgress) {
    extend(p, {
      showProgress: opts.showProgress,
      hideProgress: opts.hideProgress
    });
  } else {
    box.setOptions({title: false, hideButtons: true}).show();
    if (__bq.count() < 2) {
      hide(boxLayerBG);
    }
    hide(box.bodyNode);
    p.showProgress = function () {
      show(boxLoader);
      boxRefreshCoords(boxLoader);
    };
    p.hideProgress = hide.pbind(boxLoader);
  }
  box.removeButtons().addButton('Закрыть');

  ajax.req(url, params, p);
  return box;
}

function showFastBox(o, c, yes, onYes, no, onNo) {
  return (new MessageBox(typeof(o) == 'string' ? {title: o} : o)).content(c).setButtons(yes, onYes, no, onNo).show();
}

// Three-state button

function createBtn(el, onClick) {
  el = ge(el);
  if (!el || el.btnevents) return;
  var p = el.parentNode;

  if (isFunction(onClick)) {
    el.onclick = onClick.pbind(el);
    return;
  }

  var hover = false;
  addEvent(el, 'click mousedown mouseover mouseout', function (e) {
    if (hasClass(p, '__locked') || p.hasAttribute('disabled')) return;
    switch (e.type) {
      case 'click':
        if (!hover) return;
        onClick(el);
        break;
      case 'mousedown':
        break;
      case 'mouseover':
        hover = true;
        break;
      case 'mouseout':
        hover = false;
        break;
    }
  });
  el.btnevents = true;
}


function isBtnLocked(el) {
  if (!(el = ge(el))) return;
  return hasClass(el, '__locked');
}

function lockBtn(el) {
  el = ge(el);
  if (!el || el.tagName.toLowerCase() != 'button' || isBtnLocked(el)) return;
  addClass(el, '__locked');
  el.innerHTML = '<span class="btn__h">' + el.innerHTML + '</span>';
  disableBtn(el, true);
}

function unlockBtn(el) {
  el = ge(el);
  if (!isBtnLocked(el)) return;
  el.innerHTML = el.firstChild.innerHTML;
  removeClass(el, '__locked');
  enableBtn(el);
}

function disableBtn(el) {
  if (!(el = ge(el)) || el.tagName.toLowerCase() !== 'button') return;
  el.setAttribute("disabled", "disabled")
}
function enableBtn(el) {
  if (!(el = ge(el)) || el.tagName.toLowerCase() !== 'button') return;
  el.removeAttribute("disabled")
}

function sbWidth() {
  if (window._sbWidth === undefined) {
    var t = ce('div', {innerHTML: '<div style="height: 75px;">1<br>1</div>'}, {
      overflowY: 'scroll',
      position: 'absolute',
      width: '50px',
      height: '50px'
    });
    bodyNode.appendChild(t);
    window._sbWidth = t.offsetWidth - t.firstChild.offsetWidth - 1;
    bodyNode.removeChild(t);
  }
  return window._sbWidth;
}

function onBodyResize(force) {
  var w = window, de = document.documentElement;
  if (!w.pageNode) return;
  var dwidth = Math.max(intval(w.innerWidth), intval(de.clientWidth));
  var dheight = Math.max(intval(w.innerHeight), intval(de.clientHeight));
  var sbw = sbWidth();

  if (browser.mobile) {
    dwidth = Math.max(dwidth, intval(bodyNode.scrollWidth));
    dheight = Math.max(dheight, intval(bodyNode.scrollHeight));
  } else if (browser.msie7) {
    if (htmlNode.scrollHeight > htmlNode.offsetHeight) {
      dwidth += sbw + 1;
    }
  } else if (browser.msie8) {
    if (htmlNode.scrollHeight + 3 > htmlNode.offsetHeight) {
      dwidth += sbw + 1;
    }
  }
  if (w.lastWindowWidth != dwidth || force === true) {
    w.lastInnerWidth = w.lastWindowWidth = dwidth;

    if (bodyNode.offsetWidth < layoutWidth + sbw + 2) {
      dwidth = layoutWidth + sbw + 2;
    }
    if (dwidth) {
      for (var el = pageNode.firstChild; el; el = el.nextSibling) {
        if (!el.tagName) continue;
        for (var e = el.firstChild; e; e = e.nextSibling) {
          if (e.className == 'scroll_fix') {
            e.style.width = ((w.lastInnerWidth = (dwidth - sbw * (browser.msie7 ? 2 : 1) - 1)) - 1) + 'px';
          }
        }
      }
    }
  }
  if (w.lastWindowHeight != dheight || force === true) {
    w.lastWindowHeight = dheight;
    if (browser.msie6) {
      pageNode.style.height = dheight + 'px';
    }
  }
  if (cur.lSTL) {
    setStyle(cur.lSTL, {
      width: Math.max(getXY(cur.lSTL.el)[0], 0),
      height: dheight - 1
    });
  }
}


Image.prototype.load = function (url, onprogress, onerror, onload) {
  var thisImg = this;
  var xmlHTTP = new XMLHttpRequest();
  xmlHTTP.open('GET', url, true);
  xmlHTTP.responseType = 'arraybuffer';
  xmlHTTP.onload = function (e) {
    var blob = new Blob([this.response]);
    thisImg.src = window.URL.createObjectURL(blob);
    if (isFunction(onload)) {
      onload()
    }
  };
  xmlHTTP.onerror = function (e) {
    if (isFunction(onerror)) {
      onerror(e)
    }
  };
  xmlHTTP.onprogress = function (e) {
    parseInt(thisImg.completedPercentage = (e.loaded / e.total) * 100);
    if (isFunction(onprogress)) {
      onprogress(thisImg.completedPercentage)
    }
  };
  xmlHTTP.onloadstart = function () {
    thisImg.completedPercentage = 0;
  };
  xmlHTTP.send();
};

Image.prototype.completedPercentage = 0;

function preloadImages() {
  // Can receive multiple urls args
  var images = [];
  for (var i = 0; i < arguments.length; i++) {
    images[i] = new Image();
    images[i].src = arguments[i]
  }
}

function isLoadedImage(img) {
  if (!img.complete) {
    return false;
  }
  if (typeof img.naturalWidth !== "undefined" && img.naturalWidth === 0) {
    return false;
  }
  return true;
}

// Three-state button

function checkTextLength(maxLen, inp, warn, nobr, cut, force, utf) {
  var value = (inp.getValue) ? inp.getValue() : inp.value,
    lastLen = inp.lastLen || 0;
  if (inp.lastLen === value.length && !force) return;
  inp.lastLen = value.length;
  var spec = {
      '&': 5,
      '<': 4,
      '>': 4,
      '"': 6,
      "\n": (nobr ? 1 : 4),
      "\r": 0,
      '!': 5,
      "'": 5,
      '$': 6,
      '\\': 6
    },
    good = {
      0x490: 1,
      0x491: 1,
      0x2013: 1,
      0x2014: 1,
      0x2018: 1,
      0x2019: 1,
      0x201a: 1,
      0x2026: 1,
      0x2030: 1,
      0x2039: 1,
      0x203a: 1,
      0x20ac: 1,
      0x2116: 1,
      0x2122: 1,
      0xfffd: 1
    },
    bad = {0x40d: 1, 0x450: 1, 0x45d: 1};
  if (cut) spec[','] = 5;
  var countRealLen = function (text, nobr) {
    var res = 0;
    for (var i = 0, l = text.length; i < l; i++) {
      var k = spec[text.charAt(i)], c = text.charCodeAt(i);
      if (k !== undefined) {
        res += k;
      } else if (!utf && c >= 0x80 && (c < 0x401 || bad[c] || c > 0x45f) && !good[c] && (c < 0x201c || c > 0x201e) && (c < 0x2020 || c > 0x2022)) {
        res += ('&#' + c + ';').length;
      } else {
        res += 1;
      }
    }
    return res;
  };
  var realCut = function (text, len) {
    var curLen = 0, res = '';
    for (var i = 0, l = text.length; i < l; i++) {
      var symbol = text.charAt(i), k = spec[symbol], c = text.charCodeAt(i);
      if (k !== undefined) {
        curLen += k;
      } else if (!utf && c >= 0x80 && (c < 0x401 || bad[c] || c > 0x45f) && !good[c] && (c < 0x201c || c > 0x201e) && (c < 0x2020 || c > 0x2022)) {
        curLen += ('&#' + c + ';').length;
      } else {
        curLen += 1;
      }
      if (curLen > len) break;
      res += symbol;
    }
    return res;
  };
  var realLen = countRealLen(value, nobr);
  warn = ge(warn);
  if (realLen > maxLen - 100) {
    show(warn);
    if (realLen > maxLen) {
      if (cut) {
        var cutVal = val(inp, realCut(value, Math.min(maxLen, lastLen)));
        inp.lastLen = cutVal.length;
        warn.innerHTML = getLang('text_N_symbols_remain', 0);
      } else {
        warn.innerHTML = getLang('text_exceeds_symbol_limit', realLen - maxLen);
      }
    } else {
      warn.innerHTML = getLang('text_N_symbols_remain', maxLen - realLen);
    }
  } else {
    hide(warn);
  }
}

function isChecked(el) {
  el = ge(el);
  return hasClass(el, 'on') ? 1 : '';
}
function checkbox(el, v) {
  el = ge(el);
  if (!el || hasClass(el, '__disabled')) return;

  if (v === undefined) {
    v = !isChecked(el);
  }
  toggleClass(el, 'on', v);
  return false;
}

function toggleDisable(el, v) {
  el = ge(el);

  if (v === undefined) {
    v = !hasClass(el, '__disabled');
  }
  toggleClass(el, '__disabled', v);
  return false;
}
function disable(el) {
  el = ge(el);

  addClass(el, '__disabled');
  return false;
}
function enable(el) {
  el = ge(el);

  removeClass(el, '__disabled');
  return false;
}


var radioBtns = {};
function radioval(name) {
  return radioBtns[name] ? radioBtns[name].val : false;
}
function radiobtn(el, v, name) {
  if (!radioBtns[name]) return;
  each(radioBtns[name].els, function () {
    if (this == el) {
      addClass(this, 'on');
    } else {
      removeClass(this, 'on');
    }
  });
  return radioBtns[name].val = v;
}

function handleScroll(scroll) {
  scroll = scroll.split(',');
  var named = cur.named || {},
    scrollEl = scroll[0] && (named[scroll[0]] || ge(scroll[0])) || false,
    focusEl = scroll[1] && (named[scroll[1]] || ge(scroll[1])) || false;

  if (!scrollEl && !focusEl) {
    scrollEl = document.getElementsByName(scroll[0])[0];
    if (scrollEl) {
      scrollEl = scrollEl.nextSibling;
    } else {
      return;
    }
  }

  setTimeout(function () {
    scrollEl && scrollToY(getXY(scrollEl)[1], 0);
    focusEl && elfocus(focusEl);
  }, 300);
}

function showDoneBox(msg, opts) {
  opts = opts || {};
  var l = (opts.w || 380) + 20;
  var style = opts.w ? ' style="width: ' + opts.w + 'px;"' : '';
  var pageW = bodyNode.offsetWidth,
    resEl = ce('div', {
      className: 'top_result_baloon_wrap __fixed',
      innerHTML: '<div class="top_result_baloon"' + style + '>' + msg + '</div>'
    }, {left: (pageW - l) / 2});

  bodyNode.insertBefore(resEl, pageNode);

  var height = window.innerHeight ? window.innerHeight : (document.documentElement.clientHeight ? document.documentElement.clientHeight : boxLayerBG.offsetHeight);
  var top = browser.mobile ? intval(window.pageYOffset) : 0;
  containerSize = getSize(resEl);
  resEl.style.top = Math.max(10, top + (height - containerSize[1]) / 3) + 'px';
  var out = opts.out || 2000;
  var _fadeOut = function () {
    setTimeout(function () {
      if (opts.permit && !opts.permit()) {
        _fadeOut();
        return;
      }
      fadeOut(resEl.firstChild, 500, function () {
        re(resEl);
        if (opts.callback) {
          opts.callback();
        }
      });
    }, out);
  };
  _fadeOut();
}

function animateCount(el, newCount, opts) {
  el = ge(el);
  opts = opts || {};

  if (opts.str) {
    newCount = trim(newCount.toString()) || '';
  } else {
    newCount = positive(newCount);
  }
  if (!el) return;
  if (browser.msie6 || browser.mobile && !browser.safari_mobile && !browser.android) {
    val(el, newCount || '');
    return;
  }

  var curCount = cache(el, 'curCount'),
    nextCount = cache(el, 'nextCount');

  if (typeof nextCount == 'number' || opts.str && typeof nextCount == 'string') {
    if (newCount != nextCount) {
      cache(el, 'nextCount', newCount);
    }
    return;
  }
  if (typeof curCount == 'number' || opts.str && typeof curCount == 'string') {
    if (newCount != curCount) {
      cache(el, 'nextCount', newCount);
    }
    return;
  }
  if (opts.str) {
    curCount = trim(val(el).toString()) || '';
  } else {
    curCount = positive(val(el));
  }
  if (opts.str === 'auto') {
    opts.str = !curCount.match(/^\d+$/) || !newCount.match(/^\d+$/);
    if (!opts.str) {
      curCount = positive(curCount);
      newCount = positive(newCount);
    }
  }
  if (curCount == newCount) {
    return;
  }
  cache(el, 'curCount', newCount);
  var incr = opts.str ? (curCount.length == newCount.length ? curCount < newCount : curCount.length < newCount.length) : curCount < newCount,
    big = (incr ? newCount : curCount).toString(),
    small = (incr ? curCount : newCount).toString(),
    constPart = [],
    constEndPart = [],
    bigPart = '',
    smallPart = '',
    i, l, j;

  if (!opts.str) {
    small = ((new Array(big.length - small.length + 1)).join('0')) + small;
  }
  for (i = 0, l = big.length; i < l; i++) {
    if ((j = big.charAt(i)) !== small.charAt(i)) {
      break;
    }
    constPart.push(j);
  }
  bigPart = big.substr(i);
  smallPart = small.substr(i);

  if (opts.str) {
    for (i = bigPart.length; i > 0; i--) {
      if ((j = bigPart.charAt(i)) !== smallPart.charAt(i)) {
        break;
      }
      constEndPart.unshift(j);
    }
    if (constEndPart.length) {
      bigPart = bigPart.substr(0, i + 1);
      smallPart = smallPart.substr(0, i + 1);
    }
  }

  constPart = constPart.join('').replace(/\s$/, '&nbsp;');
  constEndPart = constEndPart.join('').replace(/^\s/, '&nbsp;');

  if (!trim(val(el))) {
    val(el, '&nbsp;');
  }
  var h = el.clientHeight || el.offsetHeight;
  val(el, '<div class="counter_wrap inl_bl"></div>');
  var wrapEl = el.firstChild,
    constEl1, constEl2, animwrapEl, animEl,
    vert = true;

  if (constPart.length) {
    wrapEl.appendChild(constEl1 = ce('div', {
      className: 'counter_const inl_bl',
      innerHTML: constPart
    }));
  }
  if (!constPart.length) {
    smallPart = smallPart.replace(/^0+/, '');
  }
  if (!smallPart || smallPart == '0' && !constPart.length) {
    smallPart = '&nbsp;';
    vert = constPart.length ? true : false;
  }

  wrapEl.appendChild(animwrapEl = ce('div', {className: 'counter_anim_wrap inl_bl'}));
  animwrapEl.appendChild(animEl = ce('div', {
    className: 'counter_anim ' + (incr ? 'counter_anim_inc' : 'counter_anim_dec'),
    innerHTML: '<div class="counter_anim_big"><span class="counter_anim_big_c">' + bigPart + '</span></div>' +
    (vert ? '<div class="counter_anim_small"><span class="counter_anim_small_c">' + smallPart + '</span></div>' : '')
  }, vert ? {marginTop: incr ? -h : 0} : {right: 'auto', left: 0}));
  if (opts.str) {
    setStyle(animEl, {textAlign: 'left', right: 'auto', left: 0});
  }

  var bigW = geByClass1('counter_anim_big_c', animEl, 'span').offsetWidth,
    smallW = vert ? (smallPart == '&nbsp;' ? bigW : geByClass1('counter_anim_small_c', animEl, 'span').offsetWidth) : 0;

  if (constEndPart.length) {
    wrapEl.appendChild(constEl2 = ce('div', {
      className: 'counter_const inl_bl',
      innerHTML: constEndPart
    }));
  }

  setStyle(wrapEl, {width: (constEl1 && constEl1.offsetWidth || 0) + (constEl2 && constEl2.offsetWidth || 0) + bigW + 0})

  if (browser.csstransitions === undefined) {
    var b = browser, bv = floatval(b.version);
    browser.csstransitions =
      (b.chrome && bv >= 9.0) ||
      (b.mozilla && bv >= 4.0) ||
      (b.opera && bv >= 10.5) ||
      (b.safari && bv >= 3.2) ||
      (b.safari_mobile) ||
      (b.android);
  }
  var css3 = browser.csstransitions;
  setStyle(animwrapEl, {width: incr ? smallW : bigW});

  // return debugLog(css3, incr, curCount, newCount, animwrapEl, animEl, geByClass1('counter_anim_big_c', animEl, 'span'), geByClass1('counter_anim_small_c', animEl, 'span'), h, bigW, smallW);
  var onDone = function () {
    val(el, newCount || ' ');
    var next = cache(el, 'nextCount');
    cache(el, 'curCount', false);
    cache(el, 'nextCount', false);
    if (typeof next == 'number' || opts.str && typeof next == 'string') {
      setTimeout(animateCount.pbind(el, next, opts), 0);
    }
    opts.onDone && opts.onDone();
  }, margin = vert ? {marginTop: incr ? 0 : -h} : {marginRight: incr ? -smallW : 0};
  if (css3) {
    getStyle(animwrapEl, 'width');
    addClass(animwrapEl, 'counter_css_anim_wrap');
    if (bigW != smallW) {
      setStyle(animwrapEl, {width: incr ? bigW : smallW});
    }
    if (vert) setStyle(animEl, margin);
    setTimeout(onDone, 300);
  } else {
    if (bigW != smallW) {
      animate(animwrapEl, {width: incr ? bigW : smallW}, {duration: 100});
    }
    if (vert) {
      animate(animEl, margin, {
        duration: 300,
        transition: Fx.Transitions.easeOutCirc,
        onComplete: onDone
      });
    } else {
      setTimeout(onDone, 300);
    }
  }
}

var fakeLocalStorage = function () {
  var fakeLocalStorage = {};
  var storage;

  // If Storage exists we modify it to write to our fakeLocalStorage object instead.
  // If Storage does not exist we create an empty object.
  if (window.Storage && window.localStorage) {
    storage = window.Storage.prototype;
  } else {
    // We don't bother implementing a fake Storage object
    window.localStorage = {};
    storage = window.localStorage;
  }

  // For older IE
  if (!window.location.origin) {
    window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
  }

  var dispatchStorageEvent = function (key, newValue) {
    var oldValue = (key == null) ? null : storage.getItem(key); // `==` to match both null and undefined
    var url = location.href.substr(location.origin.length);
    var storageEvent = document.createEvent('StorageEvent'); // For IE, http://stackoverflow.com/a/25514935/1214183

    storageEvent.initStorageEvent('storage', false, false, key, oldValue, newValue, url, null);
    window.dispatchEvent(storageEvent);
  };

  storage.key = function (i) {
    var key = Object.keys(fakeLocalStorage)[i];
    return typeof key === 'string' ? key : null;
  };

  storage.getItem = function (key) {
    return typeof fakeLocalStorage[key] === 'string' ? fakeLocalStorage[key] : null;
  };

  storage.setItem = function (key, value) {
    dispatchStorageEvent(key, value);
    fakeLocalStorage[key] = String(value);
  };

  storage.removeItem = function (key) {
    dispatchStorageEvent(key, null);
    delete fakeLocalStorage[key];
  };

  storage.clear = function () {
    dispatchStorageEvent(null, null);
    fakeLocalStorage = {};
  };
};

// Example of how to use it
if (typeof window.localStorage === 'object') {
  // Safari will throw a fit if we try to use localStorage.setItem in private browsing mode.
  try {
    localStorage.setItem('localStorageTest', 1);
    localStorage.removeItem('localStorageTest');
  } catch (e) {
    fakeLocalStorage();
  }
} else {
  // Use fake localStorage for any browser that does not support it.
  fakeLocalStorage();
}

var ls = {
  checkVersion: function () {
    return (window.localStorage !== undefined && window.JSON !== undefined);
  },
  set: function (k, v) {
    this.remove(k);
    try {
      return (ls.checkVersion()) ? localStorage.setItem(k, JSON.stringify(v)) : false;
    } catch (e) {
      alert(e);
      return false;
    }
  },
  get: function (k) {
    if (!ls.checkVersion()) {
      return false;
    }
    try {
      return parseJSON(localStorage.getItem(k));
    } catch (e) {
      return false;
    }
  },
  remove: function (k) {
    try {
      localStorage.removeItem(k);
    } catch (e) {
    }
    ;
  }
};

function cssAnim(obj, prep, opts, callb) {
  var v = intval(browser.version);
  if (obj && ((browser.chrome && v > 14) || (browser.mozilla && v > 13) || (browser.opera && v > 2))) {
    var callbWrap;
    var st = 'all ' + opts.duration + 'ms ' + (opts.func || 'ease-out');
    obj.style.WebkitTransition = st;
    obj.style.MozTransition = st;
    obj.style.OTransition = st;
    obj.style.transition = st;
    var callbWrap = function () {
      if (browser.opera && intval(browser.version) <= 12) {
        obj.removeEventListener('oTransitionEnd', callbWrap);
      } else {
        removeEvent(obj, 'webkitTransitionEnd transitionend msTransitionEnd oTransitionEnd', callbWrap);
      }
      obj.style.WebkitTransition = '';
      obj.style.MozTransition = '';
      obj.style.OTransition = '';
      obj.style.transition = '';
      if (callb) callb();
      return false;
    };
    if (callb) {
      if (browser.opera && intval(browser.version) <= 12) {
        obj.addEventListener('oTransitionEnd', callbWrap)
      } else {
        addEvent(obj, 'webkitTransitionEnd transitionend msTransitionEnd oTransitionEnd', callbWrap);
      }
    }
    setTimeout(setStyle.pbind(obj, prep), 0);
  } else {
    animate(obj, prep, extend(opts, {onComplete: callb}));
  }
}


// Begin Templates
// "if not" available only for simple value, like "if not users" => "if (! users)".
// For "if not 2 == 2" - not available.

// Example:
//   template = tpl.template(template_string)
//   compiled_html = template({
//     users: {first_name: "ruslan", last_name: "yanberdin"},
//     test: true
//   })

// Hack for underscore.
var _ = {};

(function () {
  "use strict";
  var tpl = {
    version: "1.0.1",
    templateSettings: {
      evaluate: /\{%([\s\S]+?(}?)+)%}/g,
      interpolate: /\{\{\s*([\s\S]+?)\s*}}/g,
      encode: /\{\{!([\s\S]+?)}}/g,
      use: /\{\{#([\s\S]+?)}}/g,
      useParams: /(^|[^\w$])def(?:\.|\[[\'\"])([\w$\.]+)(?:[\'\"]\])?\s*\:\s*([\w$\.]+|\"[^\"]+\"|\'[^\']+\'|\{[^\}]+\})/g,
      define: /\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,
      defineParams: /^\s*([\w$]+):([\s\S]+)/,
      conditional: /\{%\s*(if|elif|else|endif)\s*([\s\S]*?)\s*%}/g,
      iterate: /\{%\s*[\w$]*for\s*(?:%}|([\w$]+)\s*,*\s*([\w$]*)\s+in\s+([\s\S]+?)\s*%})/g,
      EOPS: /(^|[^$\w])(and|or|not|is|isnot|==|!=)([^$\w]|$)/g,
      operators: {
        and: '&&',
        or: '||',
        not: '!',
        is: '==',
        isnot: '!=',
        "==": '===',
        "!=": '!=='
      },
      varname: "it",
      strip: true,
      append: true,
      selfcontained: false,
      doNotSkipEncoded: false
    },
    template: undefined, //fn, compile template
    compile: undefined  //fn, for express
  }, _globals;

  tpl.encodeHTMLSource = function (doNotSkipEncoded) {
    var encodeHTMLRules = {
        "&": "&#38;",
        "<": "&#60;",
        ">": "&#62;",
        '"': "&#34;",
        "'": "&#39;",
        "/": "&#47;"
      },
      matchHTML = doNotSkipEncoded ? /[&<>"'\/]/g : /&(?!#?\w+;)|<|>|"|'|\//g;
    return function (code) {
      return code ? code.toString().replace(matchHTML, function (m) {
        return encodeHTMLRules[m] || m;
      }) : "";
    };
  };

  _globals = (function () {
    return this || (0, eval)("this");
  }());

  if (typeof module !== "undefined" && module.exports) {
    module.exports = tpl;
  } else if (typeof define === "function" && define.amd) {
    define(function () {
      return tpl;
    });
  } else {
    _globals.tpl = tpl;
  }

  var startend = {
    append: {start: "'+(", end: ")+'", startencode: "'+encodeHTML("},
    split: {
      start: "';out+=(",
      end: ");out+='",
      startencode: "';out+=encodeHTML("
    }
  }, skip = /$^/;

  function resolveDefs(c, block, def) {
    return ((typeof block === "string") ? block : block.toString())
      .replace(c.define || skip, function (m, code, assign, value) {
        if (code.indexOf("def.") === 0) {
          code = code.substring(4);
        }
        if (!(code in def)) {
          if (assign === ":") {
            if (c.defineParams) value.replace(c.defineParams, function (m, param, v) {
              def[code] = {arg: param, text: v};
            });
            if (!(code in def)) def[code] = value;
          } else {
            new Function("def", "def['" + code + "']=" + value)(def);
          }
        }
        return "";
      })
      .replace(c.use || skip, function (m, code) {
        if (c.useParams) code = code.replace(c.useParams, function (m, s, d, param) {
          if (def[d] && def[d].arg && param) {
            var rw = (d + ":" + param).replace(/'|\\/g, "_");
            def.__exp = def.__exp || {};
            def.__exp[rw] = def[d].text.replace(new RegExp("(^|[^\\w$])" + def[d].arg + "([^\\w$])", "g"), "$1" + param + "$2");
            return s + "def.__exp['" + rw + "']";
          }
        });
        var v = new Function("def", "return " + code)(def);
        return v ? resolveDefs(c, v, def) : v;
      });
  }

  function unescape(code) {
    return code.replace(/\\('|\\)/g, "$1").replace(/[\r\t\n]/g, " ");
  }

  tpl.template = function (tmpl, c, def, is_from_path) {
    if (is_from_path === undefined) {
      is_from_path = true
    }
    if (is_from_path === true) {
      // Example path: "registration/form.html"
      tmpl = templates[tmpl]()
    }

    c = c || tpl.templateSettings;
    var cse = c.append ? startend.append : startend.split, needhtmlencode, sid = 0, indv,
      str = (c.use || c.define) ? resolveDefs(c, tmpl, def || {}) : tmpl;

    str = ("var out='" + (c.strip ? str.replace(/(^|\r|\n)\t* +| +\t*(\r|\n|$)/g, " ")
      .replace(/\r|\n|\t|\/\*[\s\S]*?\*\//g, "") : str)
      .replace(/'|\\/g, "\\$&")
      .replace(c.interpolate || skip, function (m, code) {
        return cse.start + unescape(code) + cse.end;
      })
      .replace(c.encode || skip, function (m, code) {
        needhtmlencode = true;
        return cse.startencode + unescape(code) + cse.end;
      })
      .replace(c.conditional || skip, function (m, tag, code) {
        code = code.replace(c.EOPS, function (s, before, op, after) {
          if (after === '=') {
            after = ' '
          }
          return (op in c.operators) ? before + c.operators[op] + after : s;
        });

        if (tag === "elif" || tag == "else") {
          return (code ? "';}else if(" + unescape(code) + "){out+='" : "';}else{out+='");
        } else {
          return (code ? "';if(" + unescape(code) + "){out+='" : "';}out+='");
        }
      })
      .replace(c.iterate || skip, function (m, vname, iname, iterate) {
        if (!iterate) return "';} ) } out+='";
        sid += 1;
        indv = iname || "i" + sid;
        iterate = unescape(iterate);

        return "';var arr" + sid + "=" + iterate + ";if(arr" + sid + "){" +
          "each(" + iterate + ", function(" + indv + ", " + vname + "){" +
          "out+='";
      })
      .replace(c.evaluate || skip, function (m, code) {
        return "';" + unescape(code) + "out+='";
      })
    + "';return out;")
      .replace(/\n/g, "\\n").replace(/\t/g, '\\t').replace(/\r/g, "\\r")
      .replace(/(\s|;|\}|^|\{)out\+='';/g, '$1').replace(/\+''/g, "");
    //.replace(/(\s|;|\}|^|\{)out\+=''\+/g,'$1out+=');
    if (needhtmlencode) {
      if (!c.selfcontained && _globals && !_globals._encodeHTML) _globals._encodeHTML = tpl.encodeHTMLSource(c.doNotSkipEncoded);
      str = "var encodeHTML = typeof _encodeHTML !== 'undefined' ? _encodeHTML : ("
        + tpl.encodeHTMLSource.toString() + "(" + (c.doNotSkipEncoded || '') + "));"
        + str;
    }
    try {
      return new Function(c.varname, str);
    } catch (e) {
      if (typeof console !== "undefined") console.log("Could not create a template function: " + str);
      throw e;
    }
  };

  tpl.compile = function (tmpl, def) {
    return tpl.template(tmpl, null, def);
  };
}());
// End Templates


// Begin Hash
var Hash = new function () {
  var params;

  this.set = function (key, value) {
    params[key] = value;
    this.push();
  };

  this.remove = function (key, value) {
    delete params[key];
    this.push();
  };

  this.get = function (key, value) {
    return params[key];
  };

  this.keyExists = function (key) {
    return params.hasOwnProperty(key);
  };

  this.push = function () {
    var hashBuilder = [], key, value;

    for (key in params) if (params.hasOwnProperty(key)) {
      key = escape(key), value = escape(params[key]); // escape(undefined) == "undefined"
      hashBuilder.push(key + ( (value !== "undefined") ? '=' + value : "" ));
    }

    window.location.hash = hashBuilder.join("&");
  };

  (this.load = function () {
    params = {};
    var hashStr = window.location.hash, hashArray, keyVal
    hashStr = hashStr.substring(1, hashStr.length);
    hashArray = hashStr.split('&');

    for (var i = 0; i < hashArray.length; i++) {
      keyVal = hashArray[i].split('=');
      params[unescape(keyVal[0])] = (typeof keyVal[1] != "undefined") ? unescape(keyVal[1]) : keyVal[1];
    }
  })();
};
// End Hash

// Begin Static load
var handled_static = {};

function st() {
  var doc = document,
    head = doc.getElementsByTagName('head')[0],
    body = doc.getElementsByTagName('body')[0],
    setTimeout = window.setTimeout,
    createElement = 'createElement',
    appendChild = 'appendChild',
    onreadystatechange = 'onreadystatechange',
    styleSheet = 'styleSheet',
    loading = 0,
    decrementLoading = function () {
      --loading;
    },
    i,
  // Load as much resources as we can
    loadResources = function (resources, callback, a, b) {
      // Waiting for DOM readiness then load resources
      if (!head) {
        setTimeout(function () {
          loadResources(resources);
        }, 10);
      }
      // Load resources
      else if (resources.length) {
        i = -1;
        while (a = resources[++i]) {
          // Simple callback
          if ((b = typeof a) == 'function') {
            callback = function () {
              a();
              return true;
            };
            break;
          }
          // Resource
          else if (b == 'string') {
            loadResource(a);
          }
          // Resource + validation callback
          else if (a.pop) {
            loadResource(a[0]);
            callback = a[1];
            break;
          }
        }
        watchResources(callback, Array.prototype.slice.call(resources, i + 1));
      }
    },
  // Load one resource
    loadResource = function (resource, a, b) {
      // Extract resource name
      b = /(^.+\.\w+)(\?.*)?$/.exec(resource)[1];
      var filename = resource.split(/(\\|\/)/g).pop().split('.')[0];

      // Verify if the resource is not already handled
      if (handled_static[b]) {
        return;
      }
      // Load resource
      handled_static[b] = 1;
      ++loading;
      // JS
      if (/\.js$/.test(b)) {
        // Create SCRIPT element
        a = doc[createElement]('script');
        a.src = resource;
        a.id = filename + 'Js';
        head[appendChild](a);
        // Watching loading state
        if (a[onreadystatechange] === null) {
          // Trident, Presto
          a[onreadystatechange] = watchScript;
        }
        else {
          // Webkit, Gecko (also IE>=9 and Presto)
          a.onload = decrementLoading;
        }
      }
      // CSS
      if (/\.css$/.test(b)) {
        // Create LINK element
        a = doc[createElement]('link');
        a.rel = styleSheet;
        a.href = resource;
        a.id = filename + 'Css';
        head[appendChild](a);
        // Watching loading state
        watchStylesheet(a);
      }
      // TEMPLATE (.tmpl)
      if (/\.tmpl$/.test(b)) {
        // Create script element
        ajax.req({
          url: resource,
          //headers: "'Content-type': 'application/octet-stream; charset=utf-8'",
          done: function (err, res) {
            if (res.status != 200) {
              topError("Ошибка: неудалось загрузить файл " + resource)
            } else {
              var r = res.text;
              //a = doc[createElement]('script');
              //a.type = 'text/plain';
              //a.id = filename + 'Tmpl';
              //a.innerHTML = r;
              //body[appendChild](a);
              decrementLoading();
              cur.templates[filename] = r;
            }
          }
        });
      }
    },
  // Watch if all resources have been loaded
    watchResources = function (callback, resourcesToLoad) {
      if (!loading) {
        if (!callback || callback()) {
          loadResources(resourcesToLoad);
          return;
        }
      }
      setTimeout(function () {
        watchResources(callback, resourcesToLoad);
      }, 10);
    },
  // Watch if a CSS resource has been loaded
    watchStylesheet = function (node) {
      if (node.sheet || node[styleSheet]) {
        decrementLoading();
        return;
      }
      setTimeout(function () {
        watchStylesheet(node);
      }, 10);
    },
  // Watch if a script has been loaded
    watchScript = function () {
      if (/ded|co/.test(this.readyState)) {
        decrementLoading();
      }
    };
  // Load resources
  loadResources(arguments);
}
// End Static load

// Begin nav (Navigate)
/**
 * Router
 * Example:
 *
 * // init page (url is regexp in string)
 * nav.add("/products\/(.*)\/edit(.*)/?limit=10", function(params, queryVars) {
 *  console.log('products', params, queryVars);
 *  // arguments[0] = params
 *  // arguments[1] = queryParams
 *
 *  // will show: products [{0: 12, 1: 22, index: 0, input: "/products/12/edit/22"} ] 10
 * })
 *
 * // go to page
 * nav.go("/products/12/edit/22");
 *
 * // init router
 * nav.init();
 */
var nav = {
  routes: [],
  mode: 'history',
  root: '/',
  initpath: '',

  init: function (options) {
    this.mode = !!(history.pushState) ? 'history' : 'hash';
    this.root = options && options.root ? '/' + this.clearSlashes(options.root) + '/' : '/';
    this.initpath = options && options.initpath ? options.initpath : window.location.pathname;
    this.initpath = this.initpath.replace(new RegExp(this.root), "");

    this.go(this.initpath + window.location.search + window.location.hash, true);
    this.listen();
    return this;
  },
  getFragment: function () {
    var fragment = '';
    if (this.mode === 'history') {
      fragment = this.clearSlashes(decodeURI(location.pathname + location.search));
      var lastSlash = fragment.slice(-1) == "/" ? "/" : "";
      fragment = this.clearSlashes(fragment.replace(/\?(.*)$/, ''));
      fragment = this.root != '/' ? fragment.replace(this.clearSlashes(this.root), '') + lastSlash : fragment;
    } else {
      var match = window.location.href.match(/#(.*)$/);
      fragment = match ? match[1] : '';
      fragment = this.clearSlashes(fragment);
    }
    return fragment
  },
  clearSlashes: function (path) {
    return path.toString().replace(/\/$/, '').replace(/^\//, '');
  },
  add: function (re, handler) {
    if (typeof re == 'function') {
      handler = re;
      re = '';
    }
    this.routes.push({re: re, handler: handler});
    return this;
  },
  remove: function (param) {
    for (var i = 0, r; i < this.routes.length, r = this.routes[i]; i++) {
      if (r.handler === param || r.re.toString() === param.toString()) {
        this.routes.splice(i, 1);
        return this;
      }
    }
    return this;
  },
  flush: function () {
    this.routes = [];
    this.mode = null;
    this.root = '/';
    return this;
  },
  check: function (f) {
    var fragment = f || this.getFragment();
    for (var i = 0; i < this.routes.length; i++) {
      var match = fragment.match(this.routes[i].re);
      if (match) {
        match.shift();
        this.routes[i].handler.call({}, match, getQueryVars());
        return this;
      }
    }
    return this;
  },
  listen: function () {
    var self = this;
    var current = self.getFragment();
    if (this.mode === 'history') {
      window.addEventListener('popstate', function (e) {
        current = self.getFragment();
        self.check(current);
      });
    } else {
      var fn = function () {
        if (current !== self.getFragment()) {
          current = self.getFragment();
          self.check(current);
        }
      };
      clearInterval(this.interval);
      this.interval = setInterval(fn, 50);
    }

    return this;
  },
  back: function () {
    if (this.mode !== 'history') {
      topError('Nav is not available back function in Hash addresses.')
      return
    }
    history.back();
  },
  go: function (path, redirect, reload) {
    /**
     * Go to page
     *
     * @param {string} path Path to page
     * @param {bool} redirect If true, then replace current page, without add new state
     * @param {bool} reload If true, then reload page
     */
    var self = this;
    path = path ? path : '';
    if (this.mode === 'history') {
      var lastSlash = path.slice(-1) == "/" ? "/" : "";
      console.log("Go to: " + this.root + this.clearSlashes(path) + lastSlash);
      if (redirect) {
        history.replaceState(null, null, this.root + this.clearSlashes(path) + lastSlash);
      } else {
        history.pushState(null, null, this.root + this.clearSlashes(path) + lastSlash);
      }
      self.check(self.getFragment());
    } else {
      window.location.href.match(/#(.*)$/);
      window.location.href = window.location.href.replace(/#(.*)$/, '') + '#' + path;
    }
    if (reload) {
      window.location.reload();
    }
    return false;
  }
};

// Init nav
//nav.init({root: "/"});
//nav.go();
// End nav (Navigate)
