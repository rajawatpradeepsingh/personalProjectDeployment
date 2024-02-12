import { Fragment, useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import auth from "../../../../../utils/AuthService";
import MultiSelect from "../../../../common/select/multiSelect/multiSelect.component";
import SingleSelect from "../../../../common/select/selects.component";
import Check from "../../../../common/checkbox/checkbox.component";
import Input from "../../../../common/input/inputs.component";
import { InputPhone } from "../../../../common/input/input-phone/input-phone.component";
import * as addr from "../../../../../utils/serviceAddress";
import { getAllRecruiters } from "../../../../../API/users/user-apis";
import { gender } from "../../../../../utils/defaultData";
import { runValidation } from "../../../../../utils/validation";
import { candidateStatus } from "../../../../../utils/defaultData";
import { setBasicInfo, setChangesMade } from "../../../../../Redux/candidateSlice";
import { setInputErr, setRequiredErr } from "../../../../../Redux/candidateSlice";
import { delDict, getDict } from "../../../../../API/dictionaries/dictionary-apis";
import { postDict } from "../../../../../API/dictionaries/dictionary-apis";

const BasicInfo = (props) => {
  const dispatch = useDispatch();
  const [recruiters, setRecruiters] = useState([]);
  const [workAuthStatusDict, setWorkAuthStatusDict] = useState([]);
  const [sourceDict, setSourceDict] = useState([]);
  const [isSuspicious, setIsSuspicious] = useState({});
  const [stateList, setStateList] = useState([]);
  const [citiesList, setCitiesList] = useState([]);
  const [disableCities, setdisableCities] = useState(false);

  const countriesList = useSelector((state) => state.address.countriesList);
  const { editEnabled } = useSelector((state) => state.candidate);
  const { basicInfo } = useSelector((state) => state.candidate);
  const { inputErr, requiredErr } = useSelector((state) => state.candidate);
  const [headers] = useState(auth.getHeaders());
  const [user] = useState(auth.getUserInfo());
  const [userIsAdmin] = useState(auth.hasAdminRole());
  const [userIsRecruiter] = useState(auth.hasRecruiterRole());

  const dispatchBasic = (object) => dispatch(setBasicInfo(object));
  const dispatchErr = (object) => dispatch(setInputErr(object));
  const dispatchReqErr = (object) => dispatch(setRequiredErr(object));
  const dispatchChange = (object) => dispatch(setChangesMade(object));

  const { handleRequiredCheck } = props;

  //get dictionary options for menus
  const getDicts = useCallback(async () => {
    const response = {};
    response.workAuth = await getDict("workAuthStatus", headers);
    response.sources = await getDict("source", headers);
    return response;
  }, [headers]);

  //get country, state and city options for menus
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

  //call get get dictionaries on page load
  useEffect(() => {
    let isCancelled = false;
    const fetchData = async () => {
      try {
        const dictionaries = await getDicts();
        if (Object.keys(dictionaries).length) {
          if (!isCancelled) {
            setWorkAuthStatusDict(dictionaries.workAuth);
            setSourceDict(dictionaries.sources);
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

  //call get recruiters on page load
  useEffect(() => {
    let isCancelled = false;

    if (!userIsRecruiter) {
      getAllRecruiters(headers, user.roles[0]?.roleName)
        .then(res => {
          if (res.statusCode === 200) {
            if (!isCancelled) {
              setRecruiters(
                res.recruiters.map((recruiter) => ({
                  id: recruiter.id,
                  name: `${recruiter.firstName} ${recruiter.lastName}`,
                }))
              );
            }
          }
        })
        .catch(err => {
          if (!isCancelled) {
            console.log(err);
          }
        })
    }
    //cleanup function:
    return () => (isCancelled = true);
  }, [headers, user.roles, userIsRecruiter]);

  //check is candidate suspicious
  useEffect(() => {
    if (basicInfo?.isSuspicious) setIsSuspicious({ isSuspicious: true });
  }, [basicInfo?.isSuspicious]);

  // handle changes to candidates basic information
  const handleBasicInfoChange = (event, validProc = null) => {
    dispatchChange(true);
    const isValid = runValidation(validProc, event.target.value);
    let temp;
    if (event.target.value !== "") {
      temp = { ...requiredErr };
      delete temp[event.target.name];
      dispatchReqErr(temp);
    }

    if (event.target.name === "recruiter")
      dispatchBasic({ ...basicInfo, recruiter: { id: +event.target.value } });
    else
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

  //handle multiselect changes
  const multiSelectChange = (options, resource, parent = null) => {
    const selected = options
      .filter((o) => o.selected)
      .map((o) => o.value)
      .join(",");

    let resName = resource;
    const change = { target: { name: resName, value: selected || "" } };
    handleBasicInfoChange(change);

    // call add API for new /* TODO: decompose and make as new function */
    options
      .filter((o) => !o.id && !o.isDeleted)
      .forEach((o) => {
        postDict(resource, o.value, headers)
          .then((res) => {
            if (resource === "source") setSourceDict([...sourceDict, res]);
            if (resource === "workAuthStatus")
              setWorkAuthStatusDict([...workAuthStatusDict, res]);
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
    if (resource === "source") setSourceDict(delList);
    if (resource === "workAuthStatus") setWorkAuthStatusDict(delList);
  };

  //handle phone number changes
  const handlePhoneChange = (value) => {
    dispatchBasic({ ...basicInfo, phoneNumber: value });
  };

  //set error in state for phone errors
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

  //handle address changes
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

  const checkIsSuspicious = (value) => {
    setIsSuspicious(value);
    dispatchBasic({
      ...basicInfo,
      isSuspicious: Object.keys(value).length ? true : null,
    });
  };

  return (
    <Fragment>
      <SingleSelect
        label="Status"
        required
        disabled={!editEnabled}
        name="status"
        value={basicInfo?.status}
        onChange={handleBasicInfoChange}
        options={candidateStatus.map((status) => ({
          id: status,
          name: status,
        }))}
      />
      {editEnabled ? (
        <Check
          name="isSuspicious"
          id="isSuspicious"
          setCheckedList={checkIsSuspicious}
          checkedList={isSuspicious}
          label="Flag as Suspicious"
          style={{ textAlign: "left", paddingLeft: "3px", marginBottom: "8px" }}
          disabled={!editEnabled}
          className="red"
        />
      ) : (
        <Input
          readOnly
          label="Suspicious"
          value={basicInfo.isSuspicious ? "Yes" : "No"}
        />
      )}
      {!userIsRecruiter && (
        <SingleSelect
          label="Recruiter"
          name="recruiter"
          value={basicInfo?.recruiter?.id}
          onChange={handleBasicInfoChange}
          onBlur={handleRequiredCheck}
          options={recruiters}
          required
          disabled={!editEnabled}
          errMssg={requiredErr["recruiter"]}
        />
      )}
      {editEnabled && (
        <>
          <Input
            label="First Name"
            type="text"
            name="firstName"
            value={basicInfo?.firstName}
            onChange={(e) => handleBasicInfoChange(e, "validateName")}
            onBlur={handleRequiredCheck}
            required
            disabled={!editEnabled}
            errMssg={inputErr["firstName"] || requiredErr["firstName"]}
          />
          <Input
            label="Last Name"
            type="text"
            name="lastName"
            value={basicInfo?.lastName}
            onChange={(e) => handleBasicInfoChange(e, "validateName")}
            onBlur={handleRequiredCheck}
            required
            disabled={!editEnabled}
            errMssg={inputErr["lastName"] || requiredErr["lastName"]}
          />
        </>
      )}
      <Input
        label="Email"
        type="email"
        name="email"
        value={basicInfo?.email}
        onChange={(e) => handleBasicInfoChange(e, "validateEmail")}
        onBlur={handleRequiredCheck}
        required
        disabled={!editEnabled}
        errMssg={inputErr["email"] || requiredErr["email"]}
      />
      <InputPhone
        phoneNumber={basicInfo?.phoneNumber}
        handleChange={handlePhoneChange}
        label="Phone Num."
        disabled={!editEnabled}
        setError={handlePhoneError}
      />
      <SingleSelect
        label="Gender"
        name="gender"
        value={basicInfo?.gender}
        onChange={handleBasicInfoChange}
        onBlur={handleRequiredCheck}
        options={gender.map((g) => {
          return { id: g, name: g };
        })}
        disabled={!editEnabled}
        required
        errMssg={requiredErr["gender"]}
      />
      <MultiSelect
        label="Work Auth Status"
        disabled={!editEnabled}
        options={workAuthStatusDict.map((o) => ({
          id: o.id,
          value: o.value,
          label: o.value,
          selected: basicInfo?.workAuthStatus === o.value,
        }))}
        handleChange={(e) => multiSelectChange(e, "workAuthStatus")}
        creatable
        deletable={userIsAdmin}
        required
      />
      <Input
        label="LinkedIn Profile"
        type="text"
        name="linkedinProfile"
        value={basicInfo?.linkedinProfile}
        onChange={(e) => handleBasicInfoChange(e, "validateURL")}
        errMssg={inputErr["linkedinProfile"]}
        disabled={!editEnabled}
      />
      <Input
        label="Portfolio"
        type="text"
        name="portfolioProfile"
        value={basicInfo?.portfolioProfile}
        onChange={(e) => handleBasicInfoChange(e, "validateURL")}
        errMssg={inputErr["portfolioProfile"]}
        disabled={!editEnabled}
      />
      <MultiSelect
        label="Source"
        disabled={!editEnabled}
        options={sourceDict.map((o) => ({
          id: o.id,
          value: o.value,
          label: o.value,
          selected: basicInfo?.source === o.value,
        }))}
        handleChange={(e) => multiSelectChange(e, "source")}
        creatable
        deletable={userIsAdmin}
      />
      {(basicInfo?.source === "Referral" ||
        basicInfo?.source === "Vendor" ||
        basicInfo?.source === "Sourcer") && (
          <Input
            type="text"
            label="Referral Name"
            name="referralName"
            value={basicInfo?.referralName}
            onChange={handleBasicInfoChange}
            disabled={!editEnabled}
          />
        )}
      <SingleSelect
        label="Willing to Relocate"
        name="relocate"
        value={basicInfo.relocate || ""}
        onChange={handleBasicInfoChange}
        options={[
          { id: "Yes", value: "Yes", name: "Yes" },
          { id: "No", value: "No", name: "No" },
        ]}
        disabled={!editEnabled}
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
    </Fragment>
  );
};

export default BasicInfo;
