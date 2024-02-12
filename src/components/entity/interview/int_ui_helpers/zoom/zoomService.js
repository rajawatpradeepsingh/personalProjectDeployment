import { config } from "../../../../../config";
import * as service from "../../../../../utils/service.js";
import {
  zoomSettings,
  interviewRoundOptions as options,
} from "../../../../../utils/defaultData";

// APIs
export const createMeeting = async (requestBody, headers) => {
  const body = {
    ...requestBody,
    ...zoomSettings,
  };
  headers = {
    ...headers,
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  const res = await fetch(`${config.serverURL}/zoom/meeting`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  return res.json();
};

export const updateMeeting = async (requestBody, meetingId, headers) => {
  headers = {
    ...headers,
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  const res = await fetch(`${config.serverURL}/zoom/meeting/${meetingId}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify(requestBody),
  });
  return res.json();
};

export const deleteMeeting = async (meetingId, headers) => {
  headers = {
    ...headers,
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  const res = await fetch(
    `${config.serverURL}/zoom/meeting/delete/${meetingId}`,
    {
      method: "DELETE",
      headers,
    }
  );
  return res.json();
};

// Utils
export const getBody = (candidate, roundType, schedule) => {
  const dateUTC = service.getUTCData(schedule.date, schedule.startTime);
  const timeUTC = service.getUTCTime(schedule.date, schedule.startTime);
  const duration = service.datesDiff(
    `${schedule.date} ${schedule.startTime}`,
    `${schedule.date} ${schedule.endTime}`
  );
  return duration > 0
    ? {
        topic: `${candidate}`,
        type: 2, // scheduled meeting
        start_time: `${dateUTC}T${timeUTC}Z`,
        duration: Math.floor(duration / 1000 / 60), // in minutes
        timezone: service.currentTZ(),
        password: "1234567",
        agenda: options.filter(
          (o) =>
            o.id === roundType || o.name === roundType || o.const === roundType
        )[0].name,
      }
    : { err: "Duration can't be? negativeo." };
};

export const parseUrlForID = (meetingURL) => {
  const zoomMask = "zoom.us";
  try {
    const url = new URL(meetingURL);
    if (url.hostname.includes(zoomMask)) {
      const pathArr = url.pathname.split("/");
      return pathArr[pathArr.length - 1];
    }
  } catch {
    return undefined;
  }
};
