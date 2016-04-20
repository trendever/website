var w = window;

export function createQuestion(model) {
  this.$emit('hide:question');
  var {type, email, comment = ''} = model;

  w.channel.model.request(
    "create", "email", [],
    {type, email, comment}, {},
    resp => {
      if (resp.log_list[0] && resp.log_list[0].code_key == "201") {
        this.$emit('show:thanks');
      } else {
        this.$emit('show:error');
        w.topError(resp.log_list[0].code_str, resp.log_list[0].user_msg);
      }
    }
  )
}

export function createOpportunity(model) {
  this.$emit('hide:opportunity');
  var {id, email, comment, phone} = model;
  // regular expression, the resolution in the phone: '+().- '
  phone = phone.replace(/\(|\)|-|\+|\s|\./g,'');
  phone = '7' + phone.slice(1);

  w.channel.model.request(
    "create", "opportunity", [],
    {id, email, comment, phone}, {},
    resp => {
      if (resp.log_list[0] && resp.log_list[0].code_key == "201") {
        this.$emit('show:thanks');
      } else {
        this.$emit('show:error');
        w.topError(resp.log);
      }
    }
  )
}

export function getFromCache(id) {
  id = parseInt(id);
  if (w.photos && w.photos.length) {
    for (var i = 0; i < w.photos.length; i++) {
      var photo = w.photos[i];
      if (photo.ID === id) {
        return photo;
      }
    }
  }
  return false
}
