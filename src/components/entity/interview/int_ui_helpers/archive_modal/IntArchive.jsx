import { useState, useCallback, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import auth from "../../../../../utils/AuthService";
import { config } from '../../../../../config';
import { setIsAuth } from '../../../../../Redux/appSlice';
import ArchiveModal from "../../../../modal/archive-modal/archiveModal";
import { archiveModalHeaders } from '../../utils/interviewObjects';

export const IntArchive = ({ open, setOpen, ...props }) => {
  const headers = useMemo(() => auth.getHeaders(), []);
  const url = useMemo(() => `${config.serverURL}/interviews`, []);
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [archive, setArchive] = useState([]);

  const logout = useCallback(() => {
    dispatch(setIsAuth(false));
    auth.logout();
  }, [dispatch]);

  const getArchive = useCallback(async () => {
    try {
      const res = await axios.get(`${url}?archives=true&pageNo=${currentPage - 1}&pageSize=${10}`, { headers });
      if (res) {
        setTotalItems(res.headers["total-elements"]);
        setArchive(res.data);
      }
    } catch (error) {
      console.log(error)
      if (error.response && error.response.status === 401) logout();
    }
  }, [url, currentPage, headers, logout]);

  useEffect(() => {
    getArchive();
  }, [currentPage, headers, getArchive, open]);

  return (
    <ArchiveModal
      openArchive={open}
      setOpenArchive={setOpen}
      loadArchive={getArchive}
      archive={archive.map((interview) => {
        return {
          id: interview.id,
          cellOne:
            `${interview.candidate.firstName} ${interview.candidate.lastName}` ||
            "",
          cellTwo: interview.interviewers.length
            ? interview.interviewers
              .map((int) => `${int.firstName} ${int.lastName}`)
              .join(", ")
            : "n/a",
          cellThree: interview.jobOpening
            ? `${interview.jobOpening?.client?.clientName} (${interview.jobOpening?.client?.address?.city})`
            : "n/a",
          cellFour: interview.roundType || "",
        };
      })}
      archivedData="interviews"
      headers={archiveModalHeaders()}
      totalItems={totalItems}
      setArchiveCurrentPage={setCurrentPage}
      archiveCurrentPage={currentPage}
    />
  )

}