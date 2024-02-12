import { combineReducers, configureStore } from "@reduxjs/toolkit";
import appSlice from "./appSlice";
import candidateSlice from "./candidateSlice";
import jobSlice from "./jobSlice";
import clientSlice from "./clientSlice";
import addressSlice from "./addressSlice";
import interviewerSlice from "./interviewerSlice";
import interviewSlice from "./interviewSlice";
import rolesSlice from "./rolesSlice";
import dictionariesSlice from "./dictionariesSlice";
import filterSlice from "./filterSlice";
import navMenuSlice from "./navMenuSlice";
import workerSlice from "./workerSlice";
import supplierSlice from "./supplierSlice";
import rateCardSlice from "./rateCardSlice";
import visatrackingSlice from "./visatrackingSlice";
import parameterSlice from "./parameterSlice";
import IGuideSlice from "./iGuide";
import shareDataSlice from "./shareDataSlice";
import noteSlice from "./noteSlice";
import onBoardingSlice from "./onBoarding";
import notificationSlice from "./notificationSlice";
import userSlice from "./userSlice";
import managerSlice from "./managerSlice";
import projectSlice from "./projectSlice";
import workOrderSlice from "./workOrderSlice";
import timesheetSlice from "./timesheetSlice";
import commissionTypeSlice from "./commissionTypeSlice";
const rootReducer = combineReducers({
  app: appSlice,
  candidate: candidateSlice,
  job: jobSlice,
  client: clientSlice,
  interviewer: interviewerSlice,
  interview: interviewSlice,
  address: addressSlice,
  roles: rolesSlice,
  filters: filterSlice,
  nav: navMenuSlice,
  dictionaries: dictionariesSlice,
  worker: workerSlice,
  supplier: supplierSlice,
  ratecard: rateCardSlice,
  visatracking: visatrackingSlice,
  parameter: parameterSlice,
  iGuide: IGuideSlice,
  shareDate: shareDataSlice,
  notes: noteSlice,
  onBoarding: onBoardingSlice,
  notification: notificationSlice,
  users: userSlice,
  manager: managerSlice,
  project: projectSlice,
  timesheet:timesheetSlice,
  workOrder: workOrderSlice,
  commissionType:commissionTypeSlice,


});

export const store = configureStore({
  reducer: rootReducer,
});
