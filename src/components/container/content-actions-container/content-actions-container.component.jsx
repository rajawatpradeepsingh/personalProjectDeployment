import './content-actions-container.styles.css';

const ContentActions = (props) => {
   return (
      <div className='content-actions-container'>
         {props.children}
      </div>
   )
}

export default ContentActions;