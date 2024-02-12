import { useSelector,useDispatch } from "react-redux";
import { setTimeSheetDetails } from "../../../../../Redux/timesheetSlice";
import { Fragment } from "react";
import { setInputErr, setRequiredErr,setChangesMade } from "../../../../../Redux/rateCardSlice";
import { runValidation } from "../../../../../utils/validation";
import TextBlock from "../../../../common/textareas/textareas.component";
import ExpandableTable from "../../../../ui/expandable-table/expandable-table.component";
import moment from "moment";
const Comments = () => {
  const { editEnabled } = useSelector((state) => state.timesheet);
  const { timeSheetDetails } = useSelector((state) => state.timesheet);
  const dispatchTimeSheet = (object) => dispatch(setTimeSheetDetails(object));
  const dispatch = useDispatch();
  const { inputErr, requiredErr } = useSelector((state) => state.timesheet);
  const dispatchErr = (object) => dispatch(setInputErr(object));
  const dispatchReqErr = (object) => dispatch(setRequiredErr(object));
  const dispatchChange = (object) => dispatch(setChangesMade(object));



  const handleChange = (event, validProc = null) => {
    dispatchChange(true);
    const isValid = runValidation(validProc, event.target.value);
    let temp;
    if (event.target.value !== "") {
      temp = { ...requiredErr };
      delete temp[event.target.name];
      dispatchReqErr(temp);
    }
    dispatchTimeSheet({ ...timeSheetDetails, [event.target.name]: event.target.value });
  
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

  const handleweekly = (timesheetWeekDaysDate) => {
    dispatchChange(true);
    dispatchTimeSheet({
      ...timeSheetDetails,
      timesheetWeekDays: { ...timeSheetDetails.timesheetWeekDays, ...timesheetWeekDaysDate },
    });
  };

  const weeklyTimeSheet = (e,validProc = null) => {
    const isDeleted = e.target.value === "";
    const isValid = runValidation(validProc, e.target.value, e.target.max);
    console.log(isValid)
    if (isDeleted || isValid)
    handleweekly({
    [e.target.name]: e.target.value,
    });
  };
  

  return (
    <Fragment>
      <h3 className="disabled-form-section-header">Comments</h3>
      <TextBlock
        type="text"
        label="Comments"
        name="comments"
        value={timeSheetDetails?.comments || ""}
        onChange={(e) => handleChange(e)}
        maxLength="3000"
        charCount={`${timeSheetDetails?.comments ? 3000 - timeSheetDetails?.comments.length : 3000
          } of 3000`}
        disabled={!editEnabled}
      />

<h3 className="disabled-form-section-header">Week Days</h3>
<ExpandableTable
                 hidePagination={true}
                headers={[
                    { id: 1, label: "Day",},
                    { id: 2, label: moment(timeSheetDetails?.timesheetWeekDays?.mondayDate).format("MM/DD")+" Mon" },
                    { id: 3, label: moment(timeSheetDetails?.timesheetWeekDays?.tuesdayDate).format("MM/DD")+" Tue", },
                    { id: 4, label: moment(timeSheetDetails?.timesheetWeekDays?.wednesdayDate).format("MM/DD")+" Wed", },
                    { id: 5, label: moment(timeSheetDetails?.timesheetWeekDays?.thursdayDate).format("MM/DD")+" Thur" },
                    { id: 6, label: moment(timeSheetDetails?.timesheetWeekDays?.fridayDate).format("MM/DD")+" Fri" },
                    { id: 7, label: moment(timeSheetDetails?.timesheetWeekDays?.saturdayDate).format("MM/DD")+" Sat" },
                    { id: 8, label: moment(timeSheetDetails?.timesheetWeekDays?.sundayDate).format("MM/DD")+" sun" },
                ]}
                body={[''].map(() => {
                    return {
                        id: 1, cells: [
                            { id: 1, data: 'Hours' },
                            {
                                id: 2, data: <td>
                                    <input 
                                    style={{paddingLeft:"100px"}}
                                    type='number' placeholder='0h'
                                        min='0' max='24'
                                        
                                        id={0}
                                        name='mondayHours'
                                        value={timeSheetDetails?.timesheetWeekDays?.mondayHours}
                                         onChange={(e) => weeklyTimeSheet(e,"validateHours")}
                                         disabled={!editEnabled}
                                        //  errMssg={inputErr["email"]}
                                    ></input></td>
                            },
                            {
                                id: 3, data: <td>
                                    <input type='number' placeholder='0h'
                                        min='0' max='24'
                                        style={{paddingLeft:"100px"}}
                                        id={1}
                                        name="tuesdayHours"
                                        value={timeSheetDetails?.timesheetWeekDays?.tuesdayHours}
                                        onChange={(e) => weeklyTimeSheet(e,"validateHours")}
                                        disabled={!editEnabled}
                                    ></input></td>
                            },
                            {
                                id: 4, data: <td>
                                    <input type='number' placeholder='0h'
                                        min='0' max='24'
                                        style={{paddingLeft:"100px"}}
                                        id={2}
                                        name="wednesdayHours"
                                        value={timeSheetDetails?.timesheetWeekDays?.wednesdayHours}
                                         onChange={(e) => weeklyTimeSheet(e,"validateHours")}
                                         disabled={!editEnabled}

                                    ></input></td>
                            },
                            {
                                id: 5, data: <td>
                                    <input type='number' 
                                           placeholder='0h'
                                           min='0' max='24'
                                          style={{paddingLeft:"100px"}}
                                          id={3}
                                          name="thursdayHours"
                                          value={timeSheetDetails?.timesheetWeekDays?.thursdayHours}
                                          onChange={(e) => weeklyTimeSheet(e,"validateHours")}
                                          disabled={!editEnabled}
                                    ></input></td>
                            },
                            {
                                id: 6, data: <td>
                                    <input type='number' placeholder='0h'
                                        min='0' max='24'
                                        id={4}
                                        style={{paddingLeft:"100px"}}
                                        name="fridayHours"
                                        value={timeSheetDetails?.timesheetWeekDays?.fridayHours}
                                        onChange={(e) => weeklyTimeSheet(e,"validateHours")}
                                        disabled={!editEnabled}
                                    ></input></td>
                            },
                            {
                                id: 7, data: <td>
                                    <input type='number' placeholder='0h'
                                        min='0' max='24'
                                        id={5}
                                        style={{paddingLeft:"100px"}}
                                        name="saturdayHours"
                                        value={timeSheetDetails?.timesheetWeekDays?.saturdayHours}
                                         onChange={(e) => weeklyTimeSheet(e,"validateHours")}
                                         disabled={!editEnabled}
                                    ></input></td>
                            },
                            {
                              id: 8, data: <td>
                                  <input type='number' placeholder='0h'
                                      min='0' max='24'
                                      id={6}
                                      name="sundayHours"
                                      style={{paddingLeft:"100px"}}
                                      value={timeSheetDetails?.timesheetWeekDays?.sundayHours}
                                       onChange={(e) => weeklyTimeSheet(e,"validateHours")}
                                    disabled={!editEnabled}
                                  ></input></td>
                          },                           
                         
                        ]
                    }
                })}
            />

     </Fragment>


  );
};

export default Comments;