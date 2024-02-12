import { getAddress, getFullName } from "../../../../utils/service";

// iterate through candidate objects and return values (exclude non searchable values)
const getSearchSuggestions = (obj) => {
  let suggestions = [];
  for (let key in obj) {
    if (
      (typeof obj[key] === "string" || typeof obj[key] === "number") &&
      key !== "id" &&
      obj[key] !== ""
    ) {
      if (key === "location") {
        const objKeys = obj[key].split(", ");
        for (let i = 0; i < objKeys.length; i++) suggestions.push(objKeys[i]);
      }
      if (key === "primarySoftwareSkill") {
        const objKeys = obj[key].split(",");
        for (let i = 0; i < objKeys.length; i++) suggestions.push(objKeys[i]);
      } else if (key === "fullName" || key === "recruiterName") {
        let values = obj[key].split(" ");
        suggestions.push(values[0], values[1]);
      } else {
        suggestions.push(obj[key]);
      }
    } else if (
      typeof obj[key] === "object" &&
      key !== "resume" &&
      key !== "recruiter" &&
      key !== "comments"
    ) {
      suggestions = suggestions.concat(getSearchSuggestions(obj[key]));
    }
  }
  return suggestions;
};

export const generateSearchSuggestions = (candidatesList) => {
  let options = [];
  for (let obj of candidatesList) {
    let results = getSearchSuggestions(obj);
    results.forEach((item) => {
      if (!options.includes(item)) options.push(item);
    });
  }
  return options;
};

export const mapCandidatesList = (data) => {
  return data.map((candidate) => {
    let currency = candidate.professionalInfo?.expectedCtcCurrency || "";
    let value =
      candidate.professionalInfo?.startExpCTC &&
      candidate.professionalInfo?.endExpCTC
        ? `${candidate.professionalInfo?.startExpCTC} - ${candidate.professionalInfo?.endExpCTC}`
        : candidate.professionalInfo?.startExpCTC &&
          !candidate.professionalInfo?.endExpCTC
        ? candidate.professionalInfo?.startExpCTC
        : !candidate.professionalInfo?.startExpCTC &&
          candidate.professionalInfo?.endExpCTC
        ? candidate.professionalInfo?.endExpCTC
        : candidate.professionalInfo?.expectedCtcValue
        ? candidate.professionalInfo?.expectedCtcValue
        : "";
    let type = candidate.professionalInfo?.expectedCtcType
      ? `${
          candidate.professionalInfo?.expectedCtcType.includes("Annual")
            ? "/yr"
            : "/hr"
        }`
      : "";
    let tax = candidate.professionalInfo?.expectedCtcTax
      ? `, ${candidate.professionalInfo?.expectedCtcTax}`
      : "";
    return {
      id: candidate.id,
      fullName: getFullName(candidate),
      role: candidate.role || "",
      experience: `${candidate.professionalInfo?.totalExperience || ""} ${
        candidate.professionalInfo?.totalExpPeriod || ""
      }`,
      workAuth: candidate.workAuthStatus || "",
      ctc: `${currency}${value}${type}${tax}`,
      ctcValue: value ? value : "",
      location: getAddress(candidate.address),
      resume: candidate.resume ? candidate.resume : null,
      status: candidate.status,
      source: candidate.source ? candidate.source : "",
      recruiterName: getFullName(candidate.recruiter),
      recruiter: candidate.recruiter || null,
      relocate: candidate.relocate || "",
      comments: candidate.professionalInfo?.commentList || [],
      isSuspicious: candidate.isSuspicious,
      date: candidate.date,
      email: candidate.email,
    };
  });
};

export const mapCandidate = (res) => {
  let data = {};
  data.candidateData = res.data;
  data.candidateProfessionalInfo = res.data.professionalInfo;
  data.candidateComments = res.data.professionalInfo?.commentList;
  data.resumeData = res.data.resume;
  data.statusCode = res.status;
  return data;
};

