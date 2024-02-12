import { useState, useCallback, useEffect, useMemo, forwardRef, useImperativeHandle } from "react";
import auth from "../../../../../utils/AuthService";
import { getJobsArchive } from "../../../../../API/jobs/job-apis";
import ArchiveModal from "../../../../modal/archive-modal/archiveModal";

export const JobsArchive = forwardRef(({ open, setOpen, ...props }, ref) => {
  const headers = useMemo(() => auth.getHeaders(), []);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [archive, setArchive] = useState([]);

  const getArchive = useCallback(async () => {
    const response = await getJobsArchive(headers, currentPage, 10);
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
    length: archive.length
  }))

  return (
    <ArchiveModal
      openArchive={open}
      setOpenArchive={setOpen}
      loadArchive={getArchive}
      archive={archive}
      archivedData="jobopenings"
      headers={[
        "Job Title",
        "Client",
        "Openings",
        "Hiring Manager",
        "Priority",
        "Status",
        "Employment Type",
      ]}
      totalItems={totalItems}
      setArchiveCurrentPage={setCurrentPage}
      archiveCurrentPage={currentPage}
    />
  );
});
