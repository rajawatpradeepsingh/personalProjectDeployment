import { useState, useCallback, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import auth from "../../../../../utils/AuthService";
import { setIsAuth } from '../../../../../Redux/appSlice';
import { getCandidatesArchive } from '../../../../../API/candidates/candidate-apis';
import ArchiveModal from "../../../../modal/archive-modal/archiveModal";
import { archiveModalHeaders } from '../../utils/candidateObjects';

export const CandidateArchive = ({ open, setOpen, ...props }) => {
   const headers = useMemo(() => auth.getHeaders(), []);
   const dispatch = useDispatch();
   const [currentPage, setCurrentPage] = useState(1);
   const [totalItems, setTotalItems] = useState(0);
   const [archive, setArchive] = useState([]);

   const logout = useCallback(() => {
      dispatch(setIsAuth(false));
      auth.logout();
   }, [dispatch]);

   // get archived candidates data
   const getArchive = useCallback(async () => {
      try {
         const response = await getCandidatesArchive(headers, currentPage, 10);
         if (response.statusCode === 200) {
            setArchive(response.tableData);
            setTotalItems(response.totalItems);
         } else if (response.statusCode === 401) {
            logout();
         }
      } catch (error) {
         console.log(error);
      }
   }, [currentPage, headers, logout]);

   useEffect(() => {
      getArchive();
   }, [currentPage, headers, getArchive,open])

   return (
      <ArchiveModal
         openArchive={open}
         setOpenArchive={setOpen}
         loadArchive={getArchive}
         archive={archive}
         archivedData="candidates"
         headers={archiveModalHeaders()}
         totalItems={totalItems}
         setArchiveCurrentPage={setCurrentPage}
         archiveCurrentPage={currentPage}
      />
   )
}