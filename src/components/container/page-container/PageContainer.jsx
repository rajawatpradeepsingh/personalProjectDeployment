import { useSelector } from 'react-redux';
import './page_container_styles.scss';

export const PageContainer = (props) => {
   const { navMenuOpen } = useSelector((state) => state.nav);

   return (
      <div className={`page ${navMenuOpen && 'open-menu'} ${props.className && props.className}`}>
         {props.children}
      </div>
   )
}