import { Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { runValidation } from "../../../../utils/validation";
import TextBlock from "../../../common/textareas/textareas.component";
import { setCommissionTypeDetails,setChangesMade,setInputErr,setRequiredErr } from "../../../../Redux/commissionTypeSlice";
const Comments = (props) => {
  const dispatch = useDispatch();

  const { editDisabled, editEnabled } = useSelector((state) => state.commissionType);
  const { inputErr, requiredErr } = useSelector((state) => state.commissionType);
  const { commissionTypeDetails } = useSelector((state) => state.commissionType);
  const dispatchCommType = (object) => dispatch(setCommissionTypeDetails(object));
  const dispatchErr = (object) => dispatch(setInputErr(object));
  const dispatchChange = (object) => dispatch(setChangesMade(object));
  const dispatchReqErr = (object) => dispatch(setRequiredErr(object));


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

  return (
    <Fragment>
      <h3 className="disabled-form-section-header">Basic Information</h3>
      <TextBlock
                  label="Comments"
                  name="comments"
                  value={commissionTypeDetails?.comments}
                  onChange={(e) => handleBasicInfoChange(e)}
                  charCount={`${commissionTypeDetails?.comments ? 3000 - commissionTypeDetails?.comments.length : 3000
                    } of 3000`}
                  maxLength="3000"
                  disabled={!editEnabled}
                />
    </Fragment>
  );
};

export default Comments;