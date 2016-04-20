/* globals getCookie, setCookie, removeCookie */

var prefix = '_te_';

var Storage = getStorage();
var cachedProfile = getProfile();

export function getProfile() {
  if (cachedProfile) {
    return cachedProfile;
  }

  var profile = {
    uid: Storage.getItem('uid'),
    token: Storage.getItem('token'),
    first_visit_at: Storage.getItem('first_visit_at'),
    last_visit_at: Storage.getItem('last_visit_at'),
    isSubscribedEmail: Storage.getItem('isSubscribedEmail'),
    subscribe_at: Storage.getItem('subscribe_at'),
  };

  // if first visit
  if (!profile.uid) {
    profile = createProfile();
    profile.isFirstVisit = true;
  } else {
    profile.isFirstVisit = false;
  }

  if (!profile.token) {
    profile.isAuthorized = false;
  } else {
    profile.isAuthorized = true;
  }

  Storage.setItem('last_visit_at', (new Date()).getTime());
  cachedProfile = profile;

  return profile;
}

export function createProfile() {

  var uid = window.guid();
  var first_visit_at = (new Date()).getTime();

  Storage.setItem('uid', uid);
  Storage.setItem('first_visit_at', first_visit_at);

  return getProfile();
}

export function getStorage() {
    return new CookieStorage();
}

export function CookieStorage() {
  this.setItem = (name, value) => setCookie(`${prefix}${name}`, value, 1095);
  this.getItem = (name) => getCookie(`${prefix}${name}`);
  this.removeItem = removeCookie;
}

export function setSubscribeEmail(flag) {
  Storage.setItem('isSubscribedEmail', flag);
  Storage.setItem('subscribe_at', (new Date()).getTime());
}

export function setToken(token) {
  Storage.setItem('token', token);
}

/**
 * profile user
 * @type {string} uid - инднтификатор юзера
 * @type {string} token - токен авторизации
 * @type {timestamp} first_visit_at - время первого посещения
 * @type {timestamp} last_visit_at  - время последненго посещения
 * @type {boolean} isFirstVisit - флаг, индефицирующий первое посещение
 * @type {boolean} isSubscribedEmail - флаг, индефицирующий подписку, true - подписан
 * @type {timestamp} subscribe_at - время согласия/несогласия с подпиской
 * @ return {object}
 */
export default cachedProfile;
