import moment from "moment";
import { useState } from "react";
import CloseOnOutsideClick from "../../../utils/close-on-outside-click/CloseOnOutsideClick";
import ContextMenu from "../../../common/contextMenu/context-menu";
import { candidateContextMenu } from "./candidateObjects";

export const CandidateContext = ({ candidate }) => {
  const [contextShow, setContextShow] = useState(false);
  const [contextCoords, setContextCoords] = useState({ x: 0, y: 0 });
  const [context, setContext] = useState({});

  const handleContextMenu = (e) => {
    const home = window.location.origin;
    e.preventDefault();
    setContext({ url: `${home}/candidate/${candidate.id}` });
    setContextCoords({
      x: e.nativeEvent.layerX,
      y: e.nativeEvent.layerY,
    });
    setContextShow(true);
  };

  return (
    <CloseOnOutsideClick onClose={() => setContextShow(false)}>
      <div onContextMenu={handleContextMenu}>
        {candidate.fullName}
        <span
          style={{
            fontSize: "12px",
            color: "var(--tertiary)",
            fontWeight: "200",
            display: "block",
          }}
        >
          {moment(candidate.date).format("MM/DD/YYYY")}
        </span>
        {contextShow && (
          <ContextMenu
            close={() => setContextShow(false)}
            context={context}
            coords={contextCoords}
            options={candidateContextMenu}
            shiftTop={28}
          />
        )}
      </div>
    </CloseOnOutsideClick>
  );
};

export default CandidateContext;
