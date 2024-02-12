import { Country, State, City } from "country-state-city";

// Old, do not use
export const getCountryByCode = (countryCode, countryList) => {
  let country = countryList?.find((item) => item.id === countryCode) || {};
  return country;
};

// Old, do not use
export const getStateByCode = (stateCode, stateList) => {
  let state = stateList?.find((item) => item.id === stateCode) || {};
  return state;
};

export const getCountries = () => {
  return Country.getAllCountries().map((c) => ({
    //id: c.isoCode,
    id: c.name,
    code: c.isoCode,
    name: c.name,
  }));
};

export const getStatesByCountry = (countryCode) => {
  return State.getStatesOfCountry(countryCode);
};

export const getStates = (countryCode) => {
  return State.getStatesOfCountry(countryCode).map((s) => ({
    //id: s.isoCode,
    id: s.name,
    code: s.isoCode,
    name: s.name,
    country: s.countryCode,
  }));
};

export const getCitiesByCountry = (countryCode) => {
  return City.getCitiesOfCountry(countryCode);
};

export const getCitiesByCountryAndState = (countryCode, stateCode) => {
  return City.getCitiesOfState(countryCode, stateCode);
};

export const getCities = (countryCode, stateCode = null) => {
  return stateCode
    ? getCitiesByCountryAndState(countryCode, stateCode).map((c, index) => ({
        //id: `${index}_${c.stateCode}`,
        id: c.name,
        name: c.name,
        state: c.stateCode,
      }))
    : getCitiesByCountry(countryCode).map((c, index) => ({
        //id: `${index}_${c.stateCode}`,
        id: c.name,
        name: c.name,
        state: c.stateCode,
      }));
};

export const getCitiesAmount = (countryCode) => {
  return City.getCitiesOfCountry(countryCode).length;
};
