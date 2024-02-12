import { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import SingleSelect from "../../../common/select/selects.component";
import { runValidation } from "../../../../utils/validation";
import Input from "../../../common/input/inputs.component";
import { setCommissionTypeDetails,setChangesMade,setInputErr,setRequiredErr } from "../../../../Redux/commissionTypeSlice";
import "../commissionType.scss";
const BasisCommissionType = (props) => {
  const dispatch = useDispatch();

  const { editDisabled, editEnabled } = useSelector((state) => state.commissionType);
  const { inputErr, requiredErr } = useSelector((state) => state.commissionType);
  const { commissionTypeDetails } = useSelector((state) => state.commissionType);
  const dispatchCommType = (object) => dispatch(setCommissionTypeDetails(object));
  const dispatchErr = (object) => dispatch(setInputErr(object));
  const dispatchChange = (object) => dispatch(setChangesMade(object));
  const dispatchReqErr = (object) => dispatch(setRequiredErr(object));
  const [isValid, setIsValid] = useState(true);


  const handleBasicInfoChange = (event, validProc = null) => {
    dispatchChange(true);
    const isValid = runValidation(validProc, event.target.value);
    let temp;
    if (event.target.value !== "") {
      temp = { ...requiredErr };
      delete temp[event.target.name];
      dispatchReqErr(temp);
    }
    dispatchCommType({ ...commissionTypeDetails, [event.target.name]: event.target.value });

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



  const commissionChange = (event, validProc = null) => {
    dispatchChange(true);

    dispatchCommType({ ...commissionTypeDetails, [event.target.name]: event.target.value });

    validateFields(event.target.marginFloor, event.target.value);

  };
 const validateFields = (a, b) => {
    const isValidInput = a !== '' && b !== '' && parseFloat(a) < parseFloat(b);
    setIsValid(isValidInput);
  };
  return !editEnabled ? (
    <>
      <div className="disabled-form-section small">
        <h3 className="disabled-form-section-header">Basic Information</h3>
        <div className="disabled-form-section-content">
          <span className="disabled-form-text">
            <span className="disabled-form-bold-text">Commision Type:</span>
            {commissionTypeDetails?.name},
          </span>

          <span className="disabled-form-align">
            <span className="disabled-form-bold-text">Commission Rate:</span>
            {commissionTypeDetails?.commRate} 
                  </span>

          <span className="disabled-form-align">
            <span className="disabled-form-bold-text">
            Margin Bracket ($):</span>
            {commissionTypeDetails?.commMargin}
          </span>

         
        </div>
    
      </div>
    </>
  ) : (
    <Fragment> 
      <h3 className="disabled-form-section-header">Basic Information</h3>
     
      <SingleSelect
                    type="text"
                    label="Commision Type"
                    name="name"
                    value={commissionTypeDetails?.name}
                    onChange={(e) => handleBasicInfoChange(e)}
                    options={[
                        {id: 1,  value: "Percentage", name: "Percentage"},
                    ]} 
                    required
                    disabled={!editEnabled}

                  />
                   <Input
                    type="text"
                    label="Commission Rate"
                    name="commRate"
                    className="align"
                    value={commissionTypeDetails?.commRate}
                    onChange={(e) => handleBasicInfoChange(e,"validateNum")}
                    errMssg={inputErr["commRate"]}
                    required
                    disabled={!editEnabled}
                  />
                  <div className="marginFloor">
                  <Input
                    type="text"
                    label="Margin Floor ($)"
                    name="marginFloor"
                    className="margin"
                    value={commissionTypeDetails?.marginFloor}
                    onChange={(e) => handleBasicInfoChange(e,"validateNum")}
                    errMssg={inputErr["marginFloor"]}
                    required
                    disabled={!editEnabled}

                  />
                 <div className="floor">-</div>
                   <Input
                    type="text"
                    label="Margin Ceiling ($)"
                    name="marginCeiling"
                    className="margin"
                    value={commissionTypeDetails?.marginCeiling}
                    onChange={(e) => commissionChange(e,"validateNum")}
                    errMssg={inputErr["marginCeiling"]}
                    required
                    disabled={!editEnabled}

                  />
         
        
</div>
{!isValid && (
          <p style={{ color: 'red',fontSize:"9px",paddingLeft:"35px" }}> * Please make sure margin Floor is less than margin Ceiling.</p>
        )}
         </Fragment>

  );
};

export default BasisCommissionType;