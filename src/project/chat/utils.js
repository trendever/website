export const formatDatetime = unixtime => {
  let date = new Date(unixtime * 1000);
  let minutes = '0' + date.getMinutes();

  return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()} ${date.getHours()}:${minutes.substr(-2)}`;
};

export const formatTime = unixtime => formatDatetime(unixtime).split(' ')[1];

export const formatPastTime = (unixtime) => {
  const dateLast = new Date(unixtime * 1000);
  const dateNow = new Date(Date.now());

  /**
   * Позже сделаю как объект и проверять буду в цикле.
   * */

  let seconds = dateNow.getSeconds() - dateLast.getSeconds();
  let minutes = dateNow.getMinutes() - dateLast.getMinutes();
  let hours = dateNow.getHours() - dateLast.getHours();
  let days = dateNow.getDay() - dateLast.getDay();
  let month = dateNow.getMonth() - dateLast.getMonth();
  let year = dateNow.getFullYear() - dateLast.getFullYear();

  if (seconds < 0) {
    seconds = 0
  }
  if (minutes < 0) {
    minutes = 0
  }
  if (hours < 0) {
    hours = 0
  }
  if (days < 0) {
    days = 0
  }
  if (month < 0) {
    month = 0
  }
  if (year < 0) {
    year = 0
  }

  if (year > 0) {
    if (year === 1) {
      return `${year} год`;
    }
    if (year > 1 && year <= 4) {
      return `${year} года`;
    }
    return `${year} лет`;
  }
  if (month > 0) {
    if (month === 1) {
      return `${month} месяц`;
    }
    if (month > 1 && month <= 4) {
      return `${month} месяца`;
    }
    return `${month} месяцев`;
  }
  if (days > 0) {
    if (days === 1) {
      return `${days} день`;
    }
    if (days > 1 && days <= 4) {
      return `${days} дня`;
    }
    return `${days} дней`;
  }
  if (hours > 0) {
    if (hours === 1) {
      return `${hours} час`;
    }
    if (hours > 1 && hours <= 4) {
      return `${hours} часа`;
    }
    return `${hours} часов`;
  }
  if (minutes > 0) {
    return `${minutes} мин`;
  }

  return `${seconds} сек`;
};

export const formatMonth = (unixtime) => {
  const date = new Date(unixtime * 1000);
  return `${date.getDay()} ${
    {
      '1': 'января',
      '2': 'февраля',
      '3': 'марта',
      '4': 'апреля',
      '5': 'мая',
      '6': 'июня',
      '7': 'июля',
      '8': 'августа',
      '9': 'сентября',
      '10': 'октября',
      '11': 'ноября',
      '12': 'декабря'
    }[date.getMonth()]
    }`;
};

export const escapeHtml = (string) => {
  return String(string).replace(/[&<>''`=\/]/g, function fromEntityMap(s) {

    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      '`': '&#x60;',
      '=': '&#x3D;'
    };
    if (s in map) {
      return map[s]
    }
    return s;
  });
};

export const wrapLink = (text) => {

  if (/(http|https|ftp)/.test(text)) {

    const re = /([^\"=]{2}|^)((https?|ftp):\/\/\S+[^\s.,> )\];'\"!?])/;
    const subst = '$1<a class="link link_primary" href="$2" target="_blank">$2</a>';
    return text.replace(re, subst);

  }

  const arr = text.split('.');

  for (let i = arr.length; i; i--) {

    if (arr[i - 1].length === 0) {
        return text;
    }

  }

  if (arr.length > 1) {

    return `<a class="link link_primary" href="http://${text}" target="_blank">${text}</a>`;

  }

  return text;

};
