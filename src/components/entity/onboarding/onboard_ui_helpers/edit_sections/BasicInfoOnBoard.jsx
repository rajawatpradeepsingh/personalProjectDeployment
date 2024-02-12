import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setBasicInfo, setChangesMade, setInputErr, setRequiredErr, } from "../../../../../Redux/onBoarding";
import SingleSelect from "../../../../common/select/selects.component";
import { runValidation } from "../../../../../utils/validation";
import AuthService from "../../../../../utils/AuthService";
import { getAllClients } from "../../../../../API/clients/clients-apis";
import { hiringType } from "../../../../../utils/defaultData";
import { getAllCandidates } from "../../../../../API/candidates/candidate-apis";

const BasicInfoOnBoard = () => {
  const dispatch = useDispatch();
  const { basicInfo, editEnabled, inputErr, requiredErr } = useSelector((state) => state.onBoarding);
  const [clientOptions, setClientOptions] = useState([]);
  const [candidateOptions, setCandidateOptions] = useState([]);

  const dispatchBasic = (object) => dispatch(setBasicInfo(object));
  const dispatchErr = (object) => dispatch(setInputErr(object));
  const dispatchReqErr = (object) => dispatch(setRequiredErr(object));
  const dispatchChange = (object) => dispatch(setChangesMade(object));
  const [headers] = useState(AuthService.getHeaders());

  const handleBasicInfoChange = (event, validProc = null) => {
    const { name, value } = event.target;
    dispatchChange(true);
    const isValid = runValidation(validProc, value);
    let temp;
    if (value !== "") {
      temp = { ...requiredErr };
      delete temp[name];
      dispatchReqErr(temp);
    }
    dispatchBasic({ ...basicInfo, [name]: value });

    if (!isValid) {
      dispatchErr({
        ...inputErr,
        [name]: `Invalid format or characters`,
      });
    } else {
      temp = { ...inputErr };
      delete temp[name];
      dispatchErr(temp);
    }
  };

  useEffect(() => {
    getAllClients(headers)
      .then(res => setClientOptions(res.statusCode === 200 ? res.tableData : []));
  }, [headers]);

  useEffect(() => {
    if (AuthService.hasAdminRole() || AuthService.hasRecruiterRole()) {
      getAllCandidates(headers)
        .then(res => setCandidateOptions(res || []))
    }
  }, [headers]);

  const handleChangeClient = (e) => {
    const client = clientOptions.filter(
      (item) => +item.id === +e.target.value
    )[0];

    dispatchBasic({
      ...basicInfo,
      client: { clientName: client.clientName, id: client.id },
    });
  };

  const handleChangeCandidate = (e) => {
    const candidate = candidateOptions.filter(
      (item) => +item.id === +e.target.value
    )[0];

    dispatchBasic({
      ...basicInfo,
      candidate: { firstName: candidate.firstName, lastName: candidate.lastName, id: candidate.id },
    });
  };

  return (
    <>
      <h3 className="disabled-form-section-header">Basics</h3>
      <SingleSelect
        label="Candidate Name"
        name="candidateId"
        data-testid="candidate-options"
        value={basicInfo?.candidate?.id || ""}
        onChange={handleChangeCandidate}
        options={candidateOptions.map((candidate) => ({
          id: candidate.id,
          name: candidate.fullName,
        }))}
        disabled
      />
      <SingleSelect
        label="Client"
        name="clientId"
        onChange={handleChangeClient}
        value={basicInfo?.client?.id}
        disabled={!editEnabled}
        options={clientOptions?.map((client) => ({
          id: client?.id,
          name: client?.clientName
        }))}
      />
      <SingleSelect
        type="text"
        label="Hiring Type"
        name="hiringType"
        value={basicInfo?.hiringType}
        onChange={handleBasicInfoChange}
        maxLength="20"
        disabled={!editEnabled}
        options={hiringType.map(type => ({ id: type, value: type, name: type }))}
      />
    </>
  );
};

export default BasicInfoOnBoard;