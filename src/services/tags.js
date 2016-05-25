import channel from 'services/channel/channel.js';

export const LIMIT = 40;

export const find = ({is_main = true, limit = LIMIT, tags = []}) => {
  is_main = !is_main ? is_main : !tags.length;

  return channel
    .req('retrieve', 'tag', {is_main, limit, tags})
    .then(data => (data.response_map && data.response_map.object_list) || [])
    .catch(err => { console.log(err) });
};