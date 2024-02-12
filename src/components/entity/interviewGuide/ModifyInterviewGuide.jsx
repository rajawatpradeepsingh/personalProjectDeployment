import { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Content from "../../container/content-container/content-container.component";
import Button from "../../common/button/button.component";
import TextBlock from "../../common/textareas/textareas.component";
import MultiSelect from "../../common/select/multiSelect/multiSelect.component";
import { setAreas, setSubjects, setGuide } from "../../../Redux/iGuide";
import auth from "../../../utils/AuthService";
import { postSection } from "../../../API/guides/guide-apis";
import { postGuide, putGuide } from "../../../API/guides/guide-apis";
import { entityHeaderActions } from "./InterviewGuide.Objects";
import IdleTimeOutHandler
 from "../../ui/Dashboard/IdleTimeOutHandler";
const ModifyInterviewGuide = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { navMenuOpen } = useSelector((state) => state.nav);
  const { subjects, areas, clients } = useSelector((state) => state.iGuide);
  const { guide } = useSelector((state) => state.iGuide);
  const [headers] = useState(auth.getHeaders());
  const [selectedSubject, setSelectedSubject] = useState();
  const [selectedAreas, setSelectedAreas] = useState([]);
  const [renewAreas, setRenewAreas] = useState(false);
const[isActive,setIsActive]=useState(true);
  const[isLogout,setLogout]=useState(false);
  const resetForm = () => {
    dispatch(setGuide({}));
    setSelectedSubject();
  };

  const closeForm = useCallback(() => {
    history.push("/viewguides");
  }, [history]);

  useEffect(() => {
    if (guide?.id) setSelectedSubject(guide.subject.id);
  }, [guide]);

  useEffect(() => {
    const currentAreas = areas.filter((a) => +a.subject?.id === +selectedSubject);
    setSelectedAreas(currentAreas);
  }, [areas, selectedSubject]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newGuide = { ...guide, [name]: value };
    if (name === "questions") newGuide = { ...guide, [name]: value };
    else newGuide = { ...guide, [name]: { id: value } };
    if (name === "subject") {
      newGuide = { ...newGuide, area: null };
      setSelectedSubject(value);
    }
    setRenewAreas(name === "subject");
    dispatch(setGuide(newGuide));
  };

  const handleAddOption = async (options, source) => {
    try {
      const newOption = options.find((o) => !o.id);
      if (!newOption) return {};
      let addOption = { name: newOption.value };
      addOption =
        source === "subject"
          ? { ...addOption }
          : { ...addOption, subject: { id: selectedSubject } };
      const res = await postSection(headers, source, addOption);
      return res;
    } catch {
      return {};
    }
  };

  const handleMultiSelect = async (options, source) => {
    handleAddOption(options, source)
      .then((res) => {
        const updOptions = res.id
          ? [...options.filter((o) => o.id), { ...res, selected: true }]
          : options.filter((o) => o.id);

        if (source === "subject")
          if (res.id) {
            const newSubjects = [...subjects, res];
            dispatch(setSubjects(newSubjects));
          };
        if (source === "area")
          if (res.id) {
            const newAreas = [...areas, res];
            dispatch(setAreas(newAreas));
          };
        const target = {
          name: source,
          value: updOptions.filter((o) => o?.selected)[0]?.id,
        };
        handleChange({ target });
      })
      .catch((err) => console.log(err));
  };

  const handleCancel = () => {
    resetForm();
    closeForm();
  };

  const handleSubmit = () => {
    const newGuide = { ...guide, user: { id: auth.getUserId() } };
    if (guide?.id)
      putGuide(headers, newGuide)
        .then(() => closeForm())
        .catch((err) => console.log(err));
    else
      postGuide(headers, newGuide)
        .then(() => closeForm())
        .catch((err) => console.log(err));
    resetForm();
  };

  return (
    <div
      className={navMenuOpen ? "page-container" : "page-container full-width"}
    >
      <div className="page-actions-container">
        {entityHeaderActions({ closeForm, guide })}
      </div>

      <Content className="guide-modify-container">
           <IdleTimeOutHandler 
    onActive={()=>{setIsActive(true)}} 
    onIdle={()=>{setIsActive(false)}}
    onLogout={()=>{setLogout(true)}}
    />
        <div className="long-form-subsection">
          <MultiSelect
            className="medium"
            label="Subject"
            options={subjects.map((s) => ({
              id: s.id,
              value: s.name,
              selected: +selectedSubject === +s.id,
            }))}
            handleChange={(e) => handleMultiSelect(e, "subject")}
            placeholder="Select..."
            creatable
          />
          <MultiSelect
            label="Area of focus"
            options={selectedAreas.map((s) => ({
              id: s.id,
              value: s.name,
              selected: +s.id === +guide?.area?.id,
            }))}
            handleChange={(e) => handleMultiSelect(e, "area")}
            placeholder="Select..."
            creatable
            reset={renewAreas}
          />
          <MultiSelect
            label="Client"
            options={clients.map((c) => ({
              id: c.id,
              value: c.clientName,
              selected: +c.id === +guide?.client?.id,
            }))}
            handleChange={(e) => handleMultiSelect(e, "client")}
            placeholder="Select..."
          />
        </div>
        <TextBlock
          className="guide-textarea"
          label="Questions"
          name="questions"
          value={guide.questions || ""}
          onChange={handleChange}
          charCount={`${guide.questions ? 3000 - guide.questions.length : 3000
            } of 3000`}
          maxLength="3000"
          rows={10}
          disabled={!guide.area?.id}
          placeholder={
            !guide.area?.id
              ? "Please select all required fields before submitting a guide"
              : ""
          }
          required
        />
        <div className="form-btns-container">
          <Button type="reset" className="main reset marginX" handleClick={handleCancel}>
            Cancel
          </Button>
          <Button
            type="submit"
            className="main submit marginX"
            handleClick={handleSubmit}
            disabled={!(guide.area?.id && guide.questions?.length)}
          >
            Submit
          </Button>
        </div>
      </Content>
    </div>
  );
};

export default ModifyInterviewGuide;
