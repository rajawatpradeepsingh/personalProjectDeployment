import LargeModal from "../../../modal/large-modal/large-modal.component";
import EditCandidatePage from "../../candidate/EditCandidate";

export const ViewNotificatedCandidate = (props) => {
  return (
    <LargeModal open={props.show} close={props.onClose} header={[]}>
      <EditCandidatePage viewOnly={props.viewOnly} />
    </LargeModal>
  );
};
