import { useState, useCallback, useEffect, useMemo, forwardRef, useImperativeHandle } from "react";
import auth from "../../../../utils/AuthService";
import ArchiveModal from "../../../modal/archive-modal/archiveModal";
import { getWorkorderArchive } from "../../../../API/workorder/workOrder-apis";
export const WorkOrderArchive = forwardRef(({ open, setOpen, ...props }, ref) => {
  const headers = useMemo(() => auth.getHeaders(), []);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [archive, setArchive] = useState([]);

  const getArchive = useCallback(async () => {
    const response = await getWorkorderArchive(headers, currentPage, 10);
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
      archivedData="workOrders"
      headers={[
        
        "Project Name",
        "Worker",
        "Start Date",
        "End Date",
        "Resource Manager",
        "Active Date",

      ]}
      totalItems={totalItems}
      setArchiveCurrentPage={setCurrentPage}
      archiveCurrentPage={currentPage}
    />
  );
});