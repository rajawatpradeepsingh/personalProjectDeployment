import { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Input from "../../../../common/input/inputs.component";
import { InputPhone } from "../../../../common/input/input-phone/input-phone.component";
import SingleSelect from "../../../../common/select/selects.component";
import * as addr from "../../../../../utils/serviceAddress";
import { runValidation } from "../../../../../utils/validation";
import { setBasicInfo, setChangesMade } from "../../../../../Redux/clientSlice";
import { setInputErr, setRequiredErr } from "../../../../../Redux/clientSlice";

const BasicInfo = (props) => {
  const dispatch = useDispatch();
  const [stateList, setStateList] = useState([]);
  const [citiesList, setCitiesList] = useState([]);
  const [disableCities, setdisableCities] = useState(false);
  const { editDisabled, editEnabled } = useSelector((state) => state.client);
  const { inputErr, requiredErr } = useSelector((state) => state.client);
  const { basicInfo } = useSelector((state) => state.client);
 // const countriesList = useSelector((state) => state.address.countriesList);
 const [countriesList, setCountriesList] = useState([]);
  const dispatchBasic = (object) => dispatch(setBasicInfo(object));
  const dispatchErr = (object) => dispatch(setInputErr(object));
  const dispatchChange = (object) => dispatch(setChangesMade(object));

  const dispatchReqErr = (object) => dispatch(setRequiredErr(object));
  useEffect(() => {
    setCountriesList(addr.getCountries());

  }, []);

  useEffect(() => {
    if (basicInfo?.address?.countryCode) {
      setStateList(addr.getStates(basicInfo.address.countryCode));
      const citiesAmount = addr.getCitiesAmount(basicInfo.address.countryCode);
      if (basicInfo.address?.stateCode)
        setCitiesList(
          addr.getCities(
            basicInfo.address.countryCode,
            basicInfo.address.stateCode
          )
        );
      setdisableCities(
        basicInfo.address?.stateCode ? false : citiesAmount > 100
      );
    }
  }, [basicInfo]);

  const handleBasicInfoChange = (event, validProc = null) => {
    dispatchChange(true);
    const isValid = runValidation(validProc, event.target.value);
    let temp;
    if (event.target.value !== "") {
      temp = { ...requiredErr };
      delete temp[event.target.name];
      dispatchReqErr(temp);
    }
    dispatchBasic({ ...basicInfo, [event.target.name]: event.target.value });

    if (!isValid) {
      dispatchErr({
        ...inputErr,
        [event.target.name]: `Invalid format or characters`,
      });
    } else {
      temp = { ...inputErr };
      delete temp[event.target.name];
      dispatchErr(temp);
    }
  };

  const handlePhoneChange = (value) => {
    dispatchBasic({ ...basicInfo, phoneNumber: value });
  };

  const handlePhoneError = (error) => {
    if (error) {
      dispatchErr({
        ...inputErr,
        phoneNumber: true,
      });
    } else {
      let temp = { ...inputErr };
      delete temp["phoneNumber"];
      dispatchErr(temp);
    }
  };

  const handleAddressChange = (addressData) => {
    dispatchChange(true);
    dispatchBasic({
      ...basicInfo,
      address: { ...basicInfo.address, ...addressData },
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

  const countryChange = (e) => {
    const index = e.target.selectedOptions[0].index;
    const selected = index
      ? countriesList[e.target.selectedOptions[0].index - 1]
      : {};

    let cities = [];
    if (index) cities = addr.getCities(selected.code);
    handleAddressChange({
      country: selected.name,
      countryCode: selected.code,
      state: "",
      stateCode: "",
      city: "",
    });
    setStateList(index ? addr.getStates(selected.code) : []);
    setCitiesList(index ? addr.getCities(selected.code) : []);
    setdisableCities(index ? cities?.length > 100 : false);
  };

  const stateChange = (e) => {
    const index = e.target.selectedOptions[0].index;
    const selected = index
      ? stateList[e.target.selectedOptions[0].index - 1]
      : {};

    let cities = [];
    if (index) {
      cities = addr.getCities(basicInfo.address?.countryCode, selected.code);
      setdisableCities(false);
    } else {
      cities = addr.getCities(basicInfo.address?.countryCode);
      setdisableCities(cities?.length > 100);
    }
    handleAddressChange({
      [e.target.name]: selected.name,
      stateCode: selected.code,
      city: "",
    });
    setCitiesList(cities);
  };

  const cityChange = (e) => {
    handleAddressChange({
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Fragment>
      <h3 className="disabled-form-section-header">Basic Information</h3>
      <Input
        type="text"
        label="Client Name"
        name="clientName"
        value={basicInfo?.clientName}
        onChange={(e) => handleBasicInfoChange(e, "validateName")}
        maxLength="20"
        required
        errMssg={inputErr["clientName"]}
        disabled={!editDisabled}
      />
      <h3 className="disabled-form-section-header">Contact</h3>
      <InputPhone
        phoneNumber={basicInfo?.phoneNumber}
        handleChange={handlePhoneChange}
        label="Phone Num."
        disabled={!editDisabled}
        setError={handlePhoneError}
      />
      <Input
        type="text"
        label="Website"
        name="website"
        value={basicInfo?.website}
        onChange={(e) => handleBasicInfoChange(e, "validateURL")}
        errMssg={inputErr["website"]}
        disabled={!editDisabled}
      />
      <h3 className="disabled-form-section-header">Address</h3>
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
          (!basicInfo?.address.country && stateList.length === 0)
        }
      />
      {citiesList.length > 0 ? (
        <SingleSelect
          label="City"
          name="city"
          value={basicInfo?.address?.city || ""}
          onChange={cityChange}
          options={citiesList}
          required
          guide={disableCities ? "Select a state/province" : ""}
          disabled={!editEnabled}
        />
      ) : (
        <Input
          type="text"
          label="City"
          name="city"
          value={basicInfo?.address?.city || ""}
          placeholder="Select state for menu or enter city"
          onChange={(e) => handleBasicInfoChange(e, "validateName")}
          maxLength="40"
          autoComplete="off"
          disabled={!editEnabled}
          required
          errMssg={inputErr["city"]}
        />
      )}
      <Input
        type="text"
        label="Address Line 1"
        name="addressLine1"
        value={basicInfo?.address?.addressLine1}
        onChange={cityChange}
        maxLength="200"
        required
        disabled={!editEnabled}
      />
      <Input
        type="text"
        label="Address Line 2"
        name="addressLine2"
        maxLength="200"
        value={basicInfo?.address?.addressLine2}
        onChange={cityChange}
        disabled={!editEnabled}
      />
      <Input
        type="text"
        label="Address Line 3"
        name="addressLine3"
        maxLength="200"
        value={basicInfo?.address?.addressLine3}
        onChange={cityChange}
        disabled={!editEnabled}
      />
      <Input
        type="text"
        label="ZIP Code"
        name="postalCode"
        value={basicInfo?.address?.postalCode}
        //onChange={cityChange}
        onChange={(e) => zipChange(e, "validateZip")}
        maxLength="6"
        required
        errMssg={inputErr["postalCode"]}
        disabled={!editEnabled}
      />
    </Fragment>
  );
};

export default BasicInfo;