import {
  useState,
  useCallback,
  useEffect,
  useMemo,
  forwardRef,
  useImperativeHandle,
} from "react";
import auth from "../../../../../utils/AuthService";
import { getSupplierArchive } from "../../../../../API/supplier/supplier.apis";
import ArchiveModal from "../../../../modal/archive-modal/archiveModal";

export const SuppArchive = forwardRef(({ open, setOpen, ...props }, ref) => {
  const headers = useMemo(() => auth.getHeaders(), []);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [archive, setArchive] = useState([]);

  const getArchive = useCallback(async () => {
    const response = await getSupplierArchive(headers, currentPage, 10);
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
      archivedData="supplier"
      headers={[
         "Supplier",
         "Name",
         "Email",
         "Phone Number",
         "Location",
         "Title",
         "Website",
      ]}
      totalItems={totalItems}
      setArchiveCurrentPage={setCurrentPage}
      archiveCurrentPage={currentPage}
    />
  );
});
