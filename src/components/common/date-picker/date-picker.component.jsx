import { DatePicker } from 'antd';
import 'antd/dist/antd.css';


const PickDate = (props) => {

   const onChange = (date, dateString) => {
      if (dateString) {
         switch(props.picker) {
            case "week":
               props.setYear(dateString.slice(0, 4))
               let weekNum = dateString.split("-")[1];
               if (weekNum.length < 4) {
                  weekNum = weekNum.slice(0, 1);
               } else {
                  weekNum = weekNum.slice(0, 2);
               }
               props.setSelectedWeek(+weekNum);
               break;
            case "month":
               let month = dateString.split("-")[1];
               props.setYear(dateString.slice(0, 4))
               props.setSelectedMonth(month);
               break;
            case "quarter": 
               props.setYear(dateString.slice(0, 4))
               let quarter = dateString.split("-Q")[1]
               props.setSelectedQuarter(+quarter);
               break;
            default:
               props.setYear(dateString.slice(0, 4))
               break;
         }
      }
      
      if (!date) {
         props.clear()
      }
      
   };

   return (
      <DatePicker onChange={onChange} picker={props.picker} size='middle' style={{marginRight: '15px', height: '30px', alignSelf: 'center'}} inputReadOnly/>
   )
}

export default PickDate;