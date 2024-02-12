import { useCallback, useEffect, useState, useMemo } from "react";
import ArchiveModal from "../../modal/archive-modal/archiveModal"

import auth from "../../../utils/AuthService"

const Archived = (props) => {
  const { callback, archivedData, tabHeaders, openArchive, setOpenArchive } = props;
  const headers = useMemo(() => auth.getHeaders(), []);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [archive, setArchive] = useState([]);

  const getArchive = useCallback(async () => {
    try {
      const response = await callback(headers, currentPage, 10);
      if (response.statusCode === 200) {
        setArchive(response.tableData);
        setTotalItems(response.totalItems);
      }
    } catch (error) {
      console.log(error);
    }
  }, [currentPage, headers, callback]);

  useEffect(() => {
    getArchive();
  }, [currentPage, headers, getArchive, openArchive])

  return (
    <ArchiveModal
      openArchive={openArchive}
      setOpenArchive={setOpenArchive}
      loadArchive={getArchive}
      archive={archive}
      archivedData={archivedData}
      headers={tabHeaders}
      totalItems={totalItems}
      setArchiveCurrentPage={setCurrentPage}
      archiveCurrentPage={currentPage}
    />
  )
};

export default Archived;