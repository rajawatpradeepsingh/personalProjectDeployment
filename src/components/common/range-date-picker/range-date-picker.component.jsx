import { DatePicker } from 'antd';
import moment from "moment";
const { RangePicker } = DatePicker;

const RangeDate = (props) => {

   const onChange = (date, dateString) => {
      if (date && dateString) {
         switch(props.picker) {
            case "week":
               props.setYearRange([dateString[0].slice(0, 4), dateString[1].slice(0, 4)]);
               props.setWeekRange([moment(dateString[0]).week(), moment(dateString[1]).week()]);
               break;
            default:
               props.setYearRange([dateString[0].slice(0, 4), dateString[1].slice(0, 4)]);
               break;
         }
      }
      
      if (!date) {
         props.clear()
      }
      
   };
   
   return (
      <RangePicker picker={props.picker} onChange={onChange} style={{marginRight: '15px', height: '30px', alignSelf: 'center'}} format="YYYY/MM/DD"/>
   )
}

export default RangeDate;