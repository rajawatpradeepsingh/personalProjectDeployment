import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { runValidation } from "../../../../../utils/validation";
import Input from "../../../../common/input/inputs.component";
import { setBasicInfo, setClientTaxesFormData, setChangesMade, setInputErr, setRequiredErr } from "../../../../../Redux/clientSlice";
import moment from "moment";
import "../../client.scss";
const ClientDetails = (props) => {
  const dispatch = useDispatch();
  const { inputErr, requiredErr } = useSelector((state) => state.client);
  const dispatchChange = (object) => dispatch(setChangesMade(object));
  const { basicInfo } = useSelector((state) => state.client);
  const { editEnabled } = useSelector((state) => state.client);
  const dispatchReqErr = (object) => dispatch(setRequiredErr(object));
  const dispatchErr = (object) => dispatch(setInputErr(object));

  const dispatchBasic = useCallback(
    (object) => dispatch(setBasicInfo(object)),
    [dispatch]
  );

  const dispatchClientTaxesFormData = useCallback(
    (object) => dispatch(setClientTaxesFormData(object)),
    [dispatch]
  );

  useEffect(() => {
    if (Array.isArray(basicInfo?.clientTaxes)) {
      dispatchClientTaxesFormData({
        ...basicInfo?.clientTaxes[basicInfo?.clientTaxes?.length - 1],
      });
    }
  }, [basicInfo, dispatchClientTaxesFormData/*, getClientTaxes*/]);

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
    <div className="client-details-container">
      <h3 className="disabled-form-section-header">Fees</h3>
      <div className="client-details-form">
        <Input
          type="text"
          label="VMS Fee %"
          name="vmsFees"
          value={Number(basicInfo?.vmsFees).toFixed(2)}
          className="NumAlign"
          onChange={(e) => handleBasicInfoChange(e, "validatePrecentage")}
          disabled={!editEnabled}
          errMssg={inputErr["vmsFees"]}
        />
        <Input
          type="text"
          label="Admin Fee %"
          name="adminFees"
          value={Number(basicInfo?.adminFees).toFixed(2)}
          className="NumAlign"
          onChange={(e) => handleBasicInfoChange(e, "validatePrecentage")}
          disabled={!editEnabled}
          errMssg={inputErr["adminFees"]}
        />
        <Input
          type="text"
          label="Rebate Fee %"
          name="rebateFees"
          className="NumAlign"
          value={Number(basicInfo?.rebateFees).toFixed(2)}
          onChange={(e) => handleBasicInfoChange(e, "validatePrecentage")}
          disabled={!editEnabled}
          errMssg={inputErr["rebateFees"]}
        />
      </div>

      <div className="comment-dateTime-container" style={{ width: "100%" }}>
        <span className="dateTime">{basicInfo?.user}</span>
        <span className="dateTime">
          {moment(basicInfo?.localDateTime).format("DD MMM YYYY")}
        </span>
      </div>
    </div>
  );
};

export default ClientDetails;
