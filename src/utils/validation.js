// Entry
export const runValidation = (procName, value, limit = null) => {
  const procArray = Array.isArray(procName) ? procName : [procName];
  return procArray.some((proc) => {
    switch (proc) {
      case "validateEmail":
        return validateEmail(value);
      case "validateName":
        
        return validateName(value);
        case "validateHours":
          return validateHours(value);
      case "validatePhone":
        return validatePhone(value);
      case "validateZip":
        return validateZip(value);
      case "validateURL":
        return validateURL(value);
      case "validateInt":
        return validateInt(value, limit);
      case "validateNum":
        return validateNum(value, limit);
      case "validateHasAlphabet":
        return validateHasAlphabet(value);
      case "validateHasDecimal":
        return validateHasDecimal(value);
      case "validatePrecentage":
        return validatePrecentage(value);
      case "validateHasAlpha":
        return validateHasAlpha(value);
        case "validateRoleName":
          return validateRoleName(value);
          case "validateTwoNumber":
            return validateTwoNumber(value);
      default:
        return true;
    }
  });
};

// Email validattion
// correct:   aa-bb.cc12-34.23@ggg-12.12-3.com
// incorrect: aa--.@12..-.12-3.
export const validateEmail = (value) => {
  let regex;
  let isValid = true;
  if (value.length >= 3) {
    regex =
      /^(?!^[0-9])([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/;
    isValid = regex.test(value);
  } else {
    regex =
      /^[A-Za-z0-9]+([a-zA-Z0-9]*[-._](?![-._]))*[a-zA-Z0-9]*@([A-Za-z]+[0-9]*)*([-._](?![-._])[a-zA-Z0-9]*)*[.]?[A-Za-z]{0,3}$/gi;
    isValid = regex.test(value);
  }
  return !value.length ? true : isValid;
};

// Name validattion
export const validateName = (value) => {
  const regex = /^([A-Za-z]+[- ]?[A-Za-z]*)*$/gi;
  return regex.test(value);
};
export const validateHours = (value) => {
  const regex = /^((?:[0-9]|1[0-9]|2[0-3])(?:\.\d{1,2})?|24(?:\.00?)?)$/;
  return regex.test(value);
};
// roleName validattion
export const validateRoleName = (value) => {
  const regex = /[^a-zA-Z]/gi;
  return regex.test(value);
};

// Phone validattion
export const validatePhone = (value) => {
  const regex =
    // /^([+]? | [0-9]*)[0-9]{1,3}((?<=[0-9]{3})-|(?<=[0-9]{4})-)[0-9]*$/gi;
    /^\+?[0-9]*$/gi;
  return regex.test(value);
};

// Zip code
export const validateZip = (value) => {
  const regex = /^[a-z0-9]+$/i;
  return value.length ? regex.test(value) : true;
};

// URL validation
export const validateURL = (value) => {
  const regex =
    /^(http(s?):\/\/)?[0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*\.[a-zA-Z]+(\/?)([a-zA-Z0-9\-.?,'/\\+=&;%$#_]*)?$/gi;
  // /^[htps]{0,5}((?<=http(s)?):)?((?<=:)[/])?((?<=\/)[/])?(\w*((?<=\w)[-./](?![-./]))?((?<=\/|\w*)\?(?!\?))?(\w|[&%=])*)*$/gi;
  return regex.test(value);
};

// Integer validation
export const validateInt = (value, limit = 0) => {
  const regex = /^[0-9]+$/gi;
  const overLimit = limit && +value > limit;
  return regex.test(value) && !overLimit;
};

// Number validation
export const validateNum = (value, limit = 0) => {
  const regex = /^\d{1,10}([.]?(?=[.])\d{0,2})?$/gi;
  const overLimit = limit && +value > limit;
  return regex.test(value) && !overLimit;
};

// HasAlphabet validation
export const validateHasAlphabet = (value) => {
  const regex = /^.*[a-zA-Z]{1,}[\s\S]*$/gi;
  return regex.test(value);
};
export const validateHasDecimal = (value) => {
  // const regex = /^[0-9]+\.[0-9]{2}?$/gi;
  const regex = /^\d{1,9}(,\d{10})*(\.\d+)?$/gi;
  return regex.test(value);
};
export const validateHasAlpha = (value) => {
  const regex = /^[A-Z0-9 _]*[A-Z0-9][A-Z0-9 _]*$/gi;
  return regex.test(value);
};

export const validatePrecentage = (value) => {
  const regex = /^(\d{0,2}(\.\d{1,2})?|100(\.00?)?)$/gi;
  return regex.test(value);
};
export const validateTwoNumber = (value, limit = 0) => {
  const regex = /^[0-9]*-[0-9]+$/gi;
  const overLimit = limit && +value > limit;
  return regex.test(value) && !overLimit;
};
