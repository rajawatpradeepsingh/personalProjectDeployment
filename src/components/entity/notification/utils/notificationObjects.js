import * as service from "../../../../utils/service";

export const mapNotification = (mapper, data) => {
  if (mapper === "interviews") return notificationMapInterview(data);
  if (mapper === "interviewers") return notificationMapInterviewer(data);
  if (mapper === "clients") return notificationMapClient(data);
  if (mapper === "jobs") return notificationMapJob(data);
  return null;
};

export const notificationMapClient = (data) => {
  const { address } = data;
  return {
    header: `Client: ${data?.clientName || ""} (${address?.city}) `,
    body: {
      sections: [
        {
          client: {
            label: "Client Name",
            value: data?.clientName || "",
          },
          phoneNumber: {
            label: "Phone Num.",
            value: data?.phoneNumber || "",
          },
          website: {
            label: "Website",
            value: data?.website || "",
          },
        },
        {
          country: {
            label: "Country",
            value: address?.country || "",
          },
          state: {
            label: "State / Province",
            value: address?.state || "",
          },
          addressLine1: {
            label: "Address Line 1",
            value: address?.addressLine1 || "",
          },
          addressLine2: {
            label: "Address Line 2",
            value: address?.addressLine2 || "",
          },
          addressLine3: {
            label: "Address Line 3",
            value: address?.addressLine3 || "",
          },
          postalCode: {
            label: "ZIP Code",
            value: address?.postalCode || "",
          },
        },
      ],
    },
  };
};

export const notificationMapInterview = (data) => {
  const { candidate, schedule, interviewers } = data;
  return {
    header: `Interview: ${service.getFullName(candidate)}`,
    body: {
      tabs: [
        {
          label: "Schedule",
          sections: [
            {
              roundType: { label: "Round", value: data?.roundType || "" },
              jobOpening: {
                label: "Job Opening",
                value: data?.jobOpening?.jobTitle || "",
              },
              date: { label: "Date", value: schedule?.date || "" },
              startTime: {
                label: "Start Time",
                value:
                  service.getLocalTimeFromDatetime(
                    schedule?.startTimeZ,
                    true
                  ) || "",
              },
              endTime: {
                label: "End Time",
                value:
                  service.getLocalTimeFromDatetime(schedule?.endTimeZ, true) ||
                  "",
              },
              meetingURL: {
                label: "Meeting Link",
                value: data?.meetingURL || "",
              },
            },
            interviewers.length && {
              interviewers: {
                label: "Interviewer(s)",
                value: interviewers
                  .map((i) => `${i.firstName} ${i.lastName}`)
                  .join(", "),
              },
            },
          ],
        },
        {
          label: "Feedback & Decision",
          sections: [
            {
              decision: { label: "Decision", value: schedule?.decision || "" },
              interviewLink: {
                label: "Link to Recording",
                value: schedule?.interviewLink || "",
              },
              feedback: { label: "Feedback", value: schedule?.feedback || "" },
            },
          ],
        },
      ],
    },
  };
};

export const notificationMapInterviewer = (data) => {
  const { client, address } = data;
  return {
    header: `Interviewer: ${service.getFullName(data)}`,
    body: {
      sections: [
        {
          firstName: { label: "First Name", value: data?.firstName || "" },
          lastName: { label: "Last Name", value: data?.lastName || "" },
          email: { label: "email", value: data?.email || "" },
          phone_no: { label: "Phone Num.", value: data?.phone_no || "" },
          total_experience: {
            label: "Work Experience",
            value: data?.total_experience || "",
          },
        },
        {
          client: {
            label: "Client",
            value: client?.clientName || "",
          },
          located: {
            label: "Located In",
            value: client?.address?.city || "",
          },
        },
        {
          country: {
            label: "Country",
            value: address?.country || "",
          },
          state: {
            label: "State / Province",
            value: address?.state || "",
          },
          city: {
            label: "City",
            value: address?.city || "",
          },
        },
        {
          interview_skills: {
            label: "Interview Skills",
            value: data?.interview_skills || "",
          },
        },
      ],
    },
  };
};

export const notificationMapJob = (data) => {
  const { client } = data;
  return {
    header: `Job Opening: №DH${("00000" + data?.id).slice(-5)} ${
      data?.jobTitle
    } (${client?.clientName} - ${client?.address?.city}) `,
    body: {
      sections: [
        {
          jobTitle: { label: "Job Title", value: data?.jobTitle || "" },
          hiringManager: {
            label: "Hiring Manager",
            value: data?.hiringManager || "",
          },
          jobType: {
            label: "Employment Type",
            value: data?.jobType || "",
          },
          workType: {
            label: "Work Type",
            value: data?.workType || "",
          },
          period: {
            label: "Period",
            value: data?.period || "",
          },
          currency: {
            label: "Client Bill Rate",
            value: `${data?.currency || ""}${data?.clientBillRate || ""}`,
          },
          priority: {
            label: "Priority",
            value: data?.priority || "",
          },
          noOfJobopenings: {
            label: "No. of Openings",
            value: data?.noOfJobopenings || "",
          },
          status: {
            label: "Status",
            value: data?.status || "",
          },
          taxType: {
            label: "Tax Type",
            value: data?.taxType || "",
          },
          flsaType: {
            label: "FLSA Type",
            value: data?.flsaType || "",
          },
        },
        {
          client: {
            label: "Client",
            value: client?.clientName || "",
          },
          located: {
            label: "Located In",
            value: client?.address?.city || "",
          },
        },
        {
          jobDescription: {
            label: "Job Description",
            value: data?.jobDescription || "",
          },
        },
        { comments: { label: "Comments", value: data?.comments || "" } },
      ],
    },
  };
};
