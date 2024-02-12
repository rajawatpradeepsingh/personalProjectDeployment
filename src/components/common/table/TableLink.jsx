import './table.scss';

export const TableLink = (props) => {
   return (
     <div className="tablelink-container">
       <span onClick={props.onClick} className={`tablelink ${props.styleRed && 'red'} ${props.className && props.className}`}>
         {props.label}
       </span>
       {props.extra && <span className="table-link-extra">{props.extra}</span>}
     </div>
   );
}