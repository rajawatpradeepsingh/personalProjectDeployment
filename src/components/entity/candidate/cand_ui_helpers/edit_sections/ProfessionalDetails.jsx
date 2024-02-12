import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import MultiSelect from "../../../../common/select/multiSelect/multiSelect.component";
import SingleSelect from "../../../../common/select/selects.component";
import Button from "../../../../common/button/button.component";
import Input from "../../../../common/input/inputs.component";
import TextBlock from "../../../../common/textareas/textareas.component";
import SwitchComponent from "../../../../common/switch/switch.component";
import DownloadResume from "../../../../common/file-download/DownloadFile";
import auth from "../../../../../utils/AuthService";
import { runValidation } from "../../../../../utils/validation";
import { expPeriod, noticePeriod } from "../../../../../utils/defaultData";
import { setInputErr, setRequiredErr } from "../../../../../Redux/candidateSlice";
import { setChangesMade } from "../../../../../Redux/candidateSlice";
import { setProfessionalInfo } from "../../../../../Redux/candidateSlice";
import { delDict, getDict } from "../../../../../API/dictionaries/dictionary-apis";
import { postDict } from "../../../../../API/dictionaries/dictionary-apis";
import { setBasicInfo } from "../../../../../Redux/candidateSlice";
import { Collapse } from "antd";
import { CurrentCTC } from "../ctc_inputs/CurrentCTC";
import { ExpectedCTC } from "../ctc_inputs/ExpectedCTC";
import { PlusSquareTwoTone, MinusSquareTwoTone } from "@ant-design/icons";
import '../../style.css';