export const mapActivitiesData = (activities, comments) => {
  const data = {
    submissions: 0,
    onboardings: 0,
    rejections: 0,
    interviews: 0,
    confirmations: 0,
  };
  let lastUpdate = "";
  let lastUpdateDate = "";
  if (comments.length) {
    for (let comment of comments) {
      if (comment.status.includes("Submitted")) data.submissions += 1;
      if (comment.status.includes("Onboarded")) data.onboardings += 1;
      if (comment.status.includes("Rejected")) data.rejections += 1;
    }
    let history = [...comments];
    let sorted = history.sort((a, b) => {
      let dateA = new Date(`${a.date} ${a.time}+0000`);
      let dateB = new Date(`${b.date} ${b.time}+0000`);
      return dateB - dateA;
    });

    lastUpdateDate = new Date(`${sorted[0].date} ${sorted[0].time}`);

    lastUpdate = sorted[0].status?.split(" - ")[1]
      ? `${sorted[0].status?.split(" - ")[1]}`
      : sorted[0].comment || `${sorted[0].status?.split(" - ")[0]}`;
  }

  if (activities.status === 200) {
    activities.data.forEach((track) => {
      for (const record of track.histories) {
        if (new Date(record.updatedDate) > lastUpdateDate)
          lastUpdate =
            record.trackingStatus === "INTERVIEW" &&
            record.comment.includes("{")
              ? `${record.trackingStatus}: ${
                  JSON.parse(record.comment).round
                } || ${JSON.parse(record.comment).comment}`
              : `${record.trackingStatus}: ${record.comment}`;
        switch (record.trackingStatus) {
          case "SUBMISSION":
            data.submissions = data.submissions + 1;
            break;
          case "ON_BOARDING":
            data.onboardings += 1;
            break;
          case "REJECTED":
            data.rejections += 1;
            break;
          case "INTERVIEW":
            data.interviews += 1;
            break;
          case "CONFIRMED":
            data.confirmations += 1;
            break;
          default:
            break;
        }
      }
    });
  }
  return [data, lastUpdate];
};

export const mapActivity = (activities, jobId) => {
  if (activities.data.length) {
    const activity = activities.data.filter(
      (track) => track.jobOpening && track.jobOpening?.id === jobId
    );
    const match = activity.filter(
      (track) =>
        track.trackingStatus === "SUBMISSION" ||
        track.trackingStatus === "INTERVIEW"
    )[0];
    if (activity.length > 0 && match) {
      //candidate has been submitted to job and still in submission/interview phase, ok to proceed
      return { status: "SUCCESS", data: match };
    } else if (activity.length > 0 && !match) {
      //candidate was submitted to job but has since moved on to pending or further status
      return {
        status: "ERROR",
        message: "Error: Activity past interview phase",
      };
    } else {
      //candidate has not been submitted to job yet
      return {
        status: "ERROR",
        message:
          "Error: Submit candidate to Job Opening before scheduling interviews",
      };
    }
  } else {
    return {
      status: "ERROR",
      message:
        "Error: Submit candidate to Job Opening before scheduling interviews",
    };
  }
};

export const mapCandidateBody = (state) => {
  let newComment;
  if (state.comments !== "")
    newComment = {
      comment: state.comments,
      sign: state.user.username,
      status: "New",
    };

  const candidate = {
    address: {
      country: state.country,
      countryCode: state.countryCode,
      state: state.state,
      stateCode: state.stateCode,
      city: state.city,
    },
    professionalInfo: {
      comments: state.comments,
      commentList: state.comments !== "" ? [newComment] : [],
      currentCtcCurrency: state.currentCtcCurrency,
      currentCtcValue: state.currentCtcValue,
      currentCtcType: state.currentCtcType,
      currentCtcTax: state.currentCtcTax,
      currentEmployer: state.currentEmployer,
      currentEmployerContact: state.currentEmployerContact,
      expectedCtcCurrency: state.expectedCtcCurrency,
      startExpCTC: state.startExpCTC,
      endExpCTC: state.endExpCTC,
      expectedCtcType: state.expectedCtcType,
      expectedCtcTax: state.expectedCtcTax,
      noticePeriodCount: state.noticeCountUnits,
      noticePeriodType: state.noticePeriodType,
      primarySoftwareSkill: state.primarySoftwareSkill,
      secondarySkill: state.secondarySkill,
      totalExperience: state.totalExperience !== 0 ? state.totalExperience : "",
      relevantExperience:
        state.relevantExperience !== 0 ? state.relevantExperience : "",
      totalExpPeriod: state.totalExpPeriod,
      relExpPeriod: state.relExpPeriod,
      currentJobTitle: state.currentJobTitle,
      reasonForJobChange: state.reasonForJobChange,
      offerInHand: state.offerInHand,
      healthBenefit: state.healthBenefit,
      sickLeave: state.sickLeave,
      pto: state.pto,
    },
    dateOfBirth: state.dateOfBirth,
    email: state.email,
    firstName: state.firstName,
    gender: state.gender,
    lastName: state.lastName,
    phoneNumber: state.phoneNumber,
    linkedinProfile: state.linkedinProfile,
    portfolioProfile: state.portfolioProfile,
    workAuthStatus: state.workAuthStatus,
    professionalRoles: state.professionalRoles,
    relocate: state.relocate,
    source: state.source,
    referralName: state.referralName,
    recruiter:
      state.recruiterId === ""
        ? { id: state.user.id }
        : { id: state.recruiterId },
    role: state.role,
  };

  return candidate;
};
