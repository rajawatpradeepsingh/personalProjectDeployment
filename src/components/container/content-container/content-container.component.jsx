import './content-container.styles.css';

const Content = (props) => {
   return (
      <div className={`content-container ${props.className}`}>
         {props.children}
      </div>
   )
}

export default Content;