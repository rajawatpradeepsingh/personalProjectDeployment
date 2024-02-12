import { useState, useCallback, useEffect, useMemo, forwardRef, useImperativeHandle } from "react";
import auth from "../../../../../utils/AuthService";
import { getCalenderArchive } from "../../../../../API/calender/calender-aois";
import { archiveModalHeaders } from "../../calenderObjects";
import ArchiveModal from "../../../../modal/archive-modal/archiveModal";

export const CalenderArchive = forwardRef(({ open, setOpen, ...props }, ref) => {
  const headers = useMemo(() => auth.getHeaders(), []);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [archive, setArchive] = useState([]);

  const getArchive = useCallback(async () => {
    const response = await getCalenderArchive(headers, currentPage, 10);
    if (response) {
      setArchive(response.data);
      setTotalItems(response.totalItems);
    }
  }, [currentPage, headers]);

  useEffect(() => {
    getArchive();
  }, [currentPage, headers, getArchive,open]);

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
      archivedData="calender"
      headers={archiveModalHeaders()}
      totalItems={totalItems}
      setArchiveCurrentPage={setCurrentPage}
      archiveCurrentPage={currentPage}
    />
  );
});
