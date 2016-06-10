export const formatDatetime = unixtime => {
  let date    = new Date( unixtime * 1000 );
  let minutes = '0' + date.getMinutes();

  return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()} ${date.getHours()}:${minutes.substr( -2 )}`;
};

export const formatTime = unixtime => formatDatetime( unixtime ).split( ' ' )[ 1 ];

export const formatPastTime = ( unixtime ) => {
  const dateLast = new Date( parseInt( unixtime * 1000 ) );
  const dateNow  = new Date( Date.now() );

  /**
   * Позже сделаю как объект и проверять буду в цикле.
   * */

  let seconds = dateNow.getSeconds() - dateLast.getSeconds();
  let minutes = dateNow.getMinutes() - dateLast.getMinutes();
  let hours   = dateNow.getHours() - dateLast.getHours();
  let days    = dateNow.getDate() - dateLast.getDate();
  let month   = dateNow.getMonth() - dateLast.getMonth();
  let year    = dateNow.getFullYear() - dateLast.getFullYear();

  if ( seconds < 0 ) {
    seconds = 0
  }
  if ( minutes < 0 ) {
    minutes = 0
  }
  if ( hours < 0 ) {
    hours = 0
  }
  if ( days < 0 ) {
    days = 0
  }
  if ( month < 0 ) {
    month = 0
  }
  if ( year < 0 ) {
    year = 0
  }

  if ( year > 0 ) {
    if ( year === 1 ) {
      return `${year} год`;
    }
    if ( year > 1 && year <= 4 ) {
      return `${year} года`;
    }
    return `${year} лет`;
  }
  if ( month > 0 ) {
    if ( month === 1 ) {
      return `${month} месяц`;
    }
    if ( month > 1 && month <= 4 ) {
      return `${month} месяца`;
    }
    return `${month} месяцев`;
  }
  if ( days > 0 ) {
    if ( days === 1 ) {
      return `${days} день`;
    }
    if ( days > 1 && days <= 4 ) {
      return `${days} дня`;
    }
    return `${days} дней`;
  }
  if ( hours > 0 ) {
    if ( hours === 1 ) {
      return `${hours} час`;
    }
    if ( hours > 1 && hours <= 4 ) {
      return `${hours} часа`;
    }
    return `${hours} часов`;
  }
  if ( minutes > 0 ) {
    return `${minutes} мин`;
  }

  return `${seconds} сек`;
};

export const formatMonth = ( unixtime ) => {
  const date = new Date( unixtime );
  return `${date.getDate()} ${
    {
      '0': 'января',
      '1': 'февраля',
      '2': 'марта',
      '3': 'апреля',
      '4': 'мая',
      '5': 'июня',
      '6': 'июля',
      '7': 'августа',
      '8': 'сентября',
      '9': 'октября',
      '10': 'ноября',
      '11': 'декабря'
    }[ date.getMonth() ]
    }`;
};

export const escapeHtml = ( string ) => {
  return String( string ).replace( /[&<>''`=\/]/g, function fromEntityMap( s ) {

    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      '`': '&#x60;',
      '=': '&#x3D;'
    };
    if ( s in map ) {
      return map[ s ]
    }
    return s;
  } );
};

export const wrapLink = ( text ) => {

  const shortURL = /^(https?:\/\/)?([\w\.]+)\.([a-z]{2,6}\.?)(\/[\w\.]*)*\/?$/;

  if ( shortURL.test( text ) ) {

    const link     = (/(http|https|ftp)/.test( text )) ? text : `http://${ text }`;
    const linkName = text.replace( /(http:\/\/|https:\/\/|ftp:\/\/|www.)/, '' );

    return `<a class="link link_primary" href="${ link }" target="_blank">${ linkName }</a>`;

  }

  const emailRE = /^([a-z0-9_\.-]+)@([a-z0-9_\.-]+)\.([a-z\.]{2,6})$/;

  if ( emailRE.test( text ) || text.indexOf( 'mailto:' ) !== -1 ) {

    let link     = `mailto:${text}`;
    let linkName = text;

    if ( text.indexOf( 'mailto:' ) !== -1 ) {

      link     = text;
      linkName = text.substr( text.indexOf( ':' ) + 1, text.length );

    }

    return `<a class="link link_primary" href="${ link }" target="_blank">${ linkName }</a>`;

  }

  const longURL = /[a-zA-Z][-a-zA-Z0-9+.]+:\/\/(\w+:.+@)?[^ "<>@]+(:[0-9]+)?\/?(\w*)?\/?(\?\w+)?(#\w)?/;

  if ( longURL.test( text ) ) {

    return `<a class="link link_primary" href="${ text }" target="_blank">${ text }</a>`;

  }

  const wwwURL = /(www)(.*)/;

  if ( wwwURL.test( text ) ) {

    return `<a class="link link_primary" href="http://${ text }" target="_blank">${ text }</a>`;

  }

  return text;

};
