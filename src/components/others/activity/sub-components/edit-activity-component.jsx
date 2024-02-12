import { useEffect, useState } from "react";
import { config } from "../../../../config";
import auth from "../../../../utils/AuthService";
import axios from "axios";
import SingleSelect from "../../../common/select/selects.component";
import TextBlock from "../../../common/textareas/textareas.component";
import Button from "../../../common/button/button.component";
import { message } from "antd";

export const EditActivity = ({ record, jobs, clients, ...props }) => {
   const [headers] = useState(auth.getHeaders());
   const [jobOptions, setJobOptions] = useState([]);
   const [client, setClient] = useState("");

   const formInitialState = { jobId: null, comment: "" };
   const [activity, setActivity] = useState(formInitialState);

   useEffect(() => {
      setActivity({
         jobId: record.job.id ? record.job.id : null,
         comment: record.history.filter(history => history.trackingStatus === record.currentStatus)[0].comment ? record.history.filter(history => history.trackingStatus === record.currentStatus).reverse()[0].comment : ""
      });
   }, [record]);

   useEffect(() => {
      setClient(record.job.client || "Internal");
   }, [record]);

   useEffect(() => {
      if (client !== "Internal") {
         setJobOptions(
            jobs
               .filter((job) => job.status === "Active")
               .filter((job) => `${job.client?.clientName} (${job.client?.address?.city})` === client)
         );
      }
   }, [client, jobs]);

   const handleChange = (event) => {
      const { name, value } = event.target;
      if (name === "client") {
         setClient(value);
         setActivity({ ...activity, jobId: null })
      } else {
         setActivity({
            ...activity,
            [name]: value
         })
      }
   }

   const handleSubmit = async (event) => {
      event.preventDefault();
      const data = {
         ...activity,
         trackingStatus: record.currentStatus,
         candidateId: parseInt(props.candidate)
      }
      try {
         const response = await axios.patch(`${config.serverURL}/activities/${record.id}`, data, { headers });
         if (response.status === 200) {
            setActivity(formInitialState);
            props.success();
         }
      } catch (error) {
         console.log(error);
         message.error(`${error.response ? error.response : 'An error occured while submitting edit.'}`)
      }
   }

   const handleCancel = () => {
      setActivity(formInitialState);
      props.cancel();
   }

   return (
      <div className="activity-form">
         <SingleSelect
            name="client"
            value={client}
            onChange={handleChange}
            placeholder="Select Client"
            label="Client || Internal"
            options={clients}
            disabled={record.currentStatus !== "SUBMISSION"}
            required
         />
         {client !== "Internal" && (
            <SingleSelect
               disabled={record.currentStatus !== "SUBMISSION"}
               value={activity.jobId}
               onChange={handleChange}
               label="Job Opening"
               name="jobId"
               options={jobOptions.map((job) => ({
                  id: job.id,
                  value: job.id,
                  name: `${job.jobTitle}`,
               }))}
               required={client !== "Internal Interview"}
            />
         )}
         <TextBlock
            label="Comment"
            name="comment"
            value={activity.comment}
            onChange={handleChange}
            maxLength={3000}
            charCount={`Remaining characters: ${activity.comment ? 3000 - activity.comment?.length : 3000
               } of 3000`}
         />
         <Button type="reset" className={"btn main reset"} onClick={handleCancel}>
            CANCEL
         </Button>

         <Button
            type="submit"
            className={"btn main submit marginX"}
            onClick={handleSubmit}
         >
            SUBMIT
         </Button>
      </div>
   );
}
