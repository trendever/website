export const formatDatetime = unixtime => {
  let date    = new Date( unixtime * 1000 );
  let minutes = '0' + date.getMinutes();

  return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()} ${date.getHours()}:${minutes.substr( -2 )}`;
};

export const formatTime = unixtime => formatDatetime( unixtime ).split( ' ' )[ 1 ];

export const formatPastTime = ( unixtime ) => {

  const diffUnixTime = Date.now() - parseInt( unixtime * 1000 );

  const second = parseInt( diffUnixTime / 1000 );
  const minute = parseInt( second / 60 );
  const hour   = parseInt( minute / 60 );
  const day    = parseInt( hour / 24 );
  const month  = parseInt( day / 30 );
  const year   = parseInt( month / 12 );

  if ( second <= 60 ) {
    return `${second} сек`;
  }

  if ( minute <= 60 ) {
    return `${minute} мин`;
  }

  if ( hour < 24 ) {

    if ( (hour === 1) || (hour === 21) ) {

      return `${hour} час`;

    }

    if ( (hour > 1 && hour <= 4) || (hour >= 22 && hour <= 23) ) {

      return `${hour} часа`;

    }

    return `${hour} часов`;

  }

  if ( day > 0 ) {

    if ( (day === 1) || (day === 21) || (day === 31) ) {

      return `${day} день`;

    }

    if ( (day >= 2 && day <= 4) || (day >= 22 && day <= 24) ) {

      return `${day} дня`;

    }

    if ( (day >= 5 && day <= 20) || (day >= 26 && day <= 30) ) {

      return `${day} дней`;

    }

  }

  if ( month > 0 ) {

    if ( month === 1 ) {

      return `${month} месяц`;

    }

    if ( month >= 2 && day <= 4 ) {

      return `${month} месяца`;

    }

    return `${month} месяцев`;

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

};

export const formatMonth = ( unixtime ) => {
  const date = new Date( unixtime * 1000 );
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

export const statusString = (type, value, customerName) => {

  if ( type === 'lead.state.date' ) {

    return formatMonth( value );

  }

  if ( type === 'lead.state.changed' ) {

    let name = null;

    switch ( value ) {
      case 'COMPLETED':
        name = 'Выполнен';
        break;
      case 'IN_PROGRESS':
        name = 'В процессе';
        break;
      case 'ON_DELIVERY':
        name = 'На доставке';
        break;
      case 'SUBMITTED':
        name = 'Подтверждён';
        break;
      case 'CANCELLED':
        name = 'Отменён';
        break;
    }

    if ( name === null ) {
      return name;
    }

    return `статус изменен на ${ name }`;

  }

  if ( type === 'suplier.called' ) {

    return `отправлено уведомление поставщику`;

  }

  if ( type === 'customer.called' ) {

    return `отправлено уведомление покупателю`;

  }

  if ( type === 'customer.phone.added' ) {

    return `${customerName} здесь впервые ;-)`;

  }


};
