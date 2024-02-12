import {
  useState,
  useCallback,
  useEffect,
  useMemo,
  forwardRef,
  useImperativeHandle,
} from "react";
import auth from "../../../../../utils/AuthService";
import { getInterviewerArchive } from "../../../../../API/interviewers/interviewer-apis";
import { archiveModalHeaders } from "../../intvwr_utils/interviewerObjects";
import ArchiveModal from "../../../../modal/archive-modal/archiveModal";

export const IntrvwrArchive = forwardRef(({ open, setOpen, ...props }, ref) => {
  const headers = useMemo(() => auth.getHeaders(), []);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [archive, setArchive] = useState([]);

  const getArchive = useCallback(async () => {
    const response = await getInterviewerArchive(headers, currentPage, 10);
    if (response) {
      setArchive(response.data);
      setTotalItems(response.totalItems);
    }
  }, [currentPage, headers]);

  useEffect(() => {
    getArchive();
  }, [currentPage, headers, getArchive]);

  useImperativeHandle(ref, () => ({
    loadArchive() {
      getArchive();
    },
    length: archive.length,
  }));

  return (
    <ArchiveModal
      openArchive={open}
      setOpenArchive={setOpen}
      loadArchive={getArchive}
      archive={archive}
      archivedData="interviewer"
      headers={archiveModalHeaders()}
      totalItems={totalItems}
      setArchiveCurrentPage={setCurrentPage}
      archiveCurrentPage={currentPage}
    />
  );
});
