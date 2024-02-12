import React, { useState,useMemo} from "react";
import axios from "axios";
import { config } from "../../../config.js";
import AuthService from "../../../utils/AuthService.js";
import Form from "../../common/form/form.component.jsx";
import LargeModal from "../../modal/large-modal/large-modal.component.jsx";
import IdleTimeOutHandler from "../../ui/Dashboard/IdleTimeOutHandler.js";
import { message } from "antd";
import "antd/dist/antd.css";
import moment from "moment/moment.js";
import {Select} from"antd"
import Input from "../../common/input/inputs.component.jsx";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Calendar.css";

const AddCaledner = (props) => {
  const headers = useMemo(() => AuthService.getHeaders(), []);
  const [isActive, setIsActive] = useState(true);
  const [isLogout, setLogout] = useState(false);
  const [weekNum, setWeekNum] = useState(1);
  const [selectedEndDate, setSelectedEndDate] = useState("");
  const [selectedStartDate, setSelectedStartDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [dateRange, setDateRange] = useState({
    startDate: new Date(moment().startOf("isoweek").utc()),
    endDate: new Date(moment().endOf("week").utc()),
  });

  const initialState = {
    calender_status: "",
    startDate:"",
    endDate:""
    
  };

  const [formState, setFormState] = useState(initialState);

  const weeks = [
    { value: 2, label: "2" },
    { value: 3, label: "3" },
    { value: 4, label: "4" },
    { value: 5, label: "5" },
  ];


  

  const getWeekendDate = (saturday, numOfWeeks) => {
    let dayToUtc = saturday + " 00:00";
    let day = new Date(dayToUtc);
    let backendStartDate = formatDateToBackEnd(saturday);
    setStartDate(backendStartDate);

    let endDate =
      numOfWeeks > 1
        ? new Date(day.setDate(day.getDate() + numOfWeeks * 7 - 2))
        : new Date(day.setDate(day.getDate() + numOfWeeks * 5));
    let formatedEndDate = endDate.toISOString().slice(0, 10);
    let backendEndDate = formatDateToBackEnd(formatedEndDate);
    setEndDate(backendEndDate);
    setSelectedEndDate(formatedEndDate);
  };
  
 
  const handleFormData = (date) => {
    setDateRange({ ...dateRange, startDate: date });
    console.log(date);
    setSelectedStartDate(date);
    setStartDate(formatDate(date));
    if (date === "") {
      return;
    }
    getWeekendDate(formatDateReverse(date), 1);
  };
  const handleWeeks = (value) => {
    if(startDate !== ""){
      getWeekendDate(formatDateReverse(startDate), value);
      setWeekNum(value);
    }
   
  };

  const formatDateToBackEnd = (value) => { 
    var month = value.substring(5, 7);
    var date = value.substring(8, 10);
    var year = value.substring(0, 4);
    return month + "-" + date + "-" + year;
  };

  const formatDate = (value) => {
    var date = new Date(value),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [day, mnth, date.getFullYear()].join("-");
  };

  const formatDateReverse = (value) => {
    var date = new Date(value),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  };


  
  
  


  const handleAddWeek = (e) => {
    e.preventDefault();
    debugger
    const formatDate = formatDateToBackEnd(selectedEndDate);
    console.log(startDate);
    console.log(endDate);
    if (startDate === "") {
      let curr = new Date();
      let start = curr.getDate() - curr.getDay() + 1;
      start = new Date(curr.setDate(start)).toISOString().slice(0, 10);

      let end = curr.getDate() - curr.getDay() + 5;
      end = new Date(curr.setDate(end)).toISOString().slice(0, 10);

      start = formatDateToBackEnd(start);
      end = formatDateToBackEnd(end);

      axios({
        url: `${config.serverURL}/calender/generate?noOfWeeks=${weekNum}`,
        data: { endDate: end, startDate: start, noOfWeeks: weekNum },
        method: "post",
        headers: headers,
      })
        .then((res) => {
          console.log("hello");
          resetForm();
          props.refresh();  
         message.success("Week added successfully");
        })
        .catch((err) => {
          console.log(err);
          message.error("Error when trying to add week");
        });
      return;
    }
    console.log(startDate);
    if (new Date(startDate).getDay() !== 1) {
      return;
    }
    console.log(startDate);
    if (weekNum > 1) {
      axios({
        url: `${config.serverURL}/calender/generate?noOfWeeks=${weekNum}`,
        data: { endDate: endDate, startDate: startDate, noOfWeeks: weekNum },
        method: "post",
        headers: headers,
      })
        .then((res) => {
          resetForm();
          props.refresh();
          message.success("Week added successfully");
        })
        .catch((err) => {
          console.log(err);
          message.error("Error when trying to add week");
        });
    } else {
      axios({
        url: `${config.serverURL}/calender/generate?noOfWeeks=${weekNum}`,
        data: {
          endDate: endDate,
          startDate: startDate,
        },
        method: "post",
        headers: headers,
      })
        .then((res) => {
          console.log(res);
          resetForm();
          message.success("Week added successfully");
          props.refresh();
        })
        
        .catch((err) => {
          console.log(err);
          message.error("Error when trying to add week");
        });
        resetForm();
    }
  };

 
  const resetForm = () => {
    setFormState(initialState);
    props.setOpen(false);
  };

  return (
                    <LargeModal
                       header={{ text: "Add Calender"}}
                       open={props.open}
                       close={() => {
                       resetForm();
                       props.setOpen(false);
                          }}
                       key={resetForm ? "reset" : "no-reset"}
                          >

           <IdleTimeOutHandler
          onActive={() => {
            setIsActive(true);
          }}
          onIdle={() => {
            setIsActive(false);
          }}
          onLogout={() => {
            setLogout(true);
          }}
        />

    <Form formEnabled={true}  onSubmit={handleAddWeek}  cancel={resetForm}   >

 <div className='picker'>
 <label >Start Date</label>
 </div>

 <div style={{width:"1000px"}}>
    <DatePicker
       selected={startDate ? new Date(startDate) : null}
       onChange={handleFormData}
       name="startDate"
       className="red-border"
       filterDate={(date) => date.getDay() === 1}
       placeholderText="dd-MM-yyyy"
       minDate={new Date(new Date().setDate(new Date().getDate() - new Date().getDay()))}
       dateFormat="dd-MM-yyyy" 
     />
     </div>


     <div style={{position:"relative", left:"208px",top:"-41px",width: '611px'}}>
             <Input
              label="End Date"
              type="date"
              name="endDate"
              value={endDate}
              disabled
           />
           </div>

           <div style={{width: '611px'}}>
           <Select id="weeks" name="weeks"placeholder={'Generate Weeks...'} onChange={handleWeeks} options={weeks} />
           </div>

    </Form>
  </LargeModal>
  );
};

export default AddCaledner;
