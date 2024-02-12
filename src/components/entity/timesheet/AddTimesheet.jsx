import React, { Component, Fragment } from "react";
import { config } from "../../../config.js";
import Content from "../../container/content-container/content-container.component.jsx";
import Form from "../../common/form/form.component.jsx";
import Input from "../../common/input/inputs.component.jsx";
import Breadcrumbs from "../../common/breadcrumbs/breadcrumbs.component.jsx";
import PopUp from "../../modal/popup/popup.component.jsx";
import { Link } from "react-router-dom";
import { PageContainer } from "../../container/page-container/PageContainer.jsx";
import { PageHeader } from "../../container/page-header/PageHeader.jsx";
import axios from "axios";
import { runValidation } from "../../../utils/validation.js";
import AuthService from "../../../utils/AuthService.js";
import TextBlock from "../../common/textareas/textareas.component.jsx";
import SingleSelect from "../../common/select/selects.component.jsx";
import ExpandableTable from "../../ui/expandable-table/expandable-table.component";

export default class AddTimesheet extends Component {
  constructor(props) {
    super(props);
    
this.state = {
  ...this.initialState
 };
 this.sumbittimesheet = this.sumbittimesheet.bind(this);
this.timesheetChange = this.timesheetChange.bind(this);
this.resumeRef = React.createRef(null);
  
  };

  initialState = {
    worker: "",
    workerId: "",
    workerOptions: [],
    timesheetWeekDays: "",
    timesheetId: "",
    timesheetOptions: [],
    workOrder: "",
    workOrderId: "",
    workOrderOptions: [],
    timeSheetStatus: "",
    submittedOn: "",
    updatedOn: "",
    billableHours: "",
    statusChangedOn: "",
    comments: "",
    inputErr: "",
    commissionPerWeek: "",
    statusHistory: "",
    fridayDate:"", 
    fridayHours:0,
   fridayHoursStr:"",
   mondayDate: "",
   mondayHours: 0,
  mondayHoursStr: "",
  saturdayDate: "",
  saturdayHours: 0,
  saturdayHoursStr: "",
  sundayDate: "",
  sundayHours: 0,
  sundayHoursStr: "",
  thursdayDate: "",
  thursdayHours :0,
  thursdayHoursStr: "",
  tuesdayDate: "",
  tuesdayHours: 0,
  tuesdayHoursStr: "",
  wednesdayDate: "",
  wednesdayHours: 0,
  wednesdayHoursStr: "",
 selectedWeek: "",
 workWeek: "",
 weekCalender: "",
 weekCalenderId: "",
    isDeleted: false, 
  };

  getWorkers = () => {
    let headers = JSON.parse(sessionStorage.getItem("headers"));
    axios
      .get(config.serverURL + "/worker?dropdownFilter=true", {
        headers,
      })
      .then((resp) => {
        const cand = resp.data;

        if (resp.data) {
          this.setState({ workerOptions: cand });
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.response && error.response.status === 401) {
          AuthService.logout();
        }
      });
  };

  getWorkOrder = () => {
    let headers = JSON.parse(sessionStorage.getItem("headers"));
    axios
      .get(config.serverURL + "/workOrders?dropdownFilter=true", {
        headers,
      })
      .then((resp) => {
        const cand = resp.data;

        if (resp.data) {
          this.setState({ workOrderOptions: cand });
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.response && error.response.status === 401) {
          AuthService.logout();
        }
      });
  };
  getWeekdays = () => {
    let headers = JSON.parse(sessionStorage.getItem("headers"));

    axios
    .get(config.serverURL + "/calender?dropdownFilter=true", {
      headers,
    })
        .then(res => {
          this.state.timesheetOptions=res.data
          this.setState(this.state.timesheetOptions.map((week, id) => {
                console.log(week)
                const { selectedDate } =week.startDate

                const currentDayInMilli = new Date(week.startDate).getTime()
                const oneDay = 1000*60*60*24
                const nextDayInMilli = currentDayInMilli + oneDay
                const nextDate = new Date(nextDayInMilli)
                // console.log(week.startDate);
                // console.log(nextDate);
                const currentDayInMill = new Date(nextDate).getTime()
                const oneDa = 1000*60*60*24
                const nextDayInMill = currentDayInMill + oneDay
                const nextDat = new Date(nextDayInMill)
                // console.log(nextDat);
                const currentDayInMil = new Date(nextDate).getTime()
                const oneDayy = 1000*60*60*24
                const nextDayInMil = currentDayInMil + oneDayy
                const nextDatee = new Date(nextDayInMil)
                // console.log(nextDatee);
                return { id: id, label: week.startDate + ' to ' + week.endDate, value: week.startDate + ' ' + week.endDate }
            }));
        })
        .catch(error => console.log('Error in get request for week calender', error));
}

  
  timesheetChange = (e, validProc = null) => {
    const isDeleted = e.target.value === "";
    const isValid = runValidation(validProc, e.target.value, e.target.max);
    console.log(isValid)
    if (isDeleted || isValid)
      this.setState({ [e.target.name]: e.target.value });
    console.log( {[e.target.name]: e.target.value})
  
  };


  
  showModal = () => {
    this.setState({ show: !this.state.show });
  };

