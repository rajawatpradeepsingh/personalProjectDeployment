import { useState, useEffect, useRef } from 'react';
import { useOnOutsideClick } from '../../../Hooks/useOnOutsideClick';
import Search from "../search-bar/search-bar.component";
import Button from '../button/button.component';
import { Popconfirm, Popover, Checkbox } from "antd";
import {
  ShareAltOutlined,
  ContainerOutlined,
  TableOutlined,
  ExportOutlined,
  SettingFilled
} from "@ant-design/icons";

export const TableTitle = (props) => {
  const tableMenuRef = useRef(null);
  const searchRef = useRef(null);
  const [openTableMenu, setOpenTableMenu] = useState(false);
  const [openConfirmArchive, setOpenConfirmArchive] = useState(false);
  const [colTitles, setColTitles] = useState(props.removeableColumns);

  const toggleTableMenu = () => setOpenTableMenu(!openTableMenu);

  const clearSearch = () => {
    //after applying a search in a filter request all search endpoints could be removed
    const newFilter = { ...props.filters };
    delete newFilter["search"];
    props.setFilters(newFilter);
  };

  useEffect(() => {
    setOpenConfirmArchive(false);
  }, [props.rowSelection.selectedRowKeys.length]);

  useOnOutsideClick(tableMenuRef, () => setOpenTableMenu(false));

  const onColChange = (col) => {
    if (colTitles.includes(col)) {
      setColTitles(colTitles.filter(title => title !== col));
      let temp = [...props.columns].filter(obj => obj.title !== col);
      props.setColumns(temp);
    } else {
      let index = props.removeableColumns.indexOf(col);
      let titles = [...colTitles];
      titles.splice(index, 0, col);
      setColTitles(titles);
      let columnObj = props.defaultColumns.filter(obj => obj.title === col)[0];
      let temp = [...props.columns];
      let colIndex = props.defaultColumns.findIndex((obj) => obj.title === col);
      temp.splice(colIndex, 0, columnObj);
      props.setColumns(temp);
    }
  }

  const CustomizeColumnsList = () => (
    <ul className="custom-col-list">
      {props.removeableColumns.map((col) => (
        <li className="custom-col-list-item" id={col} key={col}>
          <Checkbox onChange={() => onColChange(col)} checked={!colTitles.includes(`${col}`)}>{col}</Checkbox>
        </li>
      ))}
    </ul>
  );

  const clearAllFilters = () => {
    props.setFilters({});
    if (searchRef.current.searchValue) searchRef.current.clearSearch();
  }

  return (
    <div className="table-actions-container">
      <div
        className={`table-btns ${
          props.rowSelection.selectedRowKeys.length > 0 ? "margin" : ""
        }`}
      >
        {props.rowSelection.selectedRowKeys.length > 0 &&
          props.openShareModal && (
            <Button
              type="button"
              onClick={props.openShareModal}
              className={"btn main outlined margin-right"}
            >
              <ShareAltOutlined className="icon" /> Share Item(s)
            </Button>
          )}
        {props.rowSelection.selectedRowKeys.length > 0 && (
          <Popconfirm
            title="Archive Selection?"
            open={openConfirmArchive}
            onConfirm={props.handleConfirmArchive}
            onCancel={props.handleCancelArchiving}
            style={{ zIndex: 20 }}
          >
            <button
              type="button"
              className={"btn main outlined red margin-right"}
              onClick={() => setOpenConfirmArchive(true)}
            >
              {" "}
              <ContainerOutlined className="icon" />
              Archive Item(s)
            </button>
          </Popconfirm>
        )}
        {Object.values(props.filters).length > 0 && (
          <Button
            type="button"
            handleClick={clearAllFilters}
            className={"btn padding rounded outlined margin-right"}
          >
            Clear All Filters ({Object.values(props.filters).length})
          </Button>
        )}
      </div>

      <Search
        options={props.searchOptions}
        list={props.searchList}
        handleSearch={props.handleSearch}
        clearSearch={clearSearch}
        ref={searchRef}
      />

      <div className="table-subactions" ref={tableMenuRef}>
        <Button
          type="button"
          name="table-menu"
          className={"btn icon marginY"}
          handleClick={toggleTableMenu}
        >
          <SettingFilled />
        </Button>
        <div className={`table-menu ${openTableMenu ? "visible" : "hidden"}`}>
          {props.removeableColumns && (
            <Popover
              placement="bottom"
              title="Select Columns to Hide"
              content={<CustomizeColumnsList />}
              trigger={"click"}
              showArrow={false}
            >
              <Button
                type="button"
                handleClick={null}
                className="btn marginY padding transparent"
              >
                <TableOutlined className="icon" /> Hide Columns
              </Button>
            </Popover>
          )}
          <Button
            type="button"
            name="archive"
            className="btn marginY padding transparent"
            handleClick={props.openArchive}
          >
            <ContainerOutlined className="icon" /> View Archive
          </Button>
          {props.openReports && (
          <Button
            type="button"
            handleClick={props.openReports}
            className="btn marginY padding transparent"
          >
            <ExportOutlined className="icon" /> Export Report
          </Button>
          )}
          
        </div>
      </div>
    </div>
  );
}