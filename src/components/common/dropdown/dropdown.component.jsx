import { useState, useEffect } from "react";
import "antd/dist/antd.css";
import { DownOutlined } from "@ant-design/icons";
import { Dropdown, Menu, Space } from "antd";

const DropdownMenu = (props) => {
  const [selected, setSelected] = useState("");

  const handleClick = (value) => {
    setSelected(value.key);

    let selectedId = value.key.split("-")[1];
    let selectedName = value.domEvent.target.innerText;
    props.handleSelect(selectedId, selectedName);
  };

  useEffect(() => {
    if (!props.selected) setSelected("");
  }, [props.selected]);

  const items = [
    {
      key: "1",
      label: (
        <Menu
          selectable
          selectedKeys={selected}
          onClick={handleClick}
          items={props.items.map((item) => {
            return {
              key: item.key,
              label: item.label,
              children: item.children ? item.children : null,
            };
          })}
        />
      )
    },
  ];

  return (
    <Dropdown menu={{ items }}>
      <a
        href="#/"
        onClick={(e) => e.preventDefault()}
        style={{
          color: "#555",
          alignSelf: "center",
          border: "1px solid rgb(195, 195, 195)",
          padding: "2px 10px 2px 5px",
          borderRadius: "5px",
          marginRight: "15px",
        }}
      >
        <Space wrap>
          {props.menuTitle}
          <DownOutlined />
        </Space>
      </a>
    </Dropdown>
  );
};

export default DropdownMenu;
