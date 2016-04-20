export const formatPhone = (phonenum, simpleOut) => {
  phonenum = phonenum.replace(/[^\+0-9]/gi, '');
  var regexObj = /^(?:\+?7?8?[-. ]?)?(?:\(?([0-9]{3})\)?[-. ]?)?([0-9]{3})[-. ]?([0-9]{2})([0-9]{2})$/;
  if (regexObj.test(phonenum)) {
    var parts = phonenum.match(regexObj);
    var phone = "";
    if (simpleOut) {
      if (parts[1]) {
        phone += "+7" + parts[1];
      }
      phone += parts[2] + parts[3] + parts[4];
      return phone;
    }
    if (parts[1]) {
      phone += "+7 (" + parts[1] + ") ";
    }
    phone += parts[2] + "-" + parts[3] + "-" + parts[4];
    return phone;
  } else {
    //invalid phone number
    return phonenum;
  }
};

export const urlThumbnail = (url, size = null) => {
    /**
     *  Changed instagram photo url, for crop image.
     *  Supports sizes: 150, 306, 480, 640 (width=height)
     *  if width and height not size, then will get original
     * @type {string} url
     * @type {number} size
     */
    var parser = document.createElement('a');
    parser.href = url;

    var source_path = parser.pathname.split('/');
    if (!size) {
      source_path.splice(2, 1);
    } else {
      source_path[2] = "s" + size + "x" + size;
    }
    var path = source_path.join("/");
    return parser.protocol + "//" + parser.host + path;
};
