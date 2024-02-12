import { useState, useEffect } from 'react';
import moment from 'moment';
import { SmallTable } from '../../../../common/small_table/SmallTable';
import { NoData } from '../../../../common/no-data/NoData';
import Pagination from "../../../../ui/pagination/Pagination";

export const VisaHistory = ({ history, ...props }) => {
   const [data, setData] = useState([]);
   useEffect(() => {
      if (history.length) {
         const hist = history.map((h) => ({
           birthCountry: h.countryOfBirth,
           citizenOf: h.visaCountry,
           residesIn: h.visaCountryOfResidence,
           type: h.visaType,
           status: h.visaStatus,
           start: h.visaStartDate,
           expires: h.visaExpiryDate,
           applied: h.visaAppliedDate,
           user: h.user,
           updatedDate: h.updatedDate,
           id: h.visaHistoryId,
         }));
         setData(hist);
      }
   }, [history]);


   const columns = [
     {
       title: "Status",
       key: "status",
       render: (status) => (
         <span
           className={`small-table-status ${status && status.toLowerCase()}`}
         >
           {status}{" "}
         </span>
       ),
     },
     {
       title: "Updated",
       key: "user",
       render: (user, row) => (
         <div className="updatedon-container">
           <span>{user}</span>
           <span>
             {row?.updatedDate
               ? moment(row?.updatedDate).format("MM/DD/YYYY")
               : ""}
           </span>
         </div>
       ),
     },
     {
       title: "Birth Country",
       key: "birthCountry",
     },
     {
       title: "Citizen of",
       key: "citizenOf",
     },
     {
       title: "Resides In",
       key: "residesIn",
     },
     {
       title: "Visa Type",
       key: "type",
     },
     {
       title: "Starts On",
       key: "start",
       render: (start) => (start ? moment(start).format("MM/DD/YYYY") : ""),
     },
     {
       title: "Expires On",
       key: "expires",
       render: (expires) => (expires ? moment(expires).format("MM/DD/YYYY") : ""),
     },
     {
       title: "Applied On",
       key: "applied",
       render: (applied) => (applied ? moment(applied).format("MM/DD/YYYY") : "")
     },
   ];

   const changeTablePage = (page) => {
     props.setCurrentPage(page);
   };

   if (!history.length) {
      return (
         <NoData/>
      )
   }

   return (
     <>
       <SmallTable data={data} columns={columns} />
       {props.totalItems > 5 && (
          <Pagination
            total={props.totalItems}
            itemsPerPage={5}
            currentPage={props.currentPage}
            onPageChange={changeTablePage}
          />
      )}
     </>
   );

}