import { Fragment } from 'react';
import Button from '../../../components/common/button/button.component';
import Pagination from "../../../components/ui/pagination/Pagination"
import { DeleteOutlined, ShareAltOutlined, SortAscendingOutlined, SortDescendingOutlined, UnorderedListOutlined } from '@ant-design/icons';
import './expandable-table.styles.css';

const ExpandableTable = (props) => {
   console.log(props.body)
   return (
      <div className={props.className ? `table-component-container ${props.className}` : 'table-component-container'}>
         <div className='actions-pagination-container'>
            {props.showBatchActions && (
               <>
                  <Button
                     type="button"
                     name="share"
                     className="icon-btn icon-text"
                     handleClick={props.openShareModal}
                  >
                     <ShareAltOutlined style={{ marginRight: "5px" }} />
                     Share
                  </Button>
                  <Button
                     type="button"
                     name="archive"
                     className="icon-btn icon-text warning"
                     handleClick={props.handleClickArchive}
                  >
                     <DeleteOutlined style={{ marginRight: "5px" }} />
                     Archive
                  </Button>
               </>
            )}
            {/* {props.includePagination && <Pagination total={props.totalItems} itemsPerPage={props.perPage} currentPage={props.currentPage} onPageChange={props.onPageChange} items={props.items} />} */}
         </div>
         <div className='tbl-container'>
            <table className='table'>
               <thead className='table-header'>
                  <tr className='table-header-row'>
                     {props.headers.map(heading => {
                        return heading.label === 'Archive' ?
                           (
                              <th key={heading.label} className="table-col-header tbl-header-btn sticky">
                                 <Button type="button" name="archive-btn" handleClick={props.handleClickArchive} className='icon-btn warning' disabled={props.disableArchive}>
                                    <DeleteOutlined />
                                 </Button>
                              </th>
                           ) : <th key={heading.label} className={heading.label === 'Role Name'? "table-col-header tbl-header-btn sticky" :(heading.className ? `table-col-header ${heading.className}` : "table-col-header")} onClick={heading.onClick ? heading.onClick : null}>
                              <span className='col-header-sortable'>
                                 {heading.sorted && (heading.sorted === "asc"
                                    ? <SortAscendingOutlined className='sort-icon' />
                                    : heading.sorted === "desc"
                                       ? <SortDescendingOutlined className='sort-icon' />
                                       : <UnorderedListOutlined style={{ marginRight: "3px" }} />)}
                                 {heading.label}
                              </span>
                           </th>
                     })}
                  </tr>
               </thead>
               <tbody className='table-body'>
                  {props.body.length ? props.body.map(row => {
                     console.log(row)
                     return (
                        <Fragment key={row.id}>
                          {props.body[0].key ? <tr key={row.id} className={props.expandedRows && props.expandedRows[`${row.id}`] ? "table-body-row expanded" : "role-table"}>
                              {row.cells.map(cell => {
                                 return (<td key={cell.id} onClick={cell.onClick ? cell.onClick : null} onMouseOver={cell.onHover ? cell.onHover : null} className="cell">
                                    {cell.data} {cell.expandBtn && cell.expandBtn}
                                 </td>)
                              })}
                           </tr>:<tr key={row.id} className={props.expandedRows && props.expandedRows[`${row.id}`] ? "table-body-row expanded" : "table-body-row"}>
                              {row.cells.map(cell => {
                                 return (<td key={cell.id} onClick={cell.onClick ? cell.onClick : null} onMouseOver={cell.onHover ? cell.onHover : null} className={cell.id === 1 || cell.id === 0 ? 'table-cell sticky':( cell.className ? `${cell.className} table-cell` : `table-cell`)}>
                                    {cell.data} {cell.expandBtn && cell.expandBtn}
                                 </td>)
                              })}
                           </tr>}
                           {((props.expandedRows && props.expandedRows[`${row.id}`]) && row.children?.length > 0) &&
                              (row.children[0].cells ? row.children?.map(childRow => (
                                 <tr key={childRow.id} className="table-body-row child-row">
                                    {childRow.cells?.map(cell => (
                                       <td key={cell.id} onClick={cell.onClick ? cell.onClick : null} className={cell.className ? `${cell.className} table-cell` : `table-cell`}>
                                          {cell.data}
                                       </td>
                                    ))}
                                 </tr>
                              )) : row.children[0].text ? row.children.map(row => (
                                 row.text.map(data => (
                                    <tr key={data.id} className="table-body-row child-row text">
                                       <td></td>
                                       <td colSpan={props.headers.length - 1} style={{ padding: "10px 0" }}>{data.data}</td>
                                    </tr>
                                 ))
                              )) : <></>)
                           }
                        </Fragment>
                     )
                  }) : null}
               </tbody>
            </table>
            {props.isLoading && <p className='no-data-txt'>Loading records...</p>}
            {!props.body.length && <p className='no-data-txt'>No records</p>}
            {props.filterNoMatch && <p className='no-data-txt'>Found no records matching filter(s)</p>}
         </div>
         {props.includePagination && <Pagination total={props.totalItems} itemsPerPage={props.perPage} currentPage={props.currentPage} onPageChange={props.onPageChange} items={props.items} />}
      </div>
   )
}

export default ExpandableTable;