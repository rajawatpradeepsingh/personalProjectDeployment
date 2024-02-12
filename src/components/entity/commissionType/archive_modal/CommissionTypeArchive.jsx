import { useState, useCallback, useEffect, useMemo } from 'react';
import auth from '../../../../utils/AuthService';
import ArchiveModal from '../../../modal/archive-modal/archiveModal';
import { getCommissionTypeArchive } from '../../../../API/commissionType/commission-apis';
export const CommissionTypeArchive = ({ open, setOpen, ...props }) => {
   const headers = useMemo(() => auth.getHeaders(), []);
   const [currentPage, setCurrentPage] = useState(1);
   const [totalItems, setTotalItems] = useState(0);
   const [archive, setArchive] = useState([]);

   const getArchive = useCallback(async () => {
      const response = await getCommissionTypeArchive(headers, currentPage, 10);
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
         archivedData="commissionType"
         headers={[
            "Commision Type",
            "Commission Rate",
            "Margin Bracket ($)"
            
         ]}
         totalItems={totalItems}
         setArchiveCurrentPage={setCurrentPage}
         archiveCurrentPage={currentPage}
      />
   )
}