import { useState, useCallback, useEffect, useMemo, forwardRef, useImperativeHandle } from "react";
import auth from "../../../../../utils/AuthService";
import { getOnboardArchive } from "../../../../../API/onboarding/onBoarding-apis";
import { archiveModalHeaders } from "../../onboard_utils/onBoardingObjects";
import ArchiveModal from "../../../../modal/archive-modal/archiveModal";

export const OnboardArchive = forwardRef(({ open, setOpen, ...props }, ref) => {
  const headers = useMemo(() => auth.getHeaders(), []);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [archive, setArchive] = useState([]);

  const getArchive = useCallback(async () => {
    const response = await getOnboardArchive(headers, currentPage, 10);
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
      archivedData="onboarding"
      headers={archiveModalHeaders()}
      totalItems={totalItems}
      setArchiveCurrentPage={setCurrentPage}
      archiveCurrentPage={currentPage}
    />
  );
});
