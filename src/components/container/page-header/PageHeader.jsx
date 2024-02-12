import "./page_header_styles.scss";

export const PageHeader = (props) => {
  return (
    <div className={`pg-header`}>
      {props.title && <h1 className="pg-title">{props.title}</h1>}
      {props.breadcrumbs && props.breadcrumbs}
      {props.actions && <div className="pg-actions">{props.actions}</div>}
    </div>
  );
};
