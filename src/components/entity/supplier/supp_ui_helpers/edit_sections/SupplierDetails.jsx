import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setBasicInfo, setChangesMade, setRequiredErr, setInputErr } from "../../../../../Redux/supplierSlice";
import SingleSelect from "../../../../common/select/selects.component";
import Input from "../../../../common/input/inputs.component";
import { runValidation } from "../../../../../utils/validation";
import moment from "moment";
import ms from "ms";

const SupplierDetails = () => {
  const dispatch = useDispatch();
  const dispatchErr = (object) => dispatch(setInputErr(object));
  const { inputErr, requiredErr } = useSelector((state) => state.supplier);
  const dispatchReqErr = (object) => dispatch(setRequiredErr(object));
  const dispatchChange = (object) => dispatch(setChangesMade(object));
  const [minDate, setMinDate] = useState(null);
  const { editEnabled } = useSelector((state) => state.supplier);
  const dispatchBasic = (object) => dispatch(setBasicInfo(object));
  const { basicInfo } = useSelector((state) => state.supplier);

  const handleChange = (e, validProc = null) => {
    const limit = e.target.max ? +e.target.max : null;
    const isValid = runValidation(validProc, e.target.value, limit);
    const isDeleted = e.target.value === "";
    dispatchBasic({
      ...basicInfo,
      [e.target.name]: e.target.value,
    });

    if (!isValid) {
      setInputErr({ ...inputErr, [e.target.name]: "Invalid characters" });
    } else if (isValid || isDeleted) {
      let temp = { ...inputErr };
      delete temp[e.target.name];
      setInputErr(temp);
    }
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

  useEffect(() => {
    const day = ms("1d");
    const min_date = new Date(+new Date(basicInfo?.contractStartDate) + day);
    setMinDate(moment(min_date).format("YYYY-MM-DD"));
  }, [basicInfo?.contractStartDate]);

  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      <h3 className="disabled-form-section-header"> Tax Details</h3>
      <Input
        type="text"
        label="Net Terms"
        name="netTerms"
        value={basicInfo?.netTerms || ""}
        onChange={(e) => handleBasicInfoChange(e, "validateNum")}
        errMssg={inputErr["netTerms"]}
        disabled={!editEnabled}
      />

      <SingleSelect
        label="W-8Ben"
        name="w8Bene"
        value={basicInfo?.w8Bene || ""}
        onChange={(e) => handleBasicInfoChange(e)}
        options={[
          { id: "Yes", value: "Yes", name: "Yes" },
          { id: "No", value: "No", name: "No" },
          { id: "Pending", value: "Pending", name: "Pending" },
        ]}
        disabled={!editEnabled}
      />
      <SingleSelect
        label="D-590"
        name="d590"
        value={basicInfo?.d590 || ""}
        onChange={(e) => handleBasicInfoChange(e)}
        options={[
          { id: "Yes", value: "Yes", name: "Yes" },
          { id: "No", value: "No", name: "No" },
          { id: "Pending", value: "Pending", name: "Pending" },
        ]}
        disabled={!editEnabled}
      />

      <SingleSelect
        label="W-9"
        name="w9"
        value={basicInfo?.w9 || ""}
        onChange={(e) => handleBasicInfoChange(e)}
        options={[
          { id: "Yes", value: "Yes", name: "Yes" },
          { id: "No", value: "No", name: "No" },
          { id: "Pending", value: "Pending", name: "Pending" },
        ]}
        disabled={!editEnabled}
      />
      <SingleSelect
        label="A-1099"
        name="a1099"
        value={basicInfo?.a1099 || ""}
        onChange={(e) => handleBasicInfoChange(e)}
        options={[
          { id: "Yes", value: "Yes", name: "Yes" },
          { id: "No", value: "No", name: "No" },
          { id: "Pending", value: "Pending", name: "Pending" },
        ]}
        disabled={!editEnabled}
      />

      <Input
        type="date"
        label="Certificate Of Insurance"
        name="certificateOfInsurance"
        onChange={(e) => handleBasicInfoChange(e)}
        value={basicInfo?.certificateOfInsurance || ""}
        max="2999-12-31"
        disabled={!editEnabled}
        errMssg={inputErr["certificateOfInsurance"]}
      />

      <h3 className="disabled-form-section-header">Contract Details</h3>

      <Input
        name="contractStartDate"
        label="Contract Start Date"
        id="contractStartDate"
        type="date"
        max="2999-12-31"
        onChange={(e) => handleChange(e)}
        value={basicInfo?.contractStartDate || ""}
        disabled={!editEnabled}
      />
      <Input
        name="contractEndDate"
        label="Contract End Date"
        id="contractEndDate"
        type="date"
        min={minDate}
        max="2999-12-31"
        onChange={(e) => handleChange(e)}
        value={basicInfo?.contractEndDate || ""}
        disabled={!editEnabled}
      />
    </div>
  );
};

export default SupplierDetails;
