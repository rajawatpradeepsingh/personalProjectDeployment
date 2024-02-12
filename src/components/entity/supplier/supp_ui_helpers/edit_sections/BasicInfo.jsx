import { useEffect, useState,useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import Input from "../../../../common/input/inputs.component";
import { setBasicInfo, setChangesMade, setRequiredErr, setInputErr } from "../../../../../Redux/supplierSlice";
import SingleSelect from "../../../../common/select/selects.component";
import { InputPhone } from "../../../../common/input/input-phone/input-phone.component";
import * as addr from "../../../../../utils/serviceAddress";
import { runValidation } from "../../../../../utils/validation";
import MultiSelect from "../../../../common/select/multiSelect/multiSelect.component";
import { delDict, getDict } from "../../../../../API/dictionaries/dictionary-apis";
import { postDict } from "../../../../../API/dictionaries/dictionary-apis";
import auth from "../../../../../utils/AuthService";

const BasicInfo = () => {
  const dispatch = useDispatch();
  const [headers] = useState(auth.getHeaders());
  const { basicInfo } = useSelector((state) => state.supplier);
  const { editEnabled } = useSelector((state) => state.supplier);
  const { inputErr, requiredErr } = useSelector((state) => state.supplier);
  const dispatchBasic = (object) => dispatch(setBasicInfo(object));
  const dispatchChange = (object) => dispatch(setChangesMade(object));
  const dispatchErr = (object) => dispatch(setInputErr(object));
  const dispatchReqErr = (object) => dispatch(setRequiredErr(object));
  const [disableCities, setdisableCities] = useState(false);
  const [citiesList, setCitiesList] = useState([]);
  const [countriesList, setCountriesList] = useState([]);
  const [companyNameDict, setCompanyNameDict] = useState([]);
  const [designationDict, setdesignationDict] = useState([]);
  const [stateList, setStateList] = useState([]);

  const getDicts = useCallback(async () => {
    const response = {};
    response.prime = await getDict("supplierCompanyName", headers);
    response.secondary= await getDict("designation", headers);
    return response;
  }, [headers]);


  //call get get dictionaries on page load
  useEffect(() => {
    let isCancelled = false;
    const fetchData = async () => {
      try {
        const dictionaries = await getDicts();
        if (Object.keys(dictionaries).length) {
          if (!isCancelled) {
            setCompanyNameDict(dictionaries.prime);
            setdesignationDict(dictionaries.secondary)
          }
        }
      } catch (e) {
        if (!isCancelled) {
          console.log(e);
        }
      }
    };
    fetchData();
    //cleanup function:
    return () => (isCancelled = true);
  }, [getDicts]);

  

  


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
      setdisableCities(basicInfo.address?.stateCode ? false : citiesAmount > 100);
    }
  }, [basicInfo]);

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
    dispatchBasic({ ...basicInfo, phone_no: value });
  };

  const multiSelectChange = (options, resource, parent = null) => {
    const selected = options
      .filter((o) => o.selected)
      .map((o) => o.value)
      .join(",");

    let resName = resource;
    if (resource === "supplierCompanyName") resName = "supplierCompanyName";
    if(resource === "designation") resName = "designation";

    const change = { target: { name: resName, value: selected || "" } };
    if (parent === "basicInfo") {
      handleBasicInfoChange(change);
    }
    else {
      handleBasicInfoChange(change);
    }

    // call add API for new / TODO: decompose and make as new function /
    options
      .filter((o) => !o.id && !o.isDeleted)
      .forEach((o) => {
        postDict(resource, o.value, headers)
          .then((res) => {
            if (resource === "supplierCompanyName")
              setCompanyNameDict([...companyNameDict, res]);
            if( resource === "designation")
               setdesignationDict([...designationDict, res]);
          })
          .catch((err) => console.log(err));
      });

    // call delete API for marked as deleted
    options
      .filter((o) => o.isDeleted)
      .forEach((o) => {
        delDict(o.id, headers).catch((err) => console.log(err));
      });
    const delList = options.filter((o) => !o.isDeleted);
    if (resource === "supplierCompanyName") setCompanyNameDict(delList);
    if (resource === "designation") setdesignationDict(delList);
  };

  const handlePhoneError = (error) => {
    if (error) {
      setInputErr({ ...inputErr, phone_no: true });
    } else {
      let temp = { ...inputErr };
      delete temp["phone_no"];
      setInputErr(temp);
    }
  };

  const handleAddressChange = (addressData) => {
    dispatchChange(true);
    dispatchBasic({
      ...basicInfo,
      address: { ...basicInfo.address, ...addressData },
    });
  };

  return (
    <>
      <h3 className="disabled-form-section-header"> Basic Information</h3>

      <MultiSelect
        label="Supplier"
        options={companyNameDict.map((o) => ({
              id: o.id,
              value: o.value,
              label: o.value,
              selected: basicInfo?.supplierCompanyName?.includes(o.value),
            }))}
            handleChange={(e) =>
              multiSelectChange(e, "supplierCompanyName", "basicInfo")
            }
            creatable
            isMulti
            disabled={!editEnabled}
          />
          <MultiSelect
        label="Title"
        options={designationDict.map((o) => ({
              id: o.id,
              value: o.value,
              label: o.value,
              selected: basicInfo?.designation?.includes(o.value),
            }))}
            handleChange={(e) =>
              multiSelectChange(e, "designation", "basicInfo")
            }
            creatable
            isMulti
            disabled={!editEnabled}
          />
       
      <h3 className="disabled-form-section-header"> Contact</h3>

      {!editEnabled ? (
        <Input
          label="Name"
          readOnly
          value={`${basicInfo?.firstName} ${basicInfo?.lastName}`}
        />
      ) : (
        <>
          <Input
            type="text"
            label="First Name"
            name="firstName"
            value={basicInfo?.firstName || ""}
            onChange={(e) => handleBasicInfoChange(e, "validateName")}
            maxLength="40"
            required
            disabled={!editEnabled}
            errMssg={inputErr["firstName"]}
          />
          <Input
            type="text"
            label="Last Name"
            name="lastName"
            value={basicInfo?.lastName || ""}
            onChange={(e) => handleBasicInfoChange(e, "validateName")}
            maxLength="40"
            disabled={!editEnabled}
            errMssg={inputErr["lastName"]}
          />
        </>
      )}

      <Input
        type="email"
        label="Email"
        name="email"
        value={basicInfo?.email || ""}
        onChange={(e) => handleBasicInfoChange(e, "validateEmail")}
        required
        disabled={!editEnabled}
        errMssg={inputErr["email"]}
      />

      <InputPhone
        label="Phone Num."
        phoneNumber={basicInfo?.phone_no || ""}
        handleChange={handlePhoneChange}
        disabled={!editEnabled}
        setError={handlePhoneError}
      />

      <Input
        type="text"
        label="Website"
        name="website"
        value={basicInfo?.website || ""}
        onChange={(e) => handleBasicInfoChange(e, "validateURL")}
        errMssg={inputErr["website"]}
        disabled={!editEnabled}
      />
      <SingleSelect
        name="status"
        label="Status"
        type="status"
        id="status"
        onChange={(e) => handleBasicInfoChange(e)}
        value={basicInfo?.status}
        options={[
          { id: 1, value: "ACTIVE", name: "Active" },
          { id: 2, value: "INACTIVE", name: "Inactive" },
        ]}
        disabled={!editEnabled}
      />
      <h3 className="disabled-form-section-header"> Address</h3>

      <SingleSelect
        label="Country"
        name="country"
        value={basicInfo?.address?.country || ""}
        onChange={countryChange}
        placeholder="Select Country"
        options={countriesList}
        disabled={!editEnabled}
        
      
      />

      <SingleSelect
        placeholder="Select state"
        label="State / Province"
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
          onChange={handleBasicInfoChange}
          maxLength="40"
          autoComplete="off"
          disabled={!editEnabled}
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
        disabled={!editEnabled}
      />

      <Input
        type="text"
        label="ZIP Code"
        name="postalCode"
        value={basicInfo?.address?.postalCode}
        onChange={(e) => zipChange(e, "validateZip")}
        //onChange={cityChange}
        maxLength="6"
        disabled={!editEnabled}
        errMssg={inputErr["postalCode"]}
      />
    </>
  );
};

export default BasicInfo;