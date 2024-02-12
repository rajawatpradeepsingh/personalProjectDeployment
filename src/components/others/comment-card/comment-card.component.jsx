import "./comment-card.styles.css";

const CommentCard = (props) => {
  return (
    <div className="comment-card-container">
      <h4 className="comment-title">{props.title}</h4>
      {props.subTitles && (
        <div className="sub-title-container">
          {props.subTitles.length > 0 &&
            props.subTitles.map((sub) => (
              <span key={`${sub}`} className="sub-title">
                {sub}
              </span>
            ))}
        </div>
      )}
      <div className="comment-body">
        {props.body.split('\n').map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>
      <div className="comment-dateTime-container">
        <span className="dateTime">{props.user}</span>
        <span className="dateTime">{props.date}</span>
        <span className="dateTime">{props.time}</span>
      </div>
    </div>
  );
};

export default CommentCard;
