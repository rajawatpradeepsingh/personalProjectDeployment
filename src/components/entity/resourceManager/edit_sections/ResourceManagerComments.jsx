import {  useSelector ,useDispatch} from "react-redux";
import TextBlock from "../../../common/textareas/textareas.component";
import { setBasicInfo, setManagerDetails } from "../../../../Redux/managerSlice";
import { Fragment, useCallback, useState } from "react";
import { runValidation } from "../../../../utils/validation";

const ResourceManagerComments= () => {
  // const { managerDetails } = useSelector((state) => state.manager);
  const { editEnabled } = useSelector((state) => state.manager);
  const { formDisabled} = useSelector((state) => state.manager);
  const { basicInfo } = useSelector((state) => state.manager);
  // const dispatchBasic = (object) => dispatch(setBasicInfo(object));
  const [inputErr, setInputErr] = useState({});
  const dispatch = useDispatch();


  
  const dispatchManagerDetails = useCallback(
    (object) => dispatch(setBasicInfo(object)),
    [dispatch]
  );

  const handleChange = (e, validProc = null) => {
    const limit = e.target.max ? +e.target.max : null;
    const isValid = runValidation(validProc, e.target.value, limit);
    const isDeleted = e.target.value === "";
    dispatchManagerDetails({
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

  return (
    <Fragment>
      {!editEnabled ? (

        <>
          <h3 className="disabled-form-section-header"> Comments</h3>
          <div className="disabled-form-section-content wide">
            <span className="disabled-form-text wide">
              <span className="disabled-form-bold-text">Comments:</span>
              {basicInfo?.comments
                ? basicInfo.comments.split('\n').map((line, index) => (
                    <p key={index}>{line}</p>
                  ))
                : null}
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
              value={basicInfo?.comments || ""}
              onChange={(e) => handleChange(e)}
              maxLength="3000"
              charCount={`${basicInfo?.comments ? 3000 - basicInfo?.comments.length : 3000
                } of 3000`}
              disabled={formDisabled}
            />
          </div>
        </>
      )}
    </Fragment>
  );
};

export default ResourceManagerComments;