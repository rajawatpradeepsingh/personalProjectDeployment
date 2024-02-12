import moment from "moment-timezone";
import AuthService from "./AuthService";

// Current timezone
export const currentTZ = () => Intl.DateTimeFormat().resolvedOptions().timeZone;

// Parse time if datetime was passed
export const parseTime = (time) => {
  return /[T]/.test(time) ? time.split("T")[1] : time;
};

// UTC Date
export const getUTCData = (date, time) => {
  const dateLocal = new Date(`${date} ${time}`);
  const dateUTC = new Date(dateLocal.toUTCString());
  const YY = dateUTC.getUTCFullYear();
  const MM = dateUTC.getUTCMonth() + 1;
  const DD = dateUTC.getUTCDate();
  return `${YY}-${MM < 10 ? "0" + MM : MM}-${DD < 10 ? "0" + DD : DD}`;
};

// UTC time
export const getUTCTime = (date, time) => {
  const dateUTC = new Date(`${date} ${time}`);
  const HH = dateUTC.getUTCHours();
  const MI = dateUTC.getUTCMinutes();
  return `${HH < 10 ? "0" + HH : HH}:${MI < 10 ? "0" + MI : MI}:00`;
};

export const getUTCdateTime = (date, time) => {
  const dateUTC = getUTCData(date, time);
  const timeUTC = getUTCTime(date, time);
  return new Date(`${dateUTC} ${timeUTC} UTC`).toISOString();
};

//Current Date
export const getCurrentDate = () => {
  const current = new Date();
  const year = current.getFullYear();
  const month = current.getMonth() + 1;
  const day = current.getDate();
  return `${year}-${month < 10 ? `0${month}` : `${month}`}-${
    day < 10 ? `0${day}` : `${day}`
  }`;
};

// get current date for zoned dateTime
export const getDate = (date, time, timeZone, format) => {
  try {
    return moment
      .tz(new Date(`${date} ${time}`), timeZone || currentTZ())
      .format(format || "YYYY-MM-DD");
  } catch {
    return new Date(`${getUTCData(date, time)}`);
  }
};

// get zoned dateTime: for example, for America/New_York it's 2023-06-30T14:57:00-04:00
export const getDateTime = (date, time, timeZone) => {
  try {
    return moment
      .tz(new Date(`${date} ${time}`), timeZone || currentTZ())
      .format();
  } catch {
    return getUTCdateTime(date, time);
  }
};

//Current time
export const getCurrentTime = (skipSeconds = false) => {
  const time = new Date();
  const hour = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  return `${hour < 10 ? `0${hour}` : hour}:${
    minutes < 10 ? `0${minutes}` : minutes
  } ${skipSeconds ? "" : `:${seconds < 10 ? `0${seconds}` : seconds}`}`;
};

// local Date
export const getLocalDate = (date, time) => {
  const parsedTime = parseTime(time);
  const datetimeUTC = `${date} ${parsedTime} GMT`;
  const dateTime = new Date(datetimeUTC);
  const YY = dateTime.getFullYear();
  const MM = dateTime.getMonth() + 1;
  const DD = dateTime.getDate();
  return `${YY}-${MM < 10 ? "0" + MM : MM}-${DD < 10 ? "0" + DD : DD}`;
};

// local time
export const getLocalTime = (date, time) => {
  const parsedTime = parseTime(time);
  const datetimeUTC = `${date} ${parsedTime} GMT`;
  const dateTime = new Date(datetimeUTC);
  const HH = dateTime.getHours();
  const MI = dateTime.getMinutes();
  return `${HH < 10 ? "0" + HH : HH}:${MI < 10 ? "0" + MI : MI}:00`;
};

// local date from zoned datetime "2023-06-30T14:57:00-04:00"
export const getLocalDateFromDatetime = (datetime, format = null) => {
  const localDateTime = moment(datetime).toDate();
  const formatted = format
    ? moment(localDateTime).format(format)
    : localDateTime.toLocaleDateString();
  return formatted;
};

// local time from zoned datetime "2023-06-30T14:57:00-04:00"
export const getLocalTimeFromDatetime = (datetime, hour24 = false) => {
  const local = moment(datetime).toDate();
  return hour24
    ? local.toLocaleTimeString([], { hour12: false })
    : local.toLocaleTimeString();
};

