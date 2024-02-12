import { useState, useCallback, useEffect, useMemo } from 'react';
import auth from '../../../../utils/AuthService';
import ArchiveModal from '../../../modal/archive-modal/archiveModal';
import { getCommissionArchive } from '../../../../API/commission/commission-apis';
export const CommissionArchive = ({ open, setOpen, ...props }) => {
   const headers = useMemo(() => auth.getHeaders(), []);
   const [currentPage, setCurrentPage] = useState(1);
   const [totalItems, setTotalItems] = useState(0);
   const [archive, setArchive] = useState([]);

   const getArchive = useCallback(async () => {
      const response = await getCommissionArchive(headers, currentPage, 10);
      if (response) {
        setArchive(response.tableData);
        setTotalItems(response.totalItems);
      } 
   }, [currentPage, headers]);

   useEffect(() => {
      getArchive();
   }, [currentPage, headers, getArchive,open])

   return (
      <ArchiveModal
         openArchive={open}
         setOpenArchive={setOpen}
         loadArchive={getArchive}
         archive={archive}
         archivedData="commission"
         headers={[
            "Resource Manager",
            "Role",
            "Start Date",
            "End Date",
            "Commission Amount"
         ]}
         totalItems={totalItems}
         setArchiveCurrentPage={setCurrentPage}
         archiveCurrentPage={currentPage}
      />
   )
}