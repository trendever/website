import channel from "services/channel/channel.js"

export default function (log_list, request_map,
                         trans_map, callback) {
  /**
   *  @param {array}  log_list
   *  @param {object} request_map
   *  @param {number} request_map.id
   *  @param {number} request_map.limit
   *  @param {number} request_map.offset
   *  @param {object} trans_map
   */

  channel.req(
    "retrieve",
    "product",
    log_list,
    request_map,
    trans_map,
    callback)
}