import {  useSelector ,useDispatch} from "react-redux";
import { Fragment, useCallback, useState } from "react";
import { setParameterDetails } from "../../../../Redux/parameterSlice";
import { runValidation } from "../../../../utils/validation";
import Input from "../../../common/input/inputs.component";
import "../param.css"
const BasicInfoParameter = () => {
  const { parameterDetails } = useSelector((state) => state.parameter);
  const [formDisabled] = useState(false);
  const { editEnabled } = useSelector((state) => state.parameter);
  const [inputErr, setInputErr] = useState({});
  const dispatch = useDispatch();
  


  const dispatchParameterDetails = useCallback(
    (object) => dispatch(setParameterDetails(object)),
    [dispatch]
  );

   const handleChange = (e, validProc = null) => {
    const isValid = runValidation(validProc, e.target.value);
    dispatchParameterDetails({ ...parameterDetails, [e.target.name]: e.target.value });
    if (!isValid) {
      setInputErr({
        ...inputErr,
        [e.target.name]: `Invalid format or characters`,
      });
    } else if (isValid || e.target.value === "") {
      let temp = { ...inputErr };
      delete temp[e.target.name];
      setInputErr({ inputErr: temp });
    }
  };

return !editEnabled ? (
  <>
        <div className="disabled-form-section small">
         <h3 className="disabled-form-section-header">Basic Information</h3>

         <div className="disabled-form-section-content">
           <span className="disabled-form-text">
             <span className="disabled-form-bold-text">Param Type:</span>
             {parameterDetails?.paramType}
           </span>
           <span className="disabled-form-text">
             <span className="disabled-form-bold-text">Param Level:</span>
             {parameterDetails?.paramLevel}
           </span>
           <span className="disabled-form-text">
             <span className="disabled-form-bold-text">Param Value:</span>
             {parameterDetails?.paramValue}
           </span>
         </div>

       </div>
         </>
) : (

          <Fragment>
             <h3 className="disabled-form-section-header"> Basic Information</h3>
          <Input
            type="text"
            label="Param Type"
            name="paramType"
            value={parameterDetails?.paramType || ""}
            onChange={(e) => handleChange(e, "validateName")}
            maxLength="20"
            errMssg={inputErr["paramType"]}
            disabled={formDisabled}
            
          />
          <Input
            type="text"
            label="Param Level"
            name="paramLevel"
            maxLength="200"
            value={parameterDetails?.paramLevel || ""}
            onChange={(e) => handleChange(e, "validateHasAlpha")}
            disabled={formDisabled}
            errMssg={inputErr["paramLevel"]}
            className="rightalign"


          />
          <Input
            type="text"
            label="Param Value"
            name="paramValue"
            value={parameterDetails?.paramValue}
            onChange={(e) => handleChange(e, "validateNum")}
            maxLength="20"
            errMssg={inputErr["paramValue"]}
            className="rightalign"

          />
          
      </Fragment>


);
};


export default BasicInfoParameter;