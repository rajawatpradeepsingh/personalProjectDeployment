import {  useSelector ,useDispatch} from "react-redux";
import TextBlock from "../../../common/textareas/textareas.component";
import { setParameterDetails } from "../../../../Redux/parameterSlice";
import { Fragment, useCallback, useState } from "react";
import { runValidation } from "../../../../utils/validation";

const ParameterComments = () => {
  const { parameterDetails } = useSelector((state) => state.parameter);
  const { editEnabled } = useSelector((state) => state.parameter);
  const { formDisabled} = useSelector((state) => state.parameter);
  const [inputErr, setInputErr] = useState({});
  const dispatch = useDispatch();


  const dispatchParameterDetails = useCallback(
    (object) => dispatch(setParameterDetails(object)),
    [dispatch]
  );


  const handleChange = (e, validProc = null) => {
    const limit = e.target.max ? +e.target.max : null;
    const isValid = runValidation(validProc, e.target.value, limit);
    const isDeleted = e.target.value === "";
    dispatchParameterDetails({
      ...parameterDetails,
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

  return (
    <Fragment>
      {!editEnabled ? (
        
        <>
          <h3 className="disabled-form-section-header"> Comments</h3>
          <div className="disabled-form-section-content wide">
            <span className="disabled-form-text wide">
              <span className="disabled-form-bold-text">Comments:</span>
              {parameterDetails?.comments}
            </span>
          </div>

        </>
      ) : (
        <>
          <h3 className="disabled-form-section-header"> Comments</h3>
          <div className="long-form-subsection">
            <TextBlock
              type="text"
              label="Comments"
              name="comments"
              value={parameterDetails?.comments || ""}
              onChange={(e) => handleChange(e)}
              maxLength="3000"
              charCount={`${parameterDetails?.comments ? 3000 - parameterDetails?.comments.length : 3000
                } of 3000`}
                disabled={formDisabled}
            />
          </div>
        </>
      )}
    </Fragment>
  );
};

export default ParameterComments;