export const displayTime = (datetime) => {
  return moment(datetime)
    .toDate()
    .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

// TODO: make universe functions. Currently used by zoom module
// local date from UTC datetime
export const getLocalDatefromUTC = (datetime) => {
  const dateTime = new Date(datetime);
  const YY = dateTime.getFullYear();
  const MM = dateTime.getMonth() + 1;
  const DD = dateTime.getDate();
  return `${YY}-${MM < 10 ? "0" + MM : MM}-${DD < 10 ? "0" + DD : DD}`;
};

// TODO: make universe functions. Currently used by zoom module
// local time from UTC datetime
export const getLocalTimefromUTC = (datetime) => {
  const dateTime = new Date(datetime);
  const HH = dateTime.getHours();
  const MI = dateTime.getMinutes();
  return `${HH < 10 ? "0" + HH : HH}:${MI < 10 ? "0" + MI : MI}:00`;
};

// diff between date1 and date2
export const datesDiff = (date1Str, date2Str) => {
  const dateOne = new Date(date1Str);
  const dateTwo = new Date(date2Str);
  return dateTwo - dateOne;
};

//format phone number (US)
export const formatPhoneNumber = (number) => {
  let num = number.replace(/\D/g, "").replace(/^1/, "");
  num = num.substring(0, 10);
  return num.replace(
    /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
    "+1($1) $2-$3"
  );
};

export const formatPhone = (prefix, number) => {
  let num = number.replace(/\D/g, "");
  let formattedNum;
  if (prefix === "+1") {
    if (num.length === 0) {
      formattedNum = num;
    } else if (num.length < 4) {
      formattedNum = `(${num}`;
    } else if (num.length < 7) {
      formattedNum = `(${num.substring(0, 3)}) ${num.substring(3, 6)}`;
    } else {
      formattedNum = `(${num.substring(0, 3)}) ${num.substring(
        3,
        6
      )}-${num.substring(6, 10)}`;
    }
  } else if (prefix === "+91") {
    if (num.length < 6) {
      formattedNum = num;
    } else if (num.length < 9) {
      formattedNum = `${num.substring(0, 5)}-${num.substring(5, 10)}`;
    } else {
      formattedNum = `${num.substring(0, 5)}-${num.substring(5, 10)}`;
    }
  }
  return formattedNum;
};

export const sortAscending = (key, list) => {
  let keys = [];
  if (key.includes(".")) {
    keys = key.split(".");
  }
  let unsorted = [...list];
  let sorted = [];
  if (keys.length) {
    sorted = unsorted.sort((a, b) => {
      if (a[keys[0]][keys[1]] > b[keys[0]][keys[1]]) return 1;
      if (a[keys[0]][keys[1]] < b[keys[0]][keys[1]]) return -1;
      return 0;
    });
  } else {
    sorted = unsorted.sort((a, b) => {
      if (a[key] > b[key]) return 1;
      if (a[key] < b[key]) return -1;
      return 0;
    });
  }
  return sorted;
};

//sort descending
export const sortDescending = (key, list) => {
  let keys = [];
  if (key.includes(".")) keys = key.split(".");
  let unsorted = [...list];
  let sorted = [];
  if (keys.length) {
    sorted = unsorted.sort((a, b) => {
      if (a[keys[0]][keys[1]] < b[keys[0]][keys[1]]) return 1;
      if (a[keys[0]][keys[1]] > b[keys[0]][keys[1]]) return -1;
      return 0;
    });
  } else {
    sorted = unsorted.sort((a, b) => {
      if (a[key] < b[key]) return 1;
      if (a[key] > b[key]) return -1;
      return 0;
    });
  }
  return sorted;
};

export const errLogout = (err) => {
  if (err.response && err.response.status === 401) AuthService.logout();
};

export const getFullName = (entity) => {
  return `${entity?.firstName} ${entity?.lastName}`;
};

export const getAddress = (entity) => {
  const city = entity?.city ? entity.city : "";
  const state = entity?.state ? `, ${entity.state}` : "";
  const country = entity?.country ? `, ${entity.country}` : "";
  return `${city}${state}${country}`;
};

// get value from object by complex path: object["value"], object["entity.subpath.name"] etc
export const getValueByNestedPath = (object, path) => {
  const keys = path.split(".");
  let value = object;

  for (const key of keys) {
    if (value && value.hasOwnProperty(key)) {
      value = value[key];
    } else {
      value = undefined;
      break;
    }
  }
  return value;
};