  resetTimesheet = () => {
    this.setState(() => this.initialState);
    if (this.resumeRef.current) this.resumeRef.current.value = null;
  };

  closeForm = () => {
    this.props.history.push("/viewtimesheet");
  };
  closePopUp = () => {
    this.setState({ show: false });
  };

  togglePopUp = () => {
    this.setState({ openPopUp: !this.state.openPopUp });
  };
  sumbittimesheet(event) {
    event.preventDefault();

    const Timesheet = {
      worker: this.state.workerId === "" ? null : { id: this.state.workerId },
      workOrder: this.state.workOrderId === "" ? null : { id: this.state.workOrderId },
      timesheetWeekDays: {
        sundayDate: this.state.workWeek[6],
        sundayHoursStr: this.state.sundayHoursStr,
        sundayHours:this.state.saturdayHours,
        mondayDate:  this.state.workWeek[0],
        mondayHoursStr: this.state.mondayHoursStr,
        mondayHours:this.state.mondayHours,
        tuesdayDate:  this.state.workWeek[1],
        tuesdayHoursStr: this.state.tuesdayHoursStr,
        wednesdayDate:  this.state.workWeek[2],
        wednesdayHoursStr: this.state.wednesdayHoursStr,
        thursdayDate:  this.state.workWeek[3],
        thursdayHoursStr: this.state.thursdayHoursStr,
        fridayDate:  this.state.workWeek[4],
        fridayHoursStr: this.state.fridayHoursStr,
        saturdayDate:  this.state.workWeek[5],
        saturdayHoursStr: this.state.saturdayHoursStr,
        tuesdayHours:this.state.tuesdayHours,
        wednesdayHours:this.state.wednesdayHours,
        thursdayHours:this.state.thursdayHours,
        fridayHours:this.state.fridayHours,
        saturdayHours:this.state.saturdayHours,
      },
      timeSheetStatus: this.state.timeSheetStatus,
      comments: this.state.comments,
      submittedOn: this.state.submittedOn,
      isDeleted: false,
 

    };

    console.log(Timesheet);
    let headers = JSON.parse(sessionStorage.getItem("headers"));
    axios.post(`${config.serverURL}/timesheet `, Timesheet, { headers })
    .then((response) => {
      console.log(Timesheet)
      if (response.data != null) {
       
        this.resetTimesheet();
        this.setState({
          
          show: true,
          message: "To view Timesheet go to ",
          status: "Success",
        });
        if (response.data != null && this.state.file) {
            let id = response.data.id;
            let file = this.state.file;
            let formData = new FormData();
  
            formData.append("file", file);
            axios
              .post(`${config.serverURL}/timesheet/${id}/resume`, formData, {
                headers,
              })
              .then((response) => {
                console.log(response.status);
              })
              .catch((error) => {
                console.log(error);
                if (error.response && error.response.status === 401) {
                  AuthService.logout();
                }
              });
          }
      }
    })
    .catch((err) => {
      this.setState({
        show: true,
        message: err.response.data,
        status: "Error in adding",
      });
      console.log(err);
      });
  };

  componentDidMount() {
    this.getWorkers();
    this.getWorkOrder();
    this.getWeekdays();
    this.getAllCalender();

      this.setState({
      setIsActive: true,
      setLogout:false,
    })
     
 
  };

  componentDidUpdate(prevProps) {
    if (this.props.navMenuOpen !== prevProps.navMenuOpen) {
      this.setState({ navMenuOpen: this.props.navMenuOpen });
    }
  };

   handleWeekCalender = (event) => {
    let date = event.target.value.split(' ');
    let start = date[0].split("-")
        .map(n => +n)
        .reverse()
        console.log(start)
    let [startYear, startDay, startMonth] = start;
    let end = date[1].split("-")   // ["04","07","2019]
        .map(n => +n) // [4,7,2019]
        .reverse();
    let [endYear, endDay, endMonth] = end
  
    let dates = this.getDates(new Date(startYear, startMonth - 1, startDay), new Date(endYear, endMonth - 1, endDay +2));

    this.setState({workWeek:dates});
    this.setState({calenderId:event.target.value});
    console.log(event.target.value)
    this.setState({weekCalenderId:event.target.itemId})
    
}

