import { createSlice } from "@reduxjs/toolkit";

const filterSlice = createSlice({
  name: "filters",
  initialState: {
    candidateOptions: [],
    clientOptions: [],
    interviewerOptions: [],
    jobOptions: [],
    recruiterOptions: [],
    skillsOptions: [],
    workerOptions: [],
    supplierOptions:[],
    rateCardWorkerOption: [],
    visatrackingOptions: [],
    subContractorOptions: [],
    supplierTitleOptions: [],
    visaTypeOptions: [],
    sellerOptions: [],
    recruiterOption: [],
    visaCOCOptions: [],
    paramTypeOptions: [],
    paramLevelOptions: [],
    paramValueOptions: []
  },
  reducers: {
    setCandidateOptions(state, action) {
      state.candidateOptions = action.payload;
    },
    setClientOptions(state, action) {
      state.clientOptions = action.payload;
    },
    setWorkerOptions(state, action) {
      state.workerOptions = action.payload;
    },
    setInterviewerOptions(state, action) {
      state.interviewerOptions = action.payload;
    },
    setJobOptions(state, action) {
      state.jobOptions = action.payload;
    },
    setRecruiterOptions(state, action) {
      state.recruiterOptions = action.payload;
    },
    setSkillsOptions(state, action) {
      state.skillsOptions = action.payload;
    },
    setSupplierOptions(state, action) {
      state.supplierOptions = action.payload;
    },
    setRateCardWorkerOption(state, action) {
      state.rateCardWorkerOption = action.payload;
    },
    setVisatrackingOptions(state, action) {
      state.visatrackingOptions = action.payload;
    },
    setSubContractorOptions(state, action) {
      state.subContractorOptions = action.payload;
    },
    setSupplierTitleOptions(state, action) {
      state.supplierTitleOptions = action.payload;
    },
    setVisaTypeOptions(state, action) {
      state.visaTypeOptions = action.payload;
    },
    setSellerOptions(state, action) {
      state.sellerOptions = action.payload;
    },
    setRecruiterOption(state, action) {
      state.recruiterOption = action.payload;
    },
    setVisaCOCOptions(state, action) {
      state.visaCOCOptions = action.payload;
    },
    setParamTypeOptions(state, action) {
      state.paramTypeOptions = action.payload;
    },
    setParamLevelOptions(state, action) {
      state.paramLevelOptions = action.payload;
    },
    setParamValueOptions(state, action) {
      state.paramValueOptions = action.payload;
    },
  },
});

export default filterSlice.reducer;
export const {
  setCandidateOptions,
  setSkillsOptions,
  setInterviewerOptions,
  setJobOptions,
  setRecruiterOptions,
  setClientOptions,
  setWorkerOptions,
  setSupplierOptions,
  setRateCardWorkerOption,
  setVisatrackingOptions,
  setSubContractorOptions,
  setSupplierTitleOptions,
  setVisaTypeOptions,
  setSellerOptions,
  setRecruiterOption,
  setVisaCOCOptions,
  setParamTypeOptions,
  setParamLevelOptions,
  setParamValueOptions
} = filterSlice.actions;