const ProfessionalDetails = (props) => {
  const dispatch = useDispatch();
  const [headers] = useState(auth.getHeaders());
  const [userIsAdmin] = useState(auth.hasAdminRole());
  const [userIsSale] = useState(auth.hasBDManagerRole());
  const [primeSkillsDict, setPrimeSkillsDict] = useState([]);
  const [secSkillsDict, setSecSkillsDict] = useState([]);
  const [currencyDict, setCurrencyDict] = useState([]);
  const [professionalRolesDict, setProfessionalRolesDict] = useState([]);
  const [expRange, setExpRange] = useState({});

  const { editEnabled, basicInfo } = useSelector((state) => state.candidate);
  const { inputErr, requiredErr } = useSelector((state) => state.candidate);
  const profInfo = useSelector((state) => state.candidate.professionalInfo);
  const dispatchBasic = (object) => dispatch(setBasicInfo(object));
  const dispatchProf = (object) => dispatch(setProfessionalInfo(object));
  const dispatchErr = (object) => dispatch(setInputErr(object));
  const dispatchReqErr = (object) => dispatch(setRequiredErr(object));
  const dispatchChange = (object) => dispatch(setChangesMade(object));

  const { resume, enableReplaceResume, replaceResumeEnabled, uploadNewResume } =
    props;

  //get dictionary options for menus
  const getDicts = useCallback(async () => {
    const response = {};
    response.prime = await getDict("primeSkills", headers);
    response.secondary = await getDict("secSkills", headers);
    response.professionalRoles = await getDict("professionalRoles", headers);
    return response;
  }, [headers]);

  //call get get dictionaries on page load
  useEffect(() => {
    let isCancelled = false;
    const fetchData = async () => {
      try {
        const dictionaries = await getDicts();
        if (Object.keys(dictionaries).length) {
          if (!isCancelled) {
            setPrimeSkillsDict(dictionaries.prime);
            setSecSkillsDict(dictionaries.secondary);
            setProfessionalRolesDict(
              dictionaries.professionalRoles.sort((a, b) =>
                a.value.localeCompare(b.value)
              )
            );
          }
        }
      } catch (e) {
        if (!isCancelled) {
          console.log(e);
        }
      }
    };
    fetchData();
    //cleanup function:
    return () => (isCancelled = true);
  }, [getDicts]);

  useEffect(() => {
    if (profInfo.startExpCTC && profInfo.endExpCTC)
      setExpRange({ expRange: true });
  }, [profInfo.startExpCTC, profInfo.endExpCTC]);

  //get currencies for currency input
  const getCurrencies = useCallback(() => {
    getDict("currency", headers).then((list) => setCurrencyDict(list));
  }, [headers]);

  useEffect(() => { getCurrencies(); }, [getCurrencies])

  //handle changes made to candidate profressional info
  const handleProfInfoChange = (event, validProc = null) => {
    dispatchChange(true);
    if (event.target.value !== "") {
      let temp = { ...requiredErr };
      delete temp[event.target.name];
      dispatchReqErr(temp);
    }
    dispatchProf({ ...profInfo, [event.target.name]: event.target.value });

    const isValid = runValidation(validProc, event.target.value);
    if (!isValid) {
      dispatchErr({
        ...inputErr,
        [event.target.name]: `Invalid format or characters`,
      });
    } else {
      let temp = { ...inputErr };
      delete temp[event.target.name];
      dispatchErr(temp);
    }
  };
  // handle changes to candidates basic information
  const handleBasicInfoChange = (event, validProc = null) => {
    dispatchChange(true);
    const isValid = runValidation(validProc, event.target.value);
    let temp;
    if (event.target.value !== "") {
      temp = { ...requiredErr };
      delete temp[event.target.name];
      dispatchReqErr(temp);
    }

    if (event.target.name === "recruiter")
      dispatchBasic({ ...basicInfo, recruiter: { id: +event.target.value } });
    else
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

  //handle multiselect changes
  const multiSelectChange = (options, resource, parent = null) => {
    const selected = options
      .filter((o) => o.selected)
      .map((o) => o.value)
      .join(",");

    let resName = resource;
    if (resource === "primeSkills") resName = "primarySoftwareSkill";
    if (resource === "secSkills") resName = "secondarySkill";
    if (resource === "professionalRoles") resName = "role";

    const change = { target: { name: resName, value: selected || "" } };
    if (parent === "profInfo") {
      handleProfInfoChange(change);
    }
    else {
      handleBasicInfoChange(change);
    }



    // call add API for new /* TODO: decompose and make as new function */
    options
      .filter((o) => !o.id && !o.isDeleted)
      .forEach((o) => {
        postDict(resource, o.value, headers)
          .then((res) => {
            if (resource === "primeSkills")
              setPrimeSkillsDict([...primeSkillsDict, res]);
            if (resource === "secSkills")
              setSecSkillsDict([...secSkillsDict, res]);
            if (resource === "professionalRoles")
              setProfessionalRolesDict([...professionalRolesDict, res]);
          })
          .catch((err) => console.log(err));
      });

    // call delete API for marked as deleted
    options
      .filter((o) => o.isDeleted)
      .forEach((o) => {
        delDict(o.id, headers).catch((err) => console.log(err));
      });
    const delList = options.filter((o) => !o.isDeleted);
    if (resource === "primeSkills") setPrimeSkillsDict(delList);
    if (resource === "secSkills") setSecSkillsDict(delList);
    if (resource === "professionalRoles") setProfessionalRolesDict(delList);
  };

  //toggle experience range input (checkbox)
  const checkExpRange = (value) => {
    setExpRange(value);
  };

  const panelStyle = {
    marginBottom: 0,
    background: "#fff",
  };

  return (
    <Collapse
      defaultActiveKey={["2", "3", "4"]}
      size="small"
      id="cand-details-collapse"
      bordered={false}
      expandIcon={({ isActive }) =>
        isActive ? (
          <MinusSquareTwoTone
            twoToneColor={"#758bfd"}
            style={{ fontSize: "14px", marginTop: "5px" }}
          />
        ) : (
          <PlusSquareTwoTone
            twoToneColor={"#758bfd"}
            style={{ fontSize: "14px", marginTop: "5px" }}
          />
        )
      }
    >
      <Collapse.Panel
        style={panelStyle}
        header={<span className="long-form-subsection-header">Resume</span>}
        key="1"
      >
        {editEnabled ? (
          <div>
            <Input
              label="Resume"
              required
              type="file"
              name="resume"
              onChange={uploadNewResume}
              disabled={!editEnabled}
            />
            {editEnabled && resume ? (
              <Button
                type="button"
                className="x-small"
                handleClick={enableReplaceResume}
              >
                {replaceResumeEnabled ? "Cancel" : "Replace"}
              </Button>
            ) : editEnabled && !resume ? (
              <Button
                type="button"
                className="x-small"
                handleClick={enableReplaceResume}
              >
                {replaceResumeEnabled ? "Cancel" : "Add File"}
              </Button>
            ) : null}
          </div>
        ) : (
          <DownloadResume
            candidateId={basicInfo?.id}
            resume={resume}
            displayType="link"
            required
            disabled={!editEnabled}
            noLabel={true}
            className="small"
          />
        )}
      </Collapse.Panel>
      <Collapse.Panel
        style={panelStyle}
        header={
          <span className="long-form-subsection-header">Current Job</span>
        }
        key="2"
      >
        <div className="long-form-subsection">
          <Input
            type="text"
            label="Current Job Title"
            name="currentJobTitle"
            value={profInfo?.currentJobTitle || ""}
            onChange={(e) => handleProfInfoChange(e, "validateName")}
            maxLength="40"
            errMssg={inputErr["currentJobTitle"]}
            disabled={!editEnabled}
          />
          <Input
            type="text"
            label="Current Employer"
            name="currentEmployer"
            value={profInfo?.currentEmployer || ""}
            onChange={handleProfInfoChange}
            maxLength="255"
            disabled={!editEnabled}
          />
          <Input
            type="text"
            label="Current Employer Contact"
            name="currentEmployerContact"
            value={profInfo?.currentEmployerContact || ""}
            onChange={handleProfInfoChange}
            maxLength="255"
            disabled={!editEnabled}
          />
          <TextBlock
            label="Reason for Job Change"
            name="reasonForJobChange"
            value={profInfo?.reasonForJobChange || ""}
            onChange={(e) => handleProfInfoChange(e, "validateHasAlphabet")}
            className="small"
            maxLength="200"
            errMssg={inputErr["reasonForJobChange"]}
            disabled={!editEnabled}
          />
        </div>
      </Collapse.Panel>
      <Collapse.Panel
        style={panelStyle}
        header={<span className="long-form-subsection-header">Experience</span>}
        key="3"
      >
        <div className="long-form-subsection">
          <Input
            type="number"
            label="Total Experience"
            name="totalExperience"
            value={profInfo?.totalExperience || ""}
            onChange={(e) => handleProfInfoChange(e, "validateNum")}
            min="0"
            max="50"
            step="any"
            className="input-menu"
            hasMenuOptions
            menuName="totalExpPeriod"
            menuValue={profInfo?.totalExpPeriod || ""}
            menuOnChange={handleProfInfoChange}
            menuOptions={expPeriod.map((p) => {
              return { id: p, value: p, name: p };
            })}
            disabled={!editEnabled}
          />
          <Input
            type="number"
            label="Relevant Experience"
            name="relevantExperience"
            value={profInfo?.relevantExperience || ""}
            onChange={(e) => handleProfInfoChange(e, "validateNum")}
            min="0"
            max="50"
            step="any"
            className="input-menu"
            hasMenuOptions
            menuName="relExpPeriod"
            menuValue={profInfo?.relExpPeriod || ""}
            menuOnChange={handleProfInfoChange}
            menuOptions={expPeriod.map((p) => {
              return { id: p, value: p, name: p };
            })}
            errMssg={inputErr["relExp"]}
            disabled={!editEnabled}
          />

          <MultiSelect
            label="Role"
            options={professionalRolesDict.map((o) => ({
              id: o.id,
              value: o.value,
              label: o.value,
              selected: basicInfo?.role === o.value,
            }))}
            handleChange={(e) =>
              multiSelectChange(e, "professionalRoles", "basicInfo")
            }
            creatable
            deletable={userIsAdmin || userIsSale}
            disabled={!editEnabled}
          />
          <MultiSelect
            label="Primary Software Skills"
            options={primeSkillsDict.map((o) => ({
              id: o.id,
              value: o.value,
              label: o.value,
              selected: profInfo?.primarySoftwareSkill?.includes(o.value),
            }))}
            handleChange={(e) =>
              multiSelectChange(e, "primeSkills", "profInfo")
            }
            creatable
            deletable={userIsAdmin}
            isMulti
            disabled={!editEnabled}
          />
          <MultiSelect
            label="Secondary Software Skills"
            options={secSkillsDict.map((o) => ({
              id: o.id,
              value: o.value,
              label: o.value,
              selected: profInfo?.secondarySkill?.includes(o.value),
            }))}
            handleChange={(e) => multiSelectChange(e, "secSkills", "profInfo")}
            creatable
            deletable={userIsAdmin}
            isMulti
            disabled={!editEnabled}
          />
        </div>
      </Collapse.Panel>
      <Collapse.Panel
        style={panelStyle}
        header={<span className="long-form-subsection-header">Additional</span>}
        key="4"
      >
        <div className="long-form-subsection">
          <SingleSelect
            label="Offer in hand"
            name="offerInHand"
            value={profInfo?.offerInHand || ""}
            onChange={handleProfInfoChange}
            options={[
              { id: "Yes", value: "Yes", name: "Yes" },
              { id: "No", value: "No", name: "No" },
            ]}
            disabled={!editEnabled}
          />
          <Input
            label="Notice Period"
            type="number"
            name="noticePeriodCount"
            value={profInfo?.noticePeriodCount || ""}
            onChange={(e) => handleProfInfoChange(e, "validateInt")}
            placeholder={editEnabled ? "Count" : ""}
            min="1"
            max="10"
            className="input-menu"
            hasMenuOptions
            menuName="noticePeriodType"
            menuValue={profInfo?.noticePeriodType || ""}
            menuOnChange={handleProfInfoChange}
            menuOptions={noticePeriod.map((p) => {
              return { id: p, name: p, value: p };
            })}
            disabled={!editEnabled}
          />
          <CurrentCTC
            disabled={!editEnabled}
            handleChange={handleProfInfoChange}
            currentCtcValue={profInfo?.currentCtcValue}
            currentCtcType={profInfo?.currentCtcType}
            currentCtcCurrency={profInfo?.currentCtcCurrency}
            currentCtcTax={profInfo?.currentCtcTax}
            currencyDict={currencyDict}
            className="algin"
          />
          <ExpectedCTC
            disabled={!editEnabled}
            handleChange={handleProfInfoChange}
            expRange={expRange}
            startExpCTC={profInfo?.startExpCTC}
            endExpCTC={profInfo?.endExpCTC}
            expectedCtcValue={profInfo?.expectedCtcValue}
            expectedCtcType={profInfo?.expectedCtcType}
            expectedCtcCurrency={profInfo?.expectedCtcCurrency}
            expectedCtcTax={profInfo?.expectedCtcTax}
            checkExpRange={checkExpRange}
            currencyDict={currencyDict}
            className="algin"

          />
        </div>
      </Collapse.Panel>
      <Collapse.Panel
        style={panelStyle}
        header={<span className="long-form-subsection-header">Benefits</span>}
        key="5"
      >
        <div className="benefits-input-container">
          <SwitchComponent
            label="Health Benefits"
            handleSwitch={(value) =>
              handleProfInfoChange({
                target: {
                  name: "healthBenefit",
                  value: value ? "Yes" : "No",
                },
              })
            }
            value={profInfo?.healthBenefit}
          />
          <SwitchComponent
            label="Sick Leave"
            handleSwitch={(value) =>
              handleProfInfoChange({
                target: {
                  name: "sickLeave",
                  value: value ? "Yes" : "No",
                },
              })
            }
            value={profInfo?.sickLeave}
          />
          <SwitchComponent
            label="PTO"
            handleSwitch={(value) =>
              handleProfInfoChange({
                target: {
                  name: "pto",
                  value: value ? "Yes" : "No",
                },
              })
            }
            value={profInfo?.pto}
          />
        </div>
      </Collapse.Panel>
    </Collapse>
  );
};

export default ProfessionalDetails;
