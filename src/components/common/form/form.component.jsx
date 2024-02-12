import Button from '../button/button.component';
import './form.styles.css';

const Form = (props) => {
   return (
      <form
         className={`form-container ${props.className}`}
         encType="multipart/form-data"
         onSubmit={props.onSubmit}
      >
         {props.children}
         {props.formEnabled &&
            <div className={`form-btns-container ${props.className}`}>
               <Button type="reset" className="btn main marginX reset" name="reset-form-btn" handleClick={props.cancel}>Cancel</Button>
               <Button type="submit" className="btn main marginX submit" name="submit-form-btn">Submit</Button>
            </div>
         }
      </form>
   )
}

export default Form;