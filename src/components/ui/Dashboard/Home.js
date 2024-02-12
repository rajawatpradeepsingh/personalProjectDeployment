import React, { useState, useEffect, useCallback } from "react";
import auth from "../../../utils/AuthService";
import { setIsAuth } from "../../../Redux/appSlice";
import { useDispatch } from "react-redux";
import BarChart from "../../ui/stats/barchart";
import StatFilters from "../../ui/stats/statFilters";
import DataSummary from "../../ui/stats/dataSummary";
import moment from "moment";
import PickDate from "../../common/date-picker/date-picker.component";
import DropdownMenu from "../../common/dropdown/dropdown.component.jsx";
import RangeDate from "../../common/range-date-picker/range-date-picker.component.jsx";
import Content from "../../container/content-container/content-container.component.jsx";
import ContentActions from "../../container/content-actions-container/content-actions-container.component";
import { Popover } from "antd";
import { getActivitiesAll } from "../../../API/candidates/candidate-apis";
import { getEnabledUsers } from "../../../API/users/user-apis";
import { filterUsersByRole } from "../../entity/users/utils/utils";
import { PageContainer } from "../../container/page-container/PageContainer";
import { PageHeader } from "../../container/page-header/PageHeader";

import IdleTimeOutHandler from "../Dashboard/IdleTimeOutHandler"

import "./home.scss";

const dateSettings = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};

