import React, { lazy, Suspense } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";

import Home from "../components/ui/Dashboard/Home";

const ViewCandidates = lazy(() => import("../components/entity/candidate/ViewCandidates"));
const ViewResourceManager = lazy(() => import("../components/entity/resourceManager/ViewResourceManager"));
const AddResouceManager = lazy(() => import("../components/entity/resourceManager/AddResourceManager"));
const EditResourceManager = lazy(()=> import("../components/entity/resourceManager/EditResourceManager")) 
const ViewInterviewers = lazy(() => import("../components/entity/interviewer/ViewInterviewers"));
const ViewInterviews = lazy(() => import("../components/entity/interview/ViewInterview"));
const ViewInterviewGuide = lazy(() => import("../components/entity/interviewGuide/ViewInterviewGuide"));
const ViewClients = lazy(() => import("../components/entity/client/ViewClients"));
const ViewJobs = lazy(() => import("../components/entity/jobs/ViewJobs"));
const ViewOnboardings = lazy(() => import("../components/entity/onboarding/ViewOnboardings"));
const ViewWorkers = lazy(() => import("../components/entity/worker/ViewWorkers"));
const ViewSupplier = lazy(() => import("../components/entity/supplier/ViewSupplier"));
const ViewVisatrackings = lazy(() => import("../components/entity/VisaTracking/ViewVisatracking"));
const ViewProjects = lazy(() => import("../components/entity/projects/ViewProjects"));
const AddProjects = lazy(() => import("../components/entity/projects/AddProjects"));const ViewNewUsers = lazy(() => import("../components/entity/users/viewNewUsers"));
const ViewRoles = lazy(() => import("../components/entity/Role/ViewRoles"));
const ViewZoomMeetings = lazy(() => import("../components/entity/interview/int_ui_helpers/zoom/ViewZoomMeetings"));
const ViewRateCard = lazy(() => import("../components/entity/RateCard/ViewRateCards.jsx"));
const ViewCommission = lazy(() => import("../components/entity/commission/ViewCommission.jsx"));
const ViewCommissiontpe = lazy(() => import("../components/entity/commissionType/ViewCommissionTyle.jsx"));


const AddCandidate = lazy(() => import("../components/entity/candidate/AddCandidate"));
const AddInterviewer = lazy(() => import("../components/entity/interviewer/AddInterviewer"));
const ScheduleInterview = lazy(() => import("../components/entity/interview/ScheduleInterview"));
const AddClient = lazy(() => import("../components/entity/client/AddClient"));
const AddJob = lazy(() => import("../components/entity/jobs/AddJob"));
const AddOnboarding = lazy(() => import("../components/entity/onboarding/AddOnboarding"));
const AddWorker = lazy(() => import("../components/entity/worker/AddWorker"));
const AddSupplier = lazy(() => import("../components/entity/supplier/AddSupplier"));
const AddRole = lazy(() => import("../components/entity/Role/AddRole"));
const AddRateCard = lazy(() => import("../components/entity/RateCard/AddRateCard"));
const AddParameter = lazy(() => import("../components/entity/Parameters/AddParameter"));
const EditModifyInterviewGuide = lazy(() => import("../components/entity/interviewGuide/EditModifyInterviewGuide"));

const EditCandidatePage = lazy(() => import("../components/entity/candidate/EditCandidate"));
const EditInterviewerPage = lazy(() => import("../components/entity/interviewer/EditInterviewer"));
const EditInterview = lazy(() => import("../components/entity/interview/EditInterview"));
const ModifyInterviewGuide = lazy(() => import("../components/entity/interviewGuide/ModifyInterviewGuide"));
const EditClientPage = lazy(() => import("../components/entity/client/EditClient"));
const EditJobPage = lazy(() => import("../components/entity/jobs/edit-job"));
const EditOnboardingPage = lazy(() => import("../components/entity/onboarding/EditOnBoarding"));
const EditWorkerPage = lazy(() => import("../components/entity/worker/EditWorker"));
const EditSupplierPage = lazy(() => import("../components/entity/supplier/EditSupplier"));
const EditVisaTrackingPage = lazy(() => import("../components/entity/VisaTracking/EditVisatracking"));
const EditRolePage = lazy(() => import("../components/entity/Role/edit-role.page"));
const EditParameterPage = lazy(() => import("../components/entity/Parameters/EditParameter"));
const EditUserPage = lazy(() => import("../components/entity/users/editUser"));
const EditRateCardPage = lazy(() => import("../components/entity/RateCard/editRateCardModal"));
const EditProjectsPage = lazy(() => import("../components/entity/projects/EditProjectPage.jsx"))
const ViewWorkOrder = lazy(() => import("../components/entity/workOrder/ViewWorkOrder.jsx"));
const AddWorkOrder = lazy(() => import("../components/entity/workOrder/AddWorkOrder.jsx"));
const EditWorkOrderPage = lazy(() => import("../components/entity/workOrder/EditWorkOrderPage"));
const ViewTimesheet = lazy(() => import("../components/entity/timesheet/ViewTimesheet"));
const AddTimesheet = lazy(() => import("../components/entity/timesheet/AddTimesheet.jsx"));
const EditTimesheet = lazy(() => import("../components/entity/timesheet/EditTimeSheet.jsx"));
const ViewCalender = lazy(() => import("../components/entity/calender/ViewCalender"));
const AddCalender = lazy(() => import("../components/entity/timesheet/AddTimesheet.jsx"));
const AddCommissionType = lazy(() => import("../components/entity/commissionType/AddCommissionType.jsx"));
const EditCommissionTypePage = lazy(() => import("../components/entity/commissionType/EditCommissionType.jsx"));
const AddCommission = lazy(() => import("../components/entity/commission/AddCommission.jsx"));
const ViewDetailCommission = lazy(() => import("../components/entity/commission/ViewCommissionDetails.jsx"));
const ViewParameters = lazy(() => import("../components/entity/Parameters/ViewParameters.jsx"));

