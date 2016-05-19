export const formatDatetime = unixtime => {
  let date = new Date(unixtime * 1000);
  let minutes = "0" + date.getMinutes();

  return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()} ${date.getHours()}:${minutes.substr(-2)}`;
};

export const formatTime = unixtime => formatDatetime(unixtime).split(' ')[1];

export const formatPastTime = ( unixtime ) => {
  const dateLast = new Date( unixtime * 1000 );
  const dateNow  = new Date( Date.now() );
  const minutes = dateNow.getMinutes() - dateLast.getMinutes();
  const hours   = dateNow.getHours() - dateLast.getHours();
  const days    = dateNow.getDay() - dateLast.getDay();
  const month   = dateNow.getMonth() - dateLast.getMonth();
  const year    = dateNow.getFullYear() - dateLast.getFullYear();
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
};