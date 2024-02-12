import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import TextBlock from "../../../../common/textareas/textareas.component";
import { setInputErr, setBasicInfo, setChangesMade, } from "../../../../../Redux/clientSlice";
import { runValidation } from "../../../../../utils/validation";

const Comments = () => {
  const dispatch = useDispatch();
  const { inputErr, basicInfo, editEnabled } = useSelector((state) => state.client);
  const dispatchErr = (object) => dispatch(setInputErr(object));
  const dispatchChange = (object) => dispatch(setChangesMade(object));

  const dispatchBasic = useCallback(
    (object) => dispatch(setBasicInfo(object)),
    [dispatch]
  );

  const handleBasicInfoChange = (event, validProc = null) => {
    dispatchChange(true);
    const isValid = runValidation(validProc, event.target.value);
    let temp;

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

  return (
    <div className="client-details-container">
      <h3 className="disabled-form-section-header"> Comments</h3>
      <TextBlock
        type="text"
        label="Comments"
        name="comments"
        value={basicInfo?.comments || ""}
        onChange={(e) => handleBasicInfoChange(e)}
        maxLength="3000"
        charCount={`${basicInfo.comments ? 3000 - basicInfo.comments.length : 3000
          } of 3000`}
        disabled={!editEnabled}
      />
    </div>
  );
};

export default Comments;