const Faqs = lazy(() => import("../components/entity/faqs/faqs"));

const Routing = () => {
  const { navMenuOpen } = useSelector((state) => state.nav);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/addcandidate" render={(props) => <AddCandidate {...props} navMenuOpen={navMenuOpen} />} />
        <Route path="/viewresourcemanager" exact component={ViewResourceManager} />
        <Route path="/addresourcemanager" exact component={AddResouceManager} />
        <Route path="/resourcemanager/:resourceManagerId" exact component={EditResourceManager} />
        <Route path="/viewcandidates" exact component={ViewCandidates} />
        <Route path="/candidate/:candidateId" exact component={EditCandidatePage} />
        <Route path="/addinterviewer" exact component={AddInterviewer} />
        <Route path="/viewinterviewers" exact component={ViewInterviewers} />
        <Route path="/interviewer/:interviewerId" exact component={EditInterviewerPage} />
        <Route path="/scheduleinterview" exact component={ScheduleInterview} />
        <Route path="/viewinterviews" exact component={ViewInterviews} />
        <Route path="/edit/interview" exact component={EditInterview} />
        <Route path="/addguide" exact component={ModifyInterviewGuide} />
        <Route path="/viewguides" exact component={ViewInterviewGuide} />
        <Route path="/guide/:guideId" exact component={ModifyInterviewGuide} />
        <Route path="/addclient" exact component={AddClient} />
        <Route path="/viewclients" exact component={ViewClients} />
        <Route path="/clients/:clientId" exact component={EditClientPage} />
        <Route path="/addjob" render={(props) => <AddJob {...props} navMenuOpen={navMenuOpen} />} />
        <Route path="/viewjobs" exact component={ViewJobs} />
        <Route path="/job/:jobId" exact component={EditJobPage} />
        <Route path="/addonboarding" render={(props) => <AddOnboarding {...props} navMenuOpen={navMenuOpen} />} />
        <Route path="/viewonboardings" exact component={ViewOnboardings} />
        <Route path="/onboarding/:onboardingId" exact component={EditOnboardingPage} />
        <Route path="/addworker" exact component={AddWorker} />
        <Route path="/viewworkers" exact component={ViewWorkers} />
        <Route path="/worker/:workerId" exact component={EditWorkerPage} />
        <Route path="/addsupplier" exact component={AddSupplier} />
        <Route path="/Viewsuppliers" exact component={ViewSupplier} />
        <Route path="/supplier/:supplierId" exact component={EditSupplierPage} />
        <Route path="/viewvisatrackings" exact component={ViewVisatrackings} />
        <Route path="/visatracking/:visaTrackingId" exact component={EditVisaTrackingPage} />
        <Route path="/viewratecards" exact component={ViewRateCard} />
        <Route path="/addratecard" exact component={AddRateCard} />
        <Route path="/viewusers" exact component={ViewNewUsers} />
        <Route path="/addrole" render={(props) => <AddRole {...props} navMenuOpen={navMenuOpen} />} />
        <Route path="/viewroles" exact component={ViewRoles} />
        <Route path="/edit/:roleId" exact component={EditRolePage} />
        <Route path="/addparameter" exact component={AddParameter} />
        <Route path="/parameter/:parameterId" exact component={EditParameterPage} />
        <Route path="/viewzoomlink" exact component={ViewZoomMeetings} />
        <Route path="/ratecard/:rateCardId" exact component={EditRateCardPage} />
        <Route path="/ratecard/:rateCardId" exact component={EditRateCardPage} />
        <Route path="/users/:userId" exact component={EditUserPage} />
        <Route path="/faqs" exact component={Faqs} />
        <Route path="/addprojects" exact component={AddProjects} />
        <Route path="/viewprojects" exact component={ViewProjects} />
        <Route path="/projects/:managerId" exact component={EditProjectsPage} />
        <Route path="/workOrders/:workOrderId" exact component={EditWorkOrderPage} />
        <Route path="/viewworkOrder" exact component={ViewWorkOrder} />
        <Route path="/addworkOrder" exact component={AddWorkOrder} />
        <Route path="/timesheet/:timesheetId" exact component={EditTimesheet} />
        <Route path="/viewtimesheet" exact component={ViewTimesheet} />
        <Route path="/addtimesheet" exact component={AddTimesheet} />
        <Route path="/viewcalender" exact component={ViewCalender} />
        <Route path="/addcalender" exact component={AddCalender} />
        <Route path="/guides/:guideId" exact component={EditModifyInterviewGuide} />
        <Route path="/viewcommission" exact component={ViewCommission} />
        <Route path="/viewcommissiontype" exact component={ViewCommissiontpe} />
        <Route path="/addcommissiontype" exact component={AddCommissionType} />
        <Route path="/commissionType/:commTypeId" exact component={EditCommissionTypePage} />
        <Route path="/commission/:commId" exact component={ViewDetailCommission} />
        <Route path="/addcommission" exact component={AddCommission} />
        <Route path="/viewparameters" exact component={ViewParameters} />

        <Redirect to="/" />
      </Switch>
    </Suspense >
  )
}

export default Routing; 