 getDates(startDate, endDate) {
  const dates = []
  let currentDate = startDate
  const addDays = function (days) {
      const date = new Date(this.valueOf())
      date.setDate(date.getDate() + days)
      return date
  }
  while (currentDate <= endDate) {
      dates.push(currentDate.toISOString())
      currentDate = addDays.call(currentDate, 1)
  }
  console.log(dates)
  return dates
 

}
 DateToFrontEnd(value) {
  var month = value.substring(0, 2);
  var date = value.substring(3, 5);
  var year = value.substring(6, 10);
  return year + "/" + month + "/" + date;
}

 getAllCalender = () => {
  let headers = JSON.parse(sessionStorage.getItem("headers"));
  axios
  .get(config.serverURL + "/calender?dropdownFilter=true", {
    headers,
  })
      .then(res => {
          this.setState({weekCalender:res.data.map((week, id) => {
              console.log(week)
              return { id: id, label: this.DateToFrontEnd(week.startDate) + ' to ' + this.DateToFrontEnd(week.endDate), value: week.startDate + ' ' + week.endDate }
          })});
      })
      .catch(error => console.log('Error in get request for week calender', error));
}


  handleUploadFile = (e) => {
    const maxAllowedSize = 1*1024*1024;
    if (e.target.files && e.target.files.length > 0) {
      if (e.target.files[0].size > maxAllowedSize) {
        this.setState({
          invalidMssg: {
            ...this.state.invalidMssg,
            file: "File is too big. Please select file with size < 1MB",
          },
          detailsRequiredPercent: 0
        });
        this.resumeRef.current.value = null;
      } else {
        if (e.target.files[0]) {
          let temp = { ...this.state.invalidMssg };
          delete temp["file"];
          this.setState({ file: e.target.files[0], detailsRequiredPercent: 100, invalidMssg: temp });
        }
      }
    } else {
      let temp = { ...this.state.invalidMssg };
      delete temp["file"];
      this.setState({ file: null, detailsRequiredPercent: 0, invalidMssg: temp });
    }
  };

  closeModal = () => {
    this.setState({
      showModal: !this.state.showModal,
      msg: null,
      status: null,
    });
  };

