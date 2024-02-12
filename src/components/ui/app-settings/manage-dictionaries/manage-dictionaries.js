import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import auth from "../../../../utils/AuthService";
import { postDict } from "../../../../API/dictionaries/dictionary-apis";
import { getCandidateRolesDictionary } from "../../../../API/dictionaries/dictionary-apis";
import { getPrimarySkillsDictionary } from "../../../../API/dictionaries/dictionary-apis";
import { deleteMultipleDictValues } from "../../../../API/dictionaries/dictionary-apis";
import { setCandidateRoles } from "../../../../Redux/dictionariesSlice";
import { setPrimarySkills } from "../../../../Redux/dictionariesSlice";
import Button from "../../../common/button/button.component";
import PopUp from "../../../modal/popup/popup.component";
import FilterSearch from "../../filter-search/filter-search.component";
import { Collapse, Checkbox } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

//TODO: Split into entities that will contain lists of their own dictionaries
const ManageDictionaries = () => {
  const { Panel } = Collapse;
  const dispatch = useDispatch();
  const [headers] = useState(auth.getHeaders());
  const candidateRoles = useSelector(
    (state) => state.dictionaries.candidateRoles
  );
  const primarySkills = useSelector(
    (state) => state.dictionaries.primarySkills
  );
  const [selectedCandidateRoles, setSelectedCandidateRoles] = useState([]);
  const [filteredCandidateRoles, setFilteredCandidateRoles] = useState([]);
  const [newCandidateRole, setNewCandidateRole] = useState("");
  const [selectedPrimarySkills, setSelectedPrimarySkills] = useState([]);
  const [filteredPrimarySkills, setFilteredPrimarySkills] = useState([]);
  const [newPrimarySkill, setNewPrimarySkill] = useState("");
  const [pendingActionDetails, setPendingActionDetails] = useState({});
  const [openConfirmPopUp, setOpenConfirmPopUp] = useState(false);
  const [popUpMessage, setPopUpMessage] = useState({ title: "", details: "" });

  const getAllCandidateRoles = useCallback(async () => {
    try {
      const response = await getCandidateRolesDictionary(headers);
      if (response) dispatch(setCandidateRoles(response));
    } catch (error) {
      console.log(error);
    }
  }, [headers, dispatch]);

  const getAllPrimarySkills = useCallback(async () => {
    try {
      const response = await getPrimarySkillsDictionary(headers);
      if (response) dispatch(setPrimarySkills(response));
    } catch (error) {
      console.log(error);
    }
  }, [headers, dispatch]);

  useEffect(() => {
    let isCancelled = false;
    const fetchData = () => {
      if (!isCancelled) {
        getAllCandidateRoles();
        getAllPrimarySkills();
      }
    };
    fetchData();
    return () => (isCancelled = true);
  }, [getAllCandidateRoles, getAllPrimarySkills]);

  useEffect(() => {
    setFilteredCandidateRoles(candidateRoles);
  }, [candidateRoles]);

  useEffect(() => {
    setFilteredPrimarySkills(primarySkills);
  }, [primarySkills]);

  const handleSearch = (value, listName) => {
    const searchValue = value.toLowerCase();
    switch (listName) {
      case "candidateRoles":
        let tempRoles = candidateRoles.filter((role) =>
          role.value.toLowerCase().includes(searchValue)
        );
        setFilteredCandidateRoles(tempRoles);
        break;
      case "primarySkills":
        let tempSkills = primarySkills.filter((skill) =>
          skill.value.toLowerCase().includes(searchValue)
        );
        setFilteredPrimarySkills(tempSkills);
        break;
      default:
        break;
    }
  };

  const handleSelection = (dictionary, values) => {
    switch (dictionary) {
      case "candidateRoles":
        setSelectedCandidateRoles(values);
        break;
      case "primarySkills":
        setSelectedPrimarySkills(values);
        break;
      default:
        return;
    }
  };

  const handleAddOption = async (option, dictionary) => {
    const res = await postDict(dictionary, option, headers);
    if (res) {
      switch (dictionary) {
        case "professionalRoles":
          getAllCandidateRoles();
          break;
        case "primeSkills":
          getAllPrimarySkills();
          break;
        default:
          break;
      }
    }
  };

  const handleConfirmAction = () => {
    if (pendingActionDetails.action === "delete")
      deleteSelections(pendingActionDetails.dictionary);
    setOpenConfirmPopUp(false);
    setPopUpMessage({ title: "", details: "" });
  };

  const deleteSelections = async (dictionary) => {
    let res;
    switch (dictionary) {
      case "candidateRoles":
        res = await deleteMultipleDictValues(selectedCandidateRoles, headers);
        if (res) {
          getAllCandidateRoles();
          setSelectedCandidateRoles([]);
        }
        break;
      case "primarySkills":
        res = await deleteMultipleDictValues(selectedPrimarySkills, headers);
        if (res) {
          getAllPrimarySkills();
          setSelectedPrimarySkills([]);
        }
        break;
      default:
        return;
    }
    setPendingActionDetails({});
  };

  const openConfirmDelete = (dictionary) => {
    setPopUpMessage({
      title: "Confirm Change",
      details: "Delete selected values?",
    });
    setOpenConfirmPopUp(true);
    setPendingActionDetails({ dictionary: dictionary, action: "delete" });
  };

  const handlePopUpCancel = () => {
    setOpenConfirmPopUp(false);
    setPopUpMessage({ title: "", details: "" });
  };

  return (
    <div className="manage-dictionaries-container">
      <p className="app-settings-section-header">Manage Menu Options:</p>
      <Collapse accordion>
        <Panel
          header={
            <span className="app-settings-panel-header">Candidate Roles</span>
          }
          extra={
            selectedCandidateRoles.length > 0 && (
              <Button
                type="button"
                handleClick={() => openConfirmDelete("candidateRoles")}
                className="icon-btn no-border no-margin"
              >
                <DeleteOutlined />
              </Button>
            )
          }
          key="1"
        >
          <FilterSearch
            handleSearch={(searchValue) =>
              handleSearch(searchValue, "candidateRoles")
            }
            newOption={newCandidateRole}
            handleAddOption={() =>
              handleAddOption(newCandidateRole, "professionalRoles")
            }
            setAddOption={(value) => setNewCandidateRole(value)}
          />
          <Checkbox.Group
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: "15px",
            }}
            options={filteredCandidateRoles.map((role) => ({
              label: role.value,
              value: role.id,
            }))}
            value={selectedCandidateRoles}
            onChange={(values) => handleSelection("candidateRoles", values)}
          />
        </Panel>
        <Panel
          header={
            <span className="app-settings-panel-header">Primary Skills</span>
          }
          extra={
            selectedPrimarySkills.length > 0 && (
              <Button
                type="button"
                handleClick={() => openConfirmDelete("primarySkills")}
                className="icon-btn no-border no-margin"
              >
                <DeleteOutlined />
              </Button>
            )
          }
          key="2"
        >
          <FilterSearch
            handleSearch={(searchValue) =>
              handleSearch(searchValue, "primarySkills")
            }
            newOption={newPrimarySkill}
            handleAddOption={() =>
              handleAddOption(newPrimarySkill, "primeSkills")
            }
            setAddOption={(value) => setNewPrimarySkill(value)}
          />
          <Checkbox.Group
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: "15px",
            }}
            options={filteredPrimarySkills.map((skill) => ({
              label: skill.value,
              value: skill.id,
            }))}
            value={selectedPrimarySkills}
            onChange={(values) => handleSelection("primarySkills", values)}
          />
        </Panel>
      </Collapse>
      <PopUp
        type="confirm-change"
        openModal={openConfirmPopUp}
        closePopUp={handlePopUpCancel}
        handleConfirmClose={handleConfirmAction}
        message={popUpMessage}
        cancelValue="Cancel"
      />
    </div>
  );
};

export default ManageDictionaries;
