import { useState, useEffect } from "react";
import moment from "moment";
import { ViewState } from "@devexpress/dx-react-scheduler";
import {
  Appointments,
  CurrentTimeIndicator,
  DateNavigator,
  DayView,
  MonthView,
  Scheduler,
  TodayButton,
  Toolbar,
  ViewSwitcher,
  WeekView,
} from "@devexpress/dx-react-scheduler-material-ui";
import * as  service from "../../../utils/service";
import { CalendarOutlined, HistoryOutlined } from "@ant-design/icons";
import { Card, Drawer } from "antd";
import "antd/dist/antd.css";
import "./schedule.styles.css";

const Schedule = ({ interviews, ...props }) => {
  const [currentDate, setCurrentDate] = useState(new Date()?.toISOString());
  const [records, setRecords] = useState([]);
  const [currentViewName, setCurrentViewName] = useState("Month");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState({});

  useEffect(() => {
    if (interviews.length) {
      setRecords(
        interviews.map((record) => {
          return {
            title: `${record.roundType?.split("_").join(" ")} for ${record.candidate?.firstName} ${record.candidate?.lastName}`,
            startDate: record.schedule?.startTimeZ,
            endDate: record.schedule?.endTimeZ,
            roundType: record.roundType,
            interviewers: record.interviewers.map((i) => `${i.firstName} ${i.lastName}`).join(", "),
            meetingURL: record.schedule?.meetingURL,
            feedback: record.schedule?.feedback && record.schedule?.feedback !== "NULL" ? record.schedule.feedback : "",
            decision: record.schedule?.decision && record.schedule?.decision !== "NULL" ? record.schedule.decision : "",
            record: record,
          };
        })
      );
    }
  }, [interviews]);

  const currentViewNameChange = (name) => {
    setCurrentViewName(name);
  };

  const currentDateChange = (date) => {
    setCurrentDate(date);
    if (props?.setMonth) props?.setMonth(moment(date).month() + 1);
    if (props?.setYear) props?.setYear(moment(date).year());
  };

  const handleAppointmentClicked = (appointment) => {
    setSelectedRecord(appointment);
    setOpenDrawer(true);
  };

  const Appointment = ({ children, style, ...restProps }) => (
    <Appointments.Appointment
      {...restProps}
      style={{
        ...style,
        backgroundColor:
          new Date(restProps.data.endDate) <= new Date()
            ? "rgb(154, 156, 171, 0.7)"
            : "#46b37d",
        borderRadius: "5px",
      }}
      onClick={() => handleAppointmentClicked(restProps.data.record)}
    >
      {children}
    </Appointments.Appointment>
  );

  const onClose = () => {
    setOpenDrawer(false);
  };

  return (
    <div className="schedule-container">
      <Card bordered={false} >
        <Scheduler height={props.height ? props.height : 650} data={records}>
          <ViewState
            currentDate={currentDate}
            currentViewName={currentViewName}
            onCurrentViewNameChange={currentViewNameChange}
            onCurrentDateChange={currentDateChange}
          />
          <DayView cellDuration={30} />
          <WeekView cellDuration={30} />
          <MonthView />
          <Toolbar />
          <DateNavigator />
          <TodayButton />
          <ViewSwitcher />
          <Appointments appointmentComponent={Appointment} />
          <CurrentTimeIndicator
            shadePreviousCells={true}
            shadePreviousAppointments={true}
            updateInterval={10000}
          />
        </Scheduler>
      </Card>
      <Drawer
        title={
          selectedRecord.candidate
            ? `${selectedRecord.roundType?.split("_").join(" ")} for ${selectedRecord.candidate?.firstName
            } ${selectedRecord.candidate?.lastName}`
            : ""
        }
        placement="bottom"
        closable={true}
        onClose={onClose}
        open={openDrawer}
        getContainer={false}
        style={{ position: "absolute" }}
      >
        <div className="record-details-container">
          <div className="record-date-time-container">
            <span className="disabled-form-text">
              <span>
                <CalendarOutlined style={{ marginRight: "10px" }} />
              </span>
              {service.getLocalDateFromDatetime(selectedRecord?.schedule?.startTimeZ, "MM/DD/YYYY")}
            </span>
            <span className="disabled-form-text">
              <span>
                <HistoryOutlined style={{ marginRight: "10px" }} />
              </span>
              {`${service.displayTime(selectedRecord?.schedule?.startTimeZ)} - ${service.displayTime(selectedRecord?.schedule?.endTimeZ)}`}
            </span>
          </div>
          <div className="record-additional">
            {!selectedRecord.schedule?.decision && (
              <a
                className="record-url"
                href={`${selectedRecord?.schedule?.meetingURL}`}
                target="_blank"
                rel="noreferrer"
              >
                {selectedRecord?.schedule?.meetingURL}
              </a>
            )}
            <span className="disabled-form-text">
              <span className="disabled-form-bold-text">Interviewers:</span>{" "}
              {selectedRecord?.interviewers
                ?.map((i) => `${i.firstName} ${i.lastName}`)
                .join(", ")}
            </span>
            {selectedRecord.interviewLink && (
              <a
                className="record-url"
                href={`${selectedRecord?.interviewLinkL}`}
                target="_blank"
                rel="noreferrer"
              >
                {selectedRecord?.interviewLink}
              </a>
            )}
            {selectedRecord.schedule?.decision &&
              selectedRecord.schedule?.decision !== "NULL" && (
                <span className="disabled-form-text">
                  {selectedRecord.schedule?.decision}
                </span>
              )}
            {selectedRecord.schedule?.feedback && (
              <span className="disabled-form-text long">
                {selectedRecord.schedule?.feedback}
              </span>
            )}
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default Schedule;