  render() {
    const {
      workerId,
      workOrderId,
      calenderId
    } = this.state;
 
    return (
      
      <PageContainer>
        <PageHeader
          breadcrumbs={
            <Breadcrumbs
              className="header"
              crumbs={[
                { id: 0, text: "Timesheet", onClick: () => this.closeForm() },
                { id: 1, text: "Add Timesheet", lastCrumb: true },
              ]}
            />
          }
        />
        <Content>
          
             <Form
            onSubmit={this.sumbittimesheet}
            formEnabled={true}
            cancel={this.resetTimesheet}
          >
                <Fragment>
                <SingleSelect
                  label="Time Period"
                  name="calenderId"
                  data-testid="client-options"
                  onChange={this.handleWeekCalender}
                  value={calenderId}
                  options={this.state.timesheetOptions.map((calender) => {
                    let id = `${calender.startDate} ${calender.endDate}`;
                    return {
                      id: id,
                      name: `${calender.startDate} to ${calender.endDate}`,
                    };
                  })}    
                />          

               <SingleSelect
                  label="worker"
                  name="workerId"
                  data-testid="worker-options"
                  onChange={(e) => {
                    this.timesheetChange(e);
                  }}
                  value={workerId}
                  options={this.state.workerOptions.map((worker) => {
                    let id = worker.id;
                    return {
                      id: id,
                      name: `${worker?.firstName} ${worker?.lastName}`,
                    };
                  })}
                />

                <SingleSelect
                  label="Work Order"
                  name="workOrderId"
                  data-testid="workorder-options"
                  onChange={(e) => {
                    this.timesheetChange(e);
                  }}
                  value={workOrderId}
                  options={this.state.workOrderOptions.map((workOrder) => {
                    let id = workOrder.id;
                    return {
                      id: id,
                      name: `PRJ-${workOrder?.project?.client?.clientName.toUpperCase().substr(0, 3)}-${("00" + workOrder?.id).slice(-5)}`,
                    };
                  })}
                />
          

          <SingleSelect
           
           label="Status"
           name="timeSheetStatus"
           value={this.state.timeSheetStatus}
           onChange={(e) => this.timesheetChange(e)}
           defaultValue ='DRAFTED'
           options={[
                {id: 1, value: 'DRAFTED', name: 'Drafted' },
                { id: 2,value: 'SUBMITTED', name: 'Submitted' },
                { id: 3,value: 'SUBMITTED_UPDATED', name: 'Submitted/Updated' },
                {id: 4, value: 'COLLECTED', name: 'Collected' },
                { id: 5,value: 'PROCESSED', name: 'Processed' },
                { id: 6,value: 'CLOSED', name: 'Closed' }]} 
           required
         />
         
           <Input
            name="submittedOn"
            label=" Submitted On"
            type="date"
            id="submittedOn"
            max="2999-12-31"
            onChange={(e) => this.timesheetChange(e)}
            value={this.state.submittedOn}
          />
         
            <Input
              type="file"
              label="TimeSheet Attachment"
              data-testid="file"
              name="file"
              ref={this.resumeRef}
              onChange={(e) => this.handleUploadFile(e)}
              required
              errMssg={
                 this.state.inputErr["file"] &&
                this.state.inputErr["file"]
                   }
             />

         <TextBlock
            type="text"
            label="Comments"
            name="comments"
            value={this.state.comments || ""}
            onChange={(e) => this.timesheetChange(e)}
            maxLength="3000"
            charCount={`${
              this.state.comments ? 3000 - this.state.comments.length : 3000
            } of 3000`}
          />

<ExpandableTable
    hidePagination={true}
    headers={[
        { id: 1, label: "Day", },
        { id: 2, label: " Mon", },  
        { id: 3, label: " Tue", },
        { id: 4, label: " Wed", },
        { id: 5, label: " Thur" },
        { id: 6, label: " Fri" },
        { id: 7, label: " Sat" },
        { id: 8, label: " Sun" },
    ]}
    body={[''].map(() => {
        return {
            id: 1, cells: [
                { id: 1, data: 'Hours' },
                { 
                    id: 2, data: <td>
                        <input type='number' placeholder='0h'
                            min='0' max='24'
                            id={0}
                            name='mondayHours'
                            value={this.state.mondayHours}
                            onChange={(e) => this.timesheetChange(e)}
                        /></td>
                },
                {
                    id: 3, data: <td>
                        <input type='number' placeholder='0h'
                            min='0' max='24'
                            id={1}
                            onChange={(e) => this.timesheetChange(e)}
                            name="tuesdayHours"
                            value={this.state.tuesdayHours}
                        /></td>
                },
                {
                    id: 4, data: <td>
                        <input type='number' placeholder='0h'
                            min='0' max='24'
                            id={2}
                            onChange={(e) => this.timesheetChange(e)}
                            name="wednesdayHours"
                            value={this.state.wednesdayHours}

                        /></td>
                },
                {
                    id: 5, data: <td>
                        <input type='number' placeholder='0h'
                            min='0' max='24'
                            onChange={(e) => this.timesheetChange(e)}
                            id={3}
                            name="thursdayHours"
                            value={this.state.thursdayHours}

                        /></td>
                },
                {
                    id: 6, data: <td>
                        <input type='number' placeholder='0h'
                            min='0' max='24'
                            onChange={(e) => this.timesheetChange(e)}
                            id={4}
                            name="fridayHours"
                            value={this.state.fridayHours}

                        /></td>
                },
                {
                    id: 7, data: <td>
                        <input type='number' placeholder='0h'
                            min='0' max='24'
                            onChange={(e) => this.timesheetChange(e)}
                            id={5}
                            name="saturdayHours"
                            value={this.state.saturdayHours}

                        /></td>
                },
                {
                    id: 8, data: <td>
                        <input type='number' placeholder='0h'
                            min='0' max='24'
                            onChange={(e) => this.timesheetChange(e)}
                            id={6}
                            name="sundayHours"
                            value={this.state.sundayHours}

                        /></td>
                },
            ]
        }
    })}
/>

                </Fragment>
           
            </Form>
          <PopUp
           openModal={this.state.show}
           closePopUp={this.closePopUp}
           type={this.state?.status}
           message={{
             title:
               this.state?.status === "Error"
                 ? "Error"
                 : "Timesheet Added Succesfully",
             details: this.state?.message,
           }}
            link={
              this.state?.status === "Error" ? (
                ""
              ) : (
                <Link to="viewtimesheet">Timesheet</Link>
              )
            }
          />

        </Content>
      </PageContainer>
    );
  }
}