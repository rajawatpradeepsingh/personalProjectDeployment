import { Fragment, useEffect, useState ,useMemo} from "react";
import { useDispatch, useSelector } from "react-redux";
import SingleSelect from "../../../../common/select/selects.component";
import CommentCard from "../../../../others/comment-card/comment-card.component";
import MiniPagination from "../../../../ui/mini-pagination/mini-pagination.component";
import TextBlock from "../../../../common/textareas/textareas.component";
import { RightOutlined } from "@ant-design/icons";
import moment from "moment";
import { candidateStatus } from "../../../../../utils/defaultData";
import { setNewComment, setChangesMade, setAddComment } from "../../../../../Redux/candidateSlice";
import { setBasicInfo } from "../../../../../Redux/candidateSlice";
import { useCallback } from "react";
import Button from "../../../../common/button/button.component";
import { PlusOutlined } from "@ant-design/icons";
import auth from "../../../../../utils/AuthService";

const Comments = () => {
  const dispatch = useDispatch();
  const [viewCommentHistory, setViewCommentHistory] = useState(false);
  const [mostRecentComment, setMostRecentComment] = useState(null);
  const [paginationEndIndex, setPaginationEndIndex] = useState(3);
  const [filteredComments, setFilteredComments] = useState([]);
  const { newComment, addComment } = useSelector((state) => state.candidate);
  const { basicInfo, commentsInfo } = useSelector((state) => state.candidate);
  const dispatchBasic = (object) => dispatch(setBasicInfo(object));
  const dispatchChange = (object) => dispatch(setChangesMade(object));
  const dispatchNewComment = (object) => dispatch(setNewComment(object));
  const [isAdmin, setIsAdmin] = useState(false);
  const user = useMemo(() => auth.getUserInfo(), []);
  const [roleData,setRoleData]=useState(user.roles[0]);

  useEffect(() => {
    if (auth.hasAdminRole()) setIsAdmin(true);
  }, []);
  useEffect(() => {
    const filtered = commentsInfo.filter(comment => !comment.status.includes("-"));
    setFilteredComments(filtered);
  }, [commentsInfo]);

  //sort comments
  const sortComments = useCallback(
    (comments) => {
      if (comments.length >= 1) {
        let sorted = [...comments].sort((a, b) => {
          let dateA = new Date(`${a.date} ${a.time}+0000`);
          let dateB = new Date(`${b.date} ${b.time}+0000`);
          return dateB - dateA;
        });
        return sorted.slice(paginationEndIndex - 3, paginationEndIndex);
      }
    },
    [paginationEndIndex]
  );

  //get latest update
  const getMostRecentComment = useCallback(
    (comments) => {
      if (comments.length) {
        let list = sortComments(comments);
        return list[0];
      } else {
        return null;
      }
    },
    [sortComments]
  );

  useEffect(() => {
    if (filteredComments.length > 0) setMostRecentComment(getMostRecentComment(filteredComments));
  }, [filteredComments, getMostRecentComment]);

  const handleCommentPagination = (page) => {
    setPaginationEndIndex(page * 3);
  };

  // handle changes to candidates basic information
  const handleBasicInfoChange = (event) => {
    dispatchChange(true);
    dispatchBasic({ ...basicInfo, [event.target.name]: event.target.value });
    if (event.target.name === "status") dispatchNewComment({ ...newComment, status: event.target.value });

  };

  const handleCommentChange = (event) => {
    dispatchNewComment({
      ...newComment,
      [event.target.name]: event.target.value,
    });
    if (!newComment?.status)
      dispatchNewComment({ ...newComment, status: basicInfo.status });
  };

  const enableAddComment = () => {
    dispatch(setAddComment(true));
    setViewCommentHistory(false);
    dispatchNewComment({});
  };

  return (
    <Fragment>
      <div className="comment-data-container">
        <h3 className="sub-header">
          <span
            onClick={() => setViewCommentHistory(false)}
            className={`sub-header-clickable ${!viewCommentHistory ? "focus" : ""
              }`}
          >
            Last Update
          </span>
          <RightOutlined
            style={{
              margin: "0 5px",
              fontSize: "15px",
              color: "var(--tertiary)",
            }}
          />
          <span
            className={`sub-header-clickable ${viewCommentHistory ? "focus" : ""
              }`}
            onClick={() => setViewCommentHistory(true)}
          >
            History
          </span>
        </h3>
        {!viewCommentHistory && mostRecentComment && (
          <CommentCard
            title={
              mostRecentComment?.status?.split(" - ")[1]
                ? mostRecentComment?.status?.split(" - ")[1]
                : mostRecentComment?.status
            }
            subTitles={
              mostRecentComment?.clientName
                ? [mostRecentComment?.clientName, mostRecentComment?.manager]
                : []
            }
            body={mostRecentComment?.comment || "[no comment]"}
            user={mostRecentComment?.sign}
            date={moment(mostRecentComment?.date).format("MM/DD/YYYY")}
            time={mostRecentComment?.time}
          />
        )}
        {viewCommentHistory && (
          <MiniPagination
            defaultPageSize={3}
            total={filteredComments.length}
            setCurrentPage={handleCommentPagination}
          />
        )}
        {viewCommentHistory &&
          filteredComments.length > 0 &&
          sortComments(filteredComments).map((comment) => {
            return (
              <CommentCard
                key={comment.id}
                title={
                  comment.status?.split(" - ")[1]
                    ? comment.status?.split(" - ")[1]
                    : comment.status
                }
                subTitles={
                  comment.clientName
                    ? [comment.clientName, comment.manager]
                    : []
                }
                body={comment.comment || "[no comment]"}
                user={comment.sign}
                date={moment(comment.date).format("MM/DD/YYYY")}
                time={comment.time}
              />
            );
          })}
      </div>
      {!addComment && ( isAdmin || roleData.candidatePermission ?
        <Button
          type="button"
          className={"btn main outlined"}
          handleClick={enableAddComment}
        >
          <PlusOutlined className="icon" /> New Comment
        </Button>:""
      )}
      {addComment && (
        <Fragment>
          <SingleSelect
            label="Status"
            name="status"
            value={basicInfo?.status}
            onChange={handleBasicInfoChange}
            options={candidateStatus.map((status) => ({
              id: status,
              name: status,
            }))}
          />
          <TextBlock
            label="Comment"
            name="comment"
            required
            value={newComment?.comment || ""}
            onChange={handleCommentChange}
            maxLength={3000}
            charCount={`Remaining characters: ${newComment?.comment ? 3000 - newComment?.comment?.length : 3000
              } of 3000`}
          />
        </Fragment>
      )}
    </Fragment>
  );
};

export default Comments;
