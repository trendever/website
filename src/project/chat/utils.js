export const formatDatetime = unixtime => {
  let date = new Date(unixtime * 1000);
  let minutes = "0" + date.getMinutes();

  return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()} ${date.getHours()}:${minutes.substr(-2)}`;
};

export const formatTime = unixtime => formatDatetime(unixtime).split(' ')[1];