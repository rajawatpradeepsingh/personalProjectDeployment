import './styles.scss';
import Pagination from "../../../components/ui/pagination/Pagination"

export const SmallTable = ({ columns, data, ...props }) => {

   const getCellData = (obj) => {
      const cells = [];
      columns.forEach((col, i) => {
         obj[col.key] && col.render
           ? cells.push(<td key={i}>{col.render(obj[col.key], obj)}</td>)
           : obj[col.key] && !col.render
           ? cells.push(<td key={i}>{obj[col.key]}</td>)
           : cells.push(<td key={i}></td>);
      })
      return cells;
   }

   return (
    <div className={props.className ? `table-component-container ${props.className}` : 'table-component-container'}>
    <div className='actions-pagination-container'>

     <div className='small-table-container'>
       <table className="small-table">
         <thead>
            <tr className='small-table-headers'>
               {columns.map((col, i) => (<th key={i}>{col.title}</th>))}
            </tr>
         </thead>
         <tbody>
            {data.length > 0 && data?.map((row, i) => {
               return row && (
                  <tr key={i} className='small-table-body'>
                     {getCellData(row)}
                  </tr>
               )
            })}
         </tbody>
       </table>
       {props.includePagination && <Pagination total={props.totalItems} itemsPerPage={props.perPage} currentPage={props.currentPage} onPageChange={props.onPageChange} items={props.items} />}

     </div>
     </div>

     </div>
   );
}