import { useState, useCallback, useEffect, useMemo, forwardRef, useImperativeHandle } from "react";
import auth from "../../../../utils/AuthService";
import ArchiveModal from "../../../modal/archive-modal/archiveModal";
import { getTimesheetArchive } from "../../../../API/timesheet/timesheet apis";

export const TimesheetArchive = forwardRef(({ open, setOpen, ...props }, ref) => {
  const headers = useMemo(() => auth.getHeaders(), []);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [archive, setArchive] = useState([]);

  const getArchive = useCallback(async () => {
    const response = await getTimesheetArchive(headers, currentPage, 10);
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
      archivedData="timesheet"
      headers={[
        "Worker",
        "project",
        "TimeSheet Status",
        "Updated On",
        "Timesheet End date",
        "Bill Able Hours",
        "Comments"
        
      ]}
      totalItems={totalItems}
      setArchiveCurrentPage={setCurrentPage}
      archiveCurrentPage={currentPage}
    />
  );
});