function Home() {
  const [headers] = useState(auth.getHeaders());
  const [userName, setUserName] = useState("");
  const [submissions, setSubmissions] = useState([]);
  const [confirmations, setConfirmations] = useState([]);
  const [rejections, setRejections] = useState([]);
  const [onboarded, setOnboarded] = useState([]);
  const [candidateList, setcandidateList] = useState();
  const [monthSubmissions, setMonthSubmissions] = useState([]);
  const [monthConfirmations, setMonthConfirmations] = useState([]);
  const [monthOnboardings, setMonthOnboardings] = useState([]);
  const [monthRejections, setMonthRejections] = useState([]);
  const [selectedUserName, setSelectedUserName] = useState("");
  const [recruiterOptions, setRecruiterOptions] = useState([]);
  const [managerOptions, setManagerOptions] = useState([]);
  const [currentUser, setCurrentUser] = useState("");
  const [userInfo] = useState(auth.getUserInfo());
  const [hasAdminRole, setHasAdminRole] = useState(false);
  const [hasRecruiterRole, setHasRecruiterRole] = useState(false);
  const [hasBDManagerRole, setHasBDManagerRole] = useState(false);
  const dispatch = useDispatch();
  const [totalCandidates, setTotalCandidates] = useState(0);
  const [months, setMonths] = useState([]);
  const date = new Date().getFullYear();
  const [year, setYear] = useState(date);
  const [period, setPeriod] = useState("");
  const [selectedW, setSelectedW] = useState("");
  const [selectedM, setSelectedM] = useState("");
  const [selectedQ, setSelectedQ] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [weekRange, setWeekRange] = useState([]);
  const [yearRange, setYearRange] = useState([]);
  const [currentDay] = useState(
    new Date().toLocaleDateString(undefined, dateSettings)
  );

   const[isActive,setIsActive]=useState(true)
  const[isLogout,setLogout]=useState(false)

  useEffect(() => {
    setMonths([
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
      "07",
      "08",
      "09",
      "10",
      "11",
      "12",
    ]);
  }, []);

  useEffect(() => {
    if (auth.checkAuth()) {
      setHasAdminRole(auth.hasAdminRole());
      setHasRecruiterRole(auth.hasRecruiterRole());
      setHasBDManagerRole(auth.hasBDManagerRole());
    } else {
      auth.logout();
    }
  }, []);

  useEffect(() => {
    dispatch(setIsAuth(auth.checkAuth()));
  }, [dispatch]);

  useEffect(() => {
    const userName = userInfo.firstName
      ? userInfo.firstName
      : userInfo.username;
    setUserName(userName);
    setCurrentUser(userInfo.id);
    setSelectedUser(userInfo.id);
  }, [hasRecruiterRole, hasBDManagerRole, userInfo]);

  useEffect(() => {
    if (hasBDManagerRole) setSelectedUser(userInfo.id);
  }, [hasBDManagerRole, userInfo]);

  const loadUsers = useCallback(() => {
    getEnabledUsers(headers).then((res) => {
      if (res.data) {
        if (hasAdminRole) {
          setRecruiterOptions(filterUsersByRole(res.data, "recruiter"));
          setManagerOptions(
            filterUsersByRole(res.data, "business_dev_manager")
          );
        }
        if (hasBDManagerRole)
          setRecruiterOptions(filterUsersByRole(res.data, "recruiter"));
      }
    });
  }, [headers, hasAdminRole, hasBDManagerRole]);

  const getCandidateData = useCallback(async () => {
    try {
      if (!selectedUser) return;
      const res = await getActivitiesAll(headers);
      const data = res.data?.candidateDashboardList;
      const responseData = res.data;
      if (data.length) {
        let parsed = data;
        if (yearRange.length) {
          parsed = data
            .filter((i) => i.date) // rid null values
            .filter(
              (i) =>
                parseInt(i.date.split("-")[0]) === parseInt(yearRange[0]) ||
                parseInt(i.date.split("-")[0]) === parseInt(yearRange[1])
            )
            .filter(
              (i) =>
                moment(i.date).week() === weekRange[0] ||
                moment(i.date).week() === weekRange[1]
            );
        } else {
          parsed = data
            .filter((i) => i.date) // rid null values
            .filter((i) => parseInt(i.date.split("-")[0]) === parseInt(year))
            .filter((i) => {
              if (selectedW) return moment(i.date).week() === selectedW;
              if (selectedQ) return moment(i.date).quarter() === selectedQ;
              if (selectedM) return i.date.split("-")[1] === selectedM;
              if (weekRange.length)
                return (
                  moment(i.date).week() === weekRange[0] ||
                  moment(i.date).week() === weekRange[1]
                );
              return true;
            });
        }
        const candidates = responseData.candidateList.filter((i) => {
          return (
            i.status === "Active" ||
            i.status === "Ready to be Marketed" ||
            i.status === "New" ||
            i.status === "Hold" ||
            i.status === "Closed" ||
            i.status === "Passive"
          );
        });
        const submitted = parsed.filter((i) => i.status === "SUBMISSION");
        const confirmed = parsed.filter((i) => i.status === "CONFIRMED");
        const onbboarded = parsed.filter((i) => i.status === "ON_BOARDING");
        const rejected = parsed.filter((i) => i.status === "REJECTED");
        setcandidateList(responseData.candidateList);
        setTotalCandidates(candidates?.length);
        setSubmissions(submitted);
        setConfirmations(confirmed);
        setOnboarded(onbboarded);
        setRejections(rejected);
      } else {
        setTotalCandidates(0);
        setSubmissions(0);
        setConfirmations(0);
        setOnboarded(0);
        setRejections(0);
      }
    } catch (err) {
      console.log("Error:", err);
    }
  }, [
    year,
    yearRange,
    selectedW,
    selectedM,
    selectedQ,
    weekRange,
    selectedUser,
    headers,
  ]);

  useEffect(() => {
    getCandidateData();
  }, [
    year,
    yearRange,
    selectedW,
    selectedM,
    selectedQ,
    weekRange,
    getCandidateData,
  ]);

  useEffect(() => {
    if (currentUser || selectedUser) loadUsers();
  }, [currentUser, selectedUser, loadUsers]);

  useEffect(() => {
    if (submissions)
      setMonthSubmissions(
        months.map(
          (month) =>
            submissions.filter((data) => data.date.split("-")[1] === month)
              .length
        )
      );
    if (confirmations)
      setMonthConfirmations(
        months.map(
          (month) =>
            confirmations.filter((data) => data.date.split("-")[1] === month)
              .length
        )
      );
    if (onboarded)
      setMonthOnboardings(
        months.map(
          (month) =>
            onboarded.filter((data) => data.date.split("-")[1] === month).length
        )
      );
    if (rejections)
      setMonthRejections(
        months.map(
          (month) =>
            rejections.filter((data) => data.date.split("-")[1] === month)
              .length
        )
      );
  }, [submissions, confirmations, onboarded, rejections, year, months]);

  const handleSelectedUserChange = (id, name) => {
    setSelectedUser(id);
    setSelectedUserName(name);
  };

  const handlePeriodChange = (period) => {
    setPeriod(period);
  };

  const clearFilters = () => {
    setSelectedUser(auth.getUserInfo().id);
    setSelectedUserName("");
    setYear(new Date().getFullYear());
    setPeriod("");
    setSelectedW("");
    setSelectedM("");
    setSelectedQ("");
    setWeekRange([]);
    setYearRange([]);
  };

  const closeModal = () => {
    setTotalCandidates({});
  };

  const clearDatePicker = () => {
    setYear(new Date().getFullYear());
    setSelectedW("");
    setSelectedM("");
    setSelectedQ("");
    setWeekRange([]);
    setYearRange([]);
  };

  return (
    
    <PageContainer>
      <PageHeader
        title={`Welcome ${userName ? userName : "User"}`}
        actions={<span className="current-date-time">{currentDay}</span>}
      />
    
        
         <IdleTimeOutHandler 
    onActive={()=>{setIsActive(true)}} 
    onIdle={()=>{setIsActive(false)}}
    onLogout={()=>{setLogout(true)}}
    />
  
      <Content className="full-page">
        <ContentActions>
          <StatFilters
            clearFilters={clearFilters}
            showClear={selectedUserName || period}
          >
            {!hasRecruiterRole && (
              <DropdownMenu
                menuTitle={selectedUserName ? selectedUserName : "User..."}
                handleSelect={handleSelectedUserChange}
                selected={selectedUser}
                items={
                  hasAdminRole
                    ? [
                        {
                          key: "1",
                          label: "Sales Managers",
                          children: managerOptions.map((manager) => {
                            return {
                              key: `1-${manager.id}`,
                              label: `${manager.firstName} ${manager.lastName}`,
                            };
                          }),
                        },
                        {
                          key: "2",
                          label: "Recruiters",
                          children: recruiterOptions.map((recruiter) => {
                            return {
                              key: `2-${recruiter.id}`,
                              label: `${recruiter.firstName} ${recruiter.lastName}`,
                            };
                          }),
                        },
                      ]
                    : hasBDManagerRole
                    ? [
                        {
                          key: "2",
                          label: "Recruiters",
                          children: recruiterOptions.map((recruiter) => {
                            return {
                              key: `2-${recruiter.id}`,
                              label: `${recruiter.firstName} ${recruiter.lastName}`,
                            };
                          }),
                        },
                      ]
                    : []
                }
              />
            )}
            <DropdownMenu
              menuTitle={
                period
                  ? `${period.charAt(0).toUpperCase()}${period.substring(1)}`
                  : "Period..."
              }
              handleSelect={handlePeriodChange}
              selected={period}
              items={[
                { key: "1-week", label: "Week" },
                { key: "1-range (Week)", label: "Week Range" },
                { key: "2-month", label: "Month" },
                { key: "3-quarter", label: "Quarter" },
                { key: "4-year", label: "Year" },
              ]}
            />
            {period && period !== "range (Week)" && (
              <PickDate
                picker={period}
                setSelectedWeek={setSelectedW}
                setSelectedQuarter={setSelectedQ}
                setYear={setYear}
                setSelectedMonth={setSelectedM}
                clear={clearDatePicker}
              />
            )}
            {period === "range (Week)" && (
              <RangeDate
                picker="week"
                setWeekRange={setWeekRange}
                setYearRange={setYearRange}
                clear={clearDatePicker}
              />
            )}
          </StatFilters>
        </ContentActions>
        <div className="dashboard-overview">
      
          <Popover
            placement="top"
            close={closeModal}
            content={
              <>
                {candidateList && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                    }}
                  >
                    <span className="activity-pill navyblue">
                      New:
                      {candidateList.filter((i) => i.status === "New").length}
                    </span>
                    <span className="activity-pill blue">
                      Active:
                      {
                        candidateList.filter((i) => i.status === "Active")
                          .length
                      }
                    </span>
                    <span className="activity-pill green">
                      Ready to be Marketed:
                      {
                        candidateList.filter(
                          (i) => i.status === "Ready to be Marketed"
                        ).length
                      }
                    </span>
                    <span className="activity-pill orange">
                      Hold:
                      {candidateList.filter((i) => i.status === "Hold").length}
                    </span>
                    <span className="activity-pill black">
                      Passive:
                      {
                        candidateList.filter((i) => i.status === "Passive")
                          .length
                      }{" "}
                    </span>
                    <span className="activity-pill red">
                      Closed:
                      {
                        candidateList.filter((i) => i.status === "Closed")
                          .length
                      }
                    </span>
                  </div>
                )}
              </>
            }
          >
            <span className="no-data-dash"></span>

            <DataSummary
              data={{
                total: totalCandidates,
                label: "Total Candidates",
                theme: "general",
              }}
            />
          </Popover>
          <DataSummary
            data={{
              total: submissions.length,
              label: "Candidates Submitted",
              theme: "submit",
            }}
          />
          <DataSummary
            data={{
              total: confirmations.length,
              label: "Candidates Confirmed",
              theme: "confirm",
            }}
          />
          <DataSummary
            data={{
              total: onboarded.length,
              label: "Candidates Onboarded",
              theme: "onboard",
            }}
          />
          <DataSummary
            data={{
              total: rejections.length,
              label: "Candidates Rejected",
              theme: "reject",
            }}
          />
        </div>
        <BarChart
          year={year}
          dataSets={[
            {
              label: "Submissions",
              data: monthSubmissions,
              color: "rgb(117, 139, 253)",
            },
            {
              label: "Confirmations",
              data: monthConfirmations,
              color: "#ff8600",
            },
            {
              label: "OnBoardings",
              data: monthOnboardings,
              color: "#46b37d",
            },
            {
              label: "Rejections",
              data: monthRejections,
              color: "#e71d36",
            },
          ]}
          chartHeading={"Candidate Activity Year Summary"}
        />
      </Content>
    </PageContainer>
  );
}
export default Home;
