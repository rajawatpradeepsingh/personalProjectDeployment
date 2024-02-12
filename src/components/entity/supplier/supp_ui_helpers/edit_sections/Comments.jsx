import { useSelector, useDispatch } from "react-redux";
import TextBlock from "../../../../common/textareas/textareas.component";
import { runValidation } from "../../../../../utils/validation";
import { setBasicInfo, setChangesMade, setRequiredErr, setInputErr } from "../../../../../Redux/supplierSlice";

const Comments = () => {
  const dispatch = useDispatch();
  const { editEnabled, basicInfo } = useSelector((state) => state.supplier);
  const { inputErr, requiredErr } = useSelector((state) => state.supplier);
  const dispatchBasic = (object) => dispatch(setBasicInfo(object));
  const dispatchChange = (object) => dispatch(setChangesMade(object));
  const dispatchErr = (object) => dispatch(setInputErr(object));
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
    <TextBlock
      type="text"
      label="Comments"
      name="comments"
      value={basicInfo?.comments || ""}
      onChange={(e) => handleBasicInfoChange(e)}
      maxLength="3000"
      charCount={`${basicInfo?.comments ? 3000 - basicInfo?.comments.length : 3000
        } of 3000`}
      disabled={!editEnabled}
    />
  );
};

export default Comments;
