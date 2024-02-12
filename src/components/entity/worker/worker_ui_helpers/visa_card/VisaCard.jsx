import { useCallback } from "react";
import { useHistory } from "react-router-dom";
import moment from "moment";
import Input from "../../../../common/input/inputs.component";
import "./visa.scss";

export const VisaCard = ({ visa, onClick }) => {

  const history = useHistory();
  const openEditPage = useCallback((id) => {
    history.push(`/visatracking/${id}`);
  }, [history]);


   return (
     <div className="visa-card" onClick={() => openEditPage(visa.id)}>
       <Input readOnly label="Country of Birth" value={visa?.countryOfBirth} />
       <Input
         readOnly
         label="Country of Residence"
         value={visa?.visaCountryOfResidence}
       />
       <Input
         readOnly
         label="Country of Citizenship"
         value={visa?.visaCountry}
       />
       <Input readOnly label="Visa Type" value={visa?.visaType} />
       <Input readOnly label="Visa Status" value={visa?.visaStatus} />
       <Input
         readOnly
         label="Applied on"
         value={
           visa?.visaAppliedDate
             ? moment(visa?.visaAppliedDate).format("MM/DD/YYYY")
             : visa?.visaAppliedDate
         }
       />
       <Input
         readOnly
         label="Start Date"
         value={
           visa?.visaStartDate
             ? moment(visa?.visaStartDate).format("MM/DD/YYYY")
             : visa?.visaStartDate
         }
       />
       <Input
         readOnly
         label="Expires"
         value={
           visa?.visaExpiryDate
             ? moment(visa?.visaExpiryDate).format("MM/DD/YYYY")
             : visa?.visaExpiryDate
         }
       />
     </div>
   );
}