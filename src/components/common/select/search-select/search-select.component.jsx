import { useState, useEffect } from 'react';
import { CloseCircleFilled, DownOutlined, SearchOutlined } from "@ant-design/icons";
import './search-select.styles.css';

const SearchSelect = (props) => {
   const [searchValue, setSearchValue] = useState("");
   const [options, setOptions] = useState([]);
   const [menuOpen, setMenuOpen] = useState(false);

   useEffect(() => {
      if (props.options.length) setOptions(props.options);
   }, [props.options]);

   useEffect(() => {
      if (props.value) {
         setSearchValue(props.value);
      } else {
         setSearchValue("");
      }
   }, [props.value])

   const handleSearchChange = (event) => {
      setSearchValue(event.target.value);
      if (event.target.value) {
         const filteredOptions = props.options.filter(option => option.name.toLowerCase().includes(event.target.value.toLowerCase()));
         setOptions(filteredOptions);
      } else {
         setOptions(props.options);
      }
   }

   const handleOptionClick = (event, value, name) => {
      event.stopPropagation();
      const newValues = { target: { value: value, name: name } }
      props.handleSelect(newValues);
      setMenuOpen(false);
   }

   const clearSelection = () => {
      const newValues = { target: { value: null, name: props.name } };
      props.handleSelect(newValues);
   }

   const openMenu = () => {
      setMenuOpen(true)
   };

   const closeMenu = (event) => {
      if (!event.currentTarget.contains(event.relatedTarget)) setMenuOpen(false);
   }


   return (
      <div className='search-select-container' tabIndex={0} onClick={openMenu} onBlur={closeMenu}>
         <label htmlFor={props.name} className="search-select-label">{props.required && !props.disabled && <span className='required'>*</span>} {props.label}</label>
         <input
            type="text"
            name={props.name}
            id={props.id ? props.id : props.name}
            value={searchValue}
            onChange={handleSearchChange}
            required={props.required}
            disabled={props.disabled}
            placeholder='Search'
            className={props.className ? `search-input ${props.className}` : 'search-input'}
            autoComplete="off"
         />
         {props.value && <span className='clear-icon' onClick={clearSelection}><CloseCircleFilled className='clear-icon-content' /></span>}
         {!props.value && <span className='search-icon'><SearchOutlined /></span>}
         <span className='toggle-menu-arrow'><DownOutlined className='menu-arrow' /></span>
         {menuOpen && <div className='search-select-menu'>
            <ul className='search-select-menu-list'>
               {options.length > 0 ? options.map(option => (
                  <li className="search-select-menu-list-item" onClick={(event) => handleOptionClick(event, option.id, props.name)} key={option.id}>{option.name}</li>
               )) : <li className="search-select-menu-list-item">No Matches</li>}
            </ul>
         </div>}
      </div>
   )
}

export default SearchSelect;