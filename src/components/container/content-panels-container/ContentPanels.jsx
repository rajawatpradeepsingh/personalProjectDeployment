import './styles.scss';

export const ContentPanels = (props) => {
   return (
      <div className='content-panels-container'>
         {props.children}
      </div>
   )
}