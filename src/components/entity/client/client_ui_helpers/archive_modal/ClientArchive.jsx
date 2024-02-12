import { useState, useCallback, useEffect, useMemo } from 'react';
import auth from "../../../../../utils/AuthService";
import { getClientArchive } from '../../../../../API/clients/clients-apis';
import ArchiveModal from "../../../../modal/archive-modal/archiveModal";

export const ClientArchive = ({ open, setOpen, ...props }) => {
   const headers = useMemo(() => auth.getHeaders(), []);
   const [currentPage, setCurrentPage] = useState(1);
   const [totalItems, setTotalItems] = useState(0);
   const [archive, setArchive] = useState([]);

   const getArchive = useCallback(async () => {
      const response = await getClientArchive(headers, currentPage, 10);
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
         archivedData="clients"
         headers={[
            "Client",
            "Phone No.",
            "Website",
            "Location"
         ]}
         totalItems={totalItems}
         setArchiveCurrentPage={setCurrentPage}
         archiveCurrentPage={currentPage}
      />
   )
}