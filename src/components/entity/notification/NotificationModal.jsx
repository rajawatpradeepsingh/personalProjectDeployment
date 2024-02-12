import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedNotification, setShowNotification } from "../../../Redux/notificationSlice";
import LargeModal from "../../modal/large-modal/large-modal.component";
import Input from "../../common/input/inputs.component";
import { mapNotification } from "./utils/notificationObjects";

export const NotificationModal = ({ mapper }) => {
  const dispatch = useDispatch();
  const { selectedNotification, showNotification } = useSelector(state => state.notification);
  const [data, setData] = useState({});
  const [isMultiTabs, setMultiTabs] = useState(false);

  const closeModal = () => {
    dispatch(setSelectedNotification({}));
    dispatch(setShowNotification(false));
    setData({});
  };

  useEffect(() => {
    if (selectedNotification?.id) {
      const mapped = mapNotification(mapper, selectedNotification);
      setData(mapped);
      setMultiTabs(Array.isArray(mapped?.body?.tabs));
    }
  }, [mapper, selectedNotification]);

  const getSections = (sections) => (
    sections.map((section, ind) => (
      <div key={ind} className="long-form-subsection">
        {
          Object.keys(section).map(key => {
            const row = section[key];
            return (
              <Input
                key={row.label}
                type="text"
                label={row.label}
                name={row.label}
                onChange={() => { }}
                value={row.value}
                disabled
              />
            );
          })
        }
      </div>
    )));

  return (
    data?.header ? (
      <LargeModal
        open={showNotification}
        close={closeModal}
        header={{ text: `${data.header}`, }}
      >{
          isMultiTabs
            ? data.body.tabs.map(tab => (
              <div key={tab.label}>
                <div className="edit-modal-header">{tab.label}</div>
                {tab?.sections && getSections(tab.sections)}
              </div>
            ))
            : data.body?.sections && getSections(data.body.sections)
        }
      </LargeModal>
    ) : (<></>)
  );
};
