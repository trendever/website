import channel from "services/channel/channel.js";

export const ERROR_CODES = {
  NOT_FOUND: 1,
  SERVER_ERROR: 2,
};

/**
 * List of products
 * @param {number} options.offset  !(Deprecated) count products of top of list
 * @param {number} options.limit  limit list (default: 9)
 * @param {number} options.from_id  product id for offset
 * @param {number} options.direction  sorting direction (true=asc, false=desc)
 * @param {number} options.user_id  user mentioned or liked products
 * @param {string} options.user_instagram_name  user mentioned or liked products
 * @param {number} options.shop_id  shop products
 * @param {string} options.shop_instagram_name  shop products
 * @param {string} options.q      search in title of products.items
 * @param {number|array} options.tags   products which have tags ids
 *
 * RESOLVE
 *   {
 *     "count": 1,
 *     "object_list": [
 *        {
 *          "id": 16154,
 *          "title": "Трикотажный топ с цветочным узором",
 *          "code": "tf8276",
 *          "instagram_image_caption": "Последний цветочный топ джерси размер М. Доставка по МСК бесплатная.  #maybe#maybespace#maybesale",
 *          "instagram_image_id": "1220922723815723851",
 *          "instagram_image_url": "https://scontent.cdninstagram.com/t51.2885-15/s640x640/sh0.08/e35/12383420_977019085721689_1440543230_n.jpg?ig_cache_key=MTIyMDkyMjcyMzgxNTcyMzg1MQ%3D%3D.2",
 *          "instagram_link": "https://www.instagram.com/p/BDxlr-jPRNL/",
 *          "instagram_published_at": -62135596800,
 *          "supplier": {},
 *          "mentioned_id": 3093,
 *          "mentioned": {
 *            "id": 3093,
 *            "instagram_id": 1328901077,
 *            "instagram_username": "rush.x",
 *            "instagram_fullname": "Ann",
 *            "instagram_avatar_url": "http://scontent.cdninstagram.com/t51.2885-19/s150x150/12797972_964243070312823_1112795527_a.jpg"
 *          },
 *          "isSale": true,
 *          "items": [
 *            {
 *              "price": 1500,
 *              "tags": [
 *                {
 *                  "id": 3,
 *                  "name": "аудитория"
 *                },
 *                {
 *                  "id": 7,
 *                  "name": "рисунок"
 *                },
 *              ]
 *            }
 *          ]
 *        }
 *     ]
 *   }
 *
 * REJECT (one of ERROR_CODES)
 */
export function find({ limit, offset, from_id, direction,
                       q, tags,
                       user_id, user_instagram_name,
                       shop_id, shop_instagram_name }) {

  return new Promise( (resolve, reject) => {

    channel.req("search", "product", { limit, offset, from_id, direction,
                                       q, tags,
                                       user_id, user_instagram_name,
                                       shop_id, shop_instagram_name })
    .then( data => {

        resolve(data.response_map);

    }).catch( error => {

      console.error("products Find", error);
      reject(ERROR_CODES.SERVER_ERROR);

    });

  });
}


/**
 * Get product
 * @param {number} id User id
 *
 * RESOLVE
 *   {
 *     "id": 16154,
 *     "title": "Трикотажный топ с цветочным узором",
 *     "code": "tf8276",
 *     "instagram_image_caption": "Последний цветочный топ джерси размер М. Доставка по МСК бесплатная.  #maybe#maybespace#maybesale",
 *     "instagram_image_id": "1220922723815723851",
 *     "instagram_image_url": "https://scontent.cdninstagram.com/t51.2885-15/s640x640/sh0.08/e35/12383420_977019085721689_1440543230_n.jpg?ig_cache_key=MTIyMDkyMjcyMzgxNTcyMzg1MQ%3D%3D.2",
 *     "instagram_link": "https://www.instagram.com/p/BDxlr-jPRNL/",
 *     "instagram_published_at": -62135596800,
 *     "supplier": {},
 *     "mentioned_id": 3093,
 *     "mentioned": {
 *       "id": 3093,
 *       "instagram_id": 1328901077,
 *       "instagram_username": "rush.x",
 *       "instagram_fullname": "Ann",
 *       "instagram_avatar_url": "http://scontent.cdninstagram.com/t51.2885-19/s150x150/12797972_964243070312823_1112795527_a.jpg"
 *     },
 *     "isSale": true,
 *     "items": [
 *       {
 *         "price": 1500,
 *         "tags": [
 *           {
 *             "id": 3,
 *             "name": "аудитория"
 *           },
 *           {
 *             "id": 7,
 *             "name": "рисунок"
 *           },
 *         ]
 *       }
 *     ]
 *   }
 *
 * REJECT (one of ERROR_CODES)
 */
export function get(id) {

  return new Promise( (resolve, reject) => {

    channel.req("retrieve", "product", {id})
    .then( data => {

        if (data.response_map.count > 0) {
          resolve(data.response_map.object_list[0]);
        } else {
          reject(ERROR_CODES.NOT_FOUND);
        }

    }).catch( error => {

      console.error("products Get", error);
      reject(ERROR_CODES.SERVER_ERROR);

    });

  });
}