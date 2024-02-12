import { useState, useEffect } from 'react';
import * as addr from "../../../utils/serviceAddress";
import SingleSelect from "../select/selects.component";
import Input from "../input/inputs.component";
import './style.scss';

export const AddressSelect = (props) => {
   const [countries, setCountries] = useState([]);
   const [states, setStates] = useState([]);
   const [cities, setCities] = useState([]);
   const [selectedCountry, setSelectedCountry] = useState({});
   const [selectedState, setSelectedState] = useState({});

   useEffect(() => setCountries(addr.getCountries()), []);

   useEffect(() => {
      if (props.countryCode) setStates(addr.getStates(props.countryCode));
      if (props.countryCode && props.stateCode) setCities(addr.getCities(props.countryCode, props.stateCode))
   }, [props.countryCode, props.stateCode]);

   useEffect(() => {
      if (!props.country && !props.state && !props.city) {
        setStates([]);
        setCities([]);
      }
   }, [props.country, props.state, props.city])

   const handleChange = (e) => {
      const { name, selectedOptions, value } = e.target;
      switch (name) {
         case "country" :
            const countryObj = countries.length ? countries[selectedOptions[0]?.index - 1] : null;
            if (countryObj) {
               setSelectedCountry({ country: countryObj.name, code: countryObj.code});
               props.handleAddressChange({
                 country: { country: countryObj.name, code: countryObj.code },
                 state: { state: "", stateCode: ""},
                 city: ""
               });
               setStates(addr.getStates(countryObj.code));
               setSelectedState({});
               setCities([]);
            }
            break;
         case "state": 
            const stateObj = states.length ? states[selectedOptions[0]?.index - 1] : null;
            if (stateObj) {
               setSelectedState({ state: stateObj.name, code: stateObj.code });
               props.handleAddressChange({
                 country: { country: props.country ? props.country : selectedCountry.country, code: props.countryCode ? props.countryCode : selectedCountry.code },
                 state: { state: stateObj.name, code: stateObj.code },
                 city: "",
               });
               setCities(
                 addr.getCities(
                   props.countryCode ? props.countryCode : selectedCountry.code,
                   stateObj.code
                 )
               );
            } else {
              setSelectedState({ state: value, code: "" });
               props.handleAddressChange({
                 country: { country: props.country ? props.country : selectedCountry.country, code: props.countryCode ? props.countryCode : selectedCountry.code },
                 state: { state: value, code: "" },
                 city: "",
               });
               setCities([]);
            }
            break;
         case "city":
            props.handleAddressChange({
               country: { country: props.country ? props.country : selectedCountry.country, code: props.countryCode ? props.countryCode : selectedCountry.code },
               state: { state: props.state ? props.state : selectedState.state, code: props.stateCode ? props.stateCode : selectedState.code },
               city: value
            });
            break;
         default :
            break;
         
      }
   }

   return (
     <>
       <SingleSelect
         label="Country"
         name="country"
         value={props.country || ""}
         onChange={handleChange}
         placeholder="Select Country"
         options={countries}
         required={props.requiredCountry}
         disabled={props.disabled}
       />
       {!states.length ? (
         <Input
           label="State / Province"
           name="state"
           value={props.state || ""}
           onChange={handleChange}
           placeholder="Enter State/Province"
           required={props.requiredCountry}
           disabled={props.disabled}
           info="Select country for options or enter state name"
         />
       ) : (
         <SingleSelect
           label="State / Province"
           name="state"
           value={props.state || ""}
           onChange={handleChange}
           options={states}
           placeholder="Select State/Province"
           required={props.requiredCountry}
           disabled={props.disabled}
         />
       )}
       {!cities.length ? (
         <Input
           type="text"
           label="City"
           name="city"
           value={props.city || ""}
           info="Select state for options or enter city name"
           onChange={(e) => handleChange(e, "validateName")}
           maxLength="40"
           required={props.requiredCity}
           disabled={props.disabled}
         />
       ) : (
         <SingleSelect
           label="City"
           name="city"
           value={props.city || ""}
           onChange={handleChange}
           options={cities}
           placeholder="Select City"
           required={props.requiredCity}
           disabled={props.disabled}
         />
       )}
     </>
   );
};
