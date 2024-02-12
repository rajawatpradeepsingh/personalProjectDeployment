import { Fragment, useEffect, useState,} from "react";
import { useSelector, useDispatch } from "react-redux";
import SingleSelect from "../../../../common/select/selects.component";
import Input from "../../../../common/input/inputs.component";
import * as addr from "../../../../../utils/serviceAddress";
import { setBasicInfo, setChangesMade,setInputErr } from "../../../../../Redux/workerSlice";
import { runValidation } from "../../../../../utils/validation";
const Address = () => {
  const dispatch = useDispatch();
  const [stateList, setStateList] = useState([]);
  // const countriesList = useSelector((state) => state.address.countriesList);
  const { editEnabled } = useSelector((state) => state.worker);
  const { basicInfo } = useSelector((state) => state.worker);
  const { inputErr,} = useSelector((state) => state.worker);
  const dispatchBasic = (object) => dispatch(setBasicInfo(object));
  const dispatchChange = (object) => dispatch(setChangesMade(object));
  const dispatchErr = (object) => dispatch(setInputErr(object));
  // const permanentCountryList = useSelector((state) => state.address.countriesList);
  const [permanentStateList, setPermanentStateList] = useState([]);
  const [countriesList, setCountriesList] = useState([]);
  const [permanentCountryList, setPermanentCountryList] = useState([]);

  useEffect(() => {
    setCountriesList(addr.getCountries());
    setPermanentCountryList(addr.getCountries());

  }, []);


  useEffect(() => {
    if (basicInfo?.address?.countryCode) {
      setStateList(addr.getStates(basicInfo.address.countryCode));
    
    }
    if (basicInfo?.permanentAddress?.permanentCountryCode) {
      setPermanentStateList(addr.getStates(basicInfo.permanentAddress.permanentCountryCode));
    
    
    }
  }, [basicInfo]);



  //handle address changes
  const handlePerAddressChange = (permanentAddressData) => {
    dispatchChange(true);
    dispatchBasic({
      ...basicInfo,
      permanentAddress: { ...basicInfo.permanentAddress, ...permanentAddressData },
    });
  };
  const handleAddressChange = (addressData) => {
    dispatchChange(true);
    dispatchBasic({
      ...basicInfo,
      address: { ...basicInfo.address, ...addressData },

    });
  };

  //handle country selection, updates state list and city list
  const countryChange = (e) => {
    const index = e.target.selectedOptions[0].index;
    const selected = index
      ? countriesList[e.target.selectedOptions[0].index - 1]
      : {};


    handleAddressChange({
      country: selected.name,
      countryCode: selected.code,
      state: "",
      stateCode: "",

    });
    setStateList(index ? addr.getStates(selected.code) : []);
  };  

  const PerCountryChange = (e) => {
    const index = e.target.selectedOptions[0].index;
    const selected = index
      ? permanentCountryList[e.target.selectedOptions[0].index - 1]
      : {};
       handlePerAddressChange({ 
        permanentCountry: selected.name,
        permanentCountryCode: selected.code,
        permanentState: "",
        permanentStateCode: "",
    });
     

  

    
    setPermanentStateList(index ? addr.getStates(selected.code) : []);
  };  

  const perStateChange = (e) => {
    const index = e.target.selectedOptions[0].index;
    const selected = index
      ? permanentStateList[e.target.selectedOptions[0].index - 1]
      : {};

    handlePerAddressChange({ 
        [e.target.name]: selected.name,
        permanentStateCode: selected.code,
    });




  };
  const stateChange = (e) => {
    const index = e.target.selectedOptions[0].index;
    const selected = index
      ? stateList[e.target.selectedOptions[0].index - 1]
      : {};


    handleAddressChange({
      [e.target.name]: selected.name,
      stateCode: selected.code,

    });

  };

  const cityChange = (e) => {
    handleAddressChange({
      [e.target.name]: e.target.value,
    });
  };

  const zipChange = (e, validProc = null) => {
    const isValid = runValidation(validProc, e.target.value);
    if (!isValid) {
      dispatchBasic({
        ...basicInfo,
        address: { [e.target.name]: e.target.value },
  
      });
      dispatchErr({
        ...inputErr,
        [e.target.name]: `Invalid format or characters`,
      });
    } else {
      let temp = { ...inputErr };
      delete temp[e.target.name];
      dispatchErr({ inputErr: temp });
      handleAddressChange({
      [e.target.name]: e.target.value,
    });}
  };

  const perZipChange = (e, validProc = null) => {
    const isValid = runValidation(validProc, e.target.value);
    if (!isValid) {
      dispatchBasic({
        ...basicInfo,
        permanentAddress: { [e.target.name]: e.target.value },
  
      });
      

      dispatchErr({
        ...inputErr,
        [e.target.name]: `Invalid format or characters`,
      });
    } else {
      let temp = { ...inputErr };
      delete temp[e.target.name];
      dispatchErr({ inputErr: temp });
      handlePerAddressChange({
      [e.target.name]: e.target.value,
    });}
  };


  const perCityChange = (e) => {
    handlePerAddressChange({
      [e.target.name]: e.target.value,
    });
  };

  
  const handleCheckBoxChange = event => {
   
    let val = event.target.checked;
    if (val) {     
        handlePerAddressChange({
        permanentStreet :basicInfo.address.addressLine1,
        permanentStreet1 :basicInfo.address.addressLine2,
        permanentCity: basicInfo.address.city,
        permanentCountry: basicInfo.address.country,
        permanentCountryCode:basicInfo.address.countryCode,
        permanentState: basicInfo.address.state,
        permanentStateCode:basicInfo.address.stateCode,
        permanentPostalCode :basicInfo.address.postalCode,
      
          });
           
    }
    else{
        handlePerAddressChange({
            permanentStreet :"",
            permanentStreet1 :"",

        permanentCity:"",
        permanentCountry: "",
        permanentCountryCode:"",
        permanentState: "",
        permanentStateCode:"",
        permanentPostalCode :"",
      
          });  
    }
    
  };

  return (
    <Fragment>
          <h3 className="disabled-form-section-header"> Current Address</h3>
          <div style={{display: "flex",alignItems: "center",marginRight: '19px', }}>
      <Input
        type="text"
        label="Street 1"
        name="addressLine1"
        value={basicInfo?.address?.addressLine1}
        onChange={cityChange}
        maxLength="200"
        required
        disabled={!editEnabled}
      />
        <Input
        type="text"
        label="Street 2"
        name="addressLine2"
        value={basicInfo?.address?.addressLine2}
        onChange={cityChange}
        maxLength="200"
        required
        disabled={!editEnabled}
      />
      <Input
        type="text"
        label="City"
        name="city"
        value={basicInfo?.address?.city || ""}
        placeholder="Select state for menu or enter city"
        onChange={cityChange}
        maxLength="40"
        autoComplete="off"
        disabled={!editEnabled}
        required
        errMssg={inputErr["city"]}
      />
      <SingleSelect
        label="Country"
        name="country"
        value={basicInfo?.address?.country}
        onChange={countryChange}
        options={countriesList}
        disabled={!editEnabled}
        required
      />
      <SingleSelect
        label="State/Province"
        name="state"
        value={basicInfo?.address?.state || ""}
        onChange={stateChange}
        options={stateList}
        disabled={
          !editEnabled ||
          (!basicInfo?.address?.country && stateList?.length === 0)
        }
      />
</div>
<div style={{display: "flex",alignItems: "center",marginRight: '19px', }}>


      <Input
        type="text"
        label="ZIP Code/ Postal Code"
        name="postalCode"
        value={basicInfo?.address?.postalCode||""}
        //onChange={cityChange}
        onChange={(e) => zipChange(e, "validateZip")}
        errMssg={inputErr["postalCode"]}
        required
        maxLength="6"
        disabled={!editEnabled}
      />

</div>

<h3 className="disabled-form-section-header"> Permanent Address  
                (  <input type="checkbox"  disabled={!editEnabled} onClick={handleCheckBoxChange} />  <label 
                   style={{
                  fontSize: "15px",
                  marginBottom: "4px",
                  color: "var(--secondary)",
                }}
                  >Same as Current Address</label>  )  
             
             </h3>
 <div style={{display: "flex",alignItems: "center",marginRight: '19px', }}>

      <Input
        type="text"
        label="Street 1"
        name="permanentStreet"
        value={basicInfo?.permanentAddress?.permanentStreet}
        onChange={perCityChange}
        maxLength="200"
        required
        disabled={!editEnabled}
      />
      
      <Input
        type="text"
        label="Street 2"
        name="permanentStreet1"
        value={basicInfo?.permanentAddress?.permanentStreet1}
        onChange={perCityChange}
        maxLength="200"
        required
        disabled={!editEnabled}
      />
      <Input
        type="text"
        label="City"
        name="permanentCity"
        value={basicInfo?.permanentAddress?.permanentCity|| ""}
        placeholder="Select state for menu or enter city"
        onChange={perCityChange}
        maxLength="40"
        autoComplete="off"
        disabled={!editEnabled}
        required
        errMssg={inputErr["permanentCity"]}
      />
      <SingleSelect
        label="Country"
        name="permanentCountry"
        value={basicInfo?.permanentAddress?.permanentCountry || ""}
        onChange={PerCountryChange}
        options={permanentCountryList}
        disabled={!editEnabled}
        required
      />
       <SingleSelect
        label="State/Province"
        name="permanentState"
        value={basicInfo?.permanentAddress?.permanentState || ""}
        onChange={perStateChange}
        options={permanentStateList}
        disabled={
          !editEnabled 
        }
      />
      </div>
      <div style={{display: "flex",alignItems: "center",marginRight: '19px', }}>
     

      {/* <Input
        type="text"
        label="ZIP Code/Postal Code"
        name="permanentPostalCode"
        value={basicInfo?.permanentAddress?.permanentPostalCode || ""}
        onChange={perCityChange}
        required
        maxLength="6"
        disabled={!editEnabled}
      />  */}

<Input
        type="text"
        label="ZIP Code"
        name="permanentPostalCode"
        value={basicInfo?.permanentAddress?.permanentPostalCode || ""}
        onChange={(e) => perZipChange(e, "validateZip")}
        //onChange={cityChange}
        maxLength="6"
        disabled={!editEnabled}
        required
        errMssg={inputErr["permanentPostalCode"]}
      />
      </div>
    </Fragment>
  );
};

export default Address;