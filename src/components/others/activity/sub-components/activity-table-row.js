import moment from "moment";
import Button from "../../../../components/common/button/button.component";
import { ActivityPopover } from "./table-popover.component";
import { Popover } from "antd";
import { CalendarFilled, DeleteOutlined } from "@ant-design/icons";
import { PlusOutlined } from "@ant-design/icons";

export const activityTableRows = (activity, fn, updateFn, editFn, deleteFn) => {
  return activity.length
    ? activity.map((activity) => ({
        id: activity.id,
        cells: [
          {
            id: 0,
            className: "sticky",
            data: (
              <div className="activity-job-details">
                <span
                  className={`activity-details-text bold ${
                    activity.job?.client ? "clickable" : ""
                  }`}
                  onClick={() =>
                    activity.job?.id
                      ? fn(activity.job?.id, null, null)
                      : fn(null, activity.job.title, activity.job.client)
                  }
                >
                  {activity.newFormat
                    ? activity.job.title
                    : activity.job.title.split("(")[0]}
                </span>
                <span className="activity-details-text">
                  {activity.job.client}
                </span>
                <span className="activity-details-text light">
                  {moment(activity.created).format("MM.DD.YYYY")}
                </span>
              </div>
            ),
          },
          {
            id: 1,
            data: (
              <Button
                type="button"
                className={"icon-btn"}
                handleClick={() => updateFn(activity)}
                disabled={
                  activity.currentStatus === "REJECTED" ||
                  activity.status?.includes("Rej") ||
                  activity.currentStatus === "ON_BOARDING" ||
                  activity.status?.includes("Onb") ||
                  activity.status === ""
                  // || (recruiter && recruiter !== activity.user.id)
                }
              >
                <PlusOutlined />
              </Button>
            ),
          },
          {
            id: 2,
            data:
              (activity.newFormat && activity.submission) ||
              (!activity.newFormat && activity.status === "Submitted") ? (
                <ActivityPopover
                  dateClassName="blue"
                  activity={activity}
                  status={"submission"}
                  current={"SUBMISSION"}
                  fn={editFn}
                  selDate={activity.submittedOn}
                  deleteFn={deleteFn}
                />
              ) : (
                <span className="no-data-dash">- -</span>
              ),
          },
          {
            id: 3,
            data:
              (activity.newFormat && activity.interviews.length) ||
              (!activity.newFormat && activity.status === "Interview") ? (
                <Popover
                  placement="bottom"
                  overlayInnerStyle={{
                    maxWidth: "500px",
                    maxHeight: "250px",
                    overflowY: "auto",
                    overflowX: "hidden",
                  }}
                  content={
                    <div>
                      {activity.newFormat ? (
                        <ul style={{ listStyle: "none" }}>
                          {activity?.interviews?.map((int, index) => (
                            <li key={index}>
                              {!int.comment.includes("{") ? (
                                int.comment
                              ) : (
                                <div className="interview-data">
                                  <span className="interview-round">
                                    {JSON.parse(int.comment).round}
                                    {activity.currentStatus === "INTERVIEW" &&
                                      JSON.parse(int.comment).id &&
                                      new Date(
                                        `${JSON.parse(int.comment).date} ${
                                          JSON.parse(int.comment).start
                                        }+0000`
                                      ) > new Date() && (
                                        <Button
                                          className={"icon-btn warning"}
                                          handleClick={() =>
                                            deleteFn(
                                              int.id,
                                              JSON.parse(int.comment).id
                                            )
                                          }
                                        >
                                          <DeleteOutlined />
                                        </Button>
                                      )}
                                  </span>
                                  <span className="interview-date">
                                    {JSON.parse(int.comment).date} from{" "}
                                    {JSON.parse(int.comment).start} to{" "}
                                    {JSON.parse(int.comment).end} (
                                    {JSON.parse(int.comment).timezone})
                                  </span>
                                  <span className="interview-comment">
                                    {JSON.parse(int.comment).comment}
                                  </span>
                                </div>
                              )}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        activity.comment
                      )}
                    </div>
                  }
                  title={
                    <div className="popover-activity-title">
                      <span className="popover-status">
                        Interview(s) Schedule
                      </span>
                    </div>
                  }
                >
                  <div className="activity-date outline">
                    <CalendarFilled />
                  </div>
                </Popover>
              ) : (
                <span className="no-data-dash">- -</span>
              ),
          },
          {
            id: 4,
            data:
              (activity.newFormat && activity.pending) ||
              (!activity.newFormat && activity.status === "Pen") ? (
                <ActivityPopover
                  dateClassName=""
                  activity={activity}
                  status={"pending"}
                  current={"PENDING"}
                  selDate={activity.pendingOn}
                  fn={editFn}
                  deleteFn={deleteFn}
                />
              ) : (
                <span className="no-data-dash">- -</span>
              ),
          },
          {
            id: 5,
            data:
              (activity.newFormat && activity.confirmed) ||
              (!activity.newFormat && activity.status === "Con") ? (
                <ActivityPopover
                  dateClassName="orange"
                  activity={activity}
                  status={"confirmed"}
                  current={"CONFIRMED"}
                  fn={editFn}
                  selDate={activity.confirmedOn}
                  deleteFn={deleteFn}
                />
              ) : (
                <span className="no-data-dash">- -</span>
              ),
          },
          {
            id: 6,
            data:
              (activity.newFormat && activity.onboarded) ||
              (!activity.newFormat &&
                (activity.status === "Onb" || activity.status === "")) ? (
                <ActivityPopover
                  dateClassName="green"
                  activity={activity}
                  status={"onboarded"}
                  current={"ON_BOARDING"}
                  selDate={activity.onboardedOn}
                  fn={editFn}
                  deleteFn={deleteFn}
                />
              ) : (
                <span className="no-data-dash">- -</span>
              ),
          },
          {
            id: 7,
            data:
              (activity.newFormat && activity.rejected) ||
              (!activity.newFormat && activity.status === "Rej") ? (
                <ActivityPopover
                  dateClassName="red"
                  activity={activity}
                  status={"rejected"}
                  current={"REJECTED"}
                  selDate={activity.rejectedOn}
                  fn={editFn}
                  deleteFn={deleteFn}
                />
              ) : (
                <span className="no-data-dash">- -</span>
              ),
          },
        ],
      }))
    : [];
};
