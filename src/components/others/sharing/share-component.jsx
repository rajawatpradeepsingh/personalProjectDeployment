import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import LargeModal from "../../modal/large-modal/large-modal.component";
import { setShowModal } from "../../../Redux/shareDataSlice";
import SingleSelect from "../../common/select/selects.component";
import Form from "../../common/form/form.component";
import { Table } from "antd";
import "./styles.css"
import { postSharing } from "../../../API/sharing/sharing-apis";
import { getValueByNestedPath } from "../../../utils/service";
import MultiSelect from "../../common/select/multiSelect/multiSelect.component";

const sharedDataPageSize = 5;

const ShareData = (props) => {
  const { sources, receivers, getData, columns, contentMapping } = props;
  const dispatch = useDispatch();
  const { showModal } = useSelector((state) => state.shareDate);
  const [rowsAreSelected, setRowsAreSelected] = useState(false);
  const [preference, setPreference] = useState({});
  const [selectedReceivers, setSelectedReceivers] = useState([]);
  const [data, setData] = useState([]);
  const [content, setContent] = useState([]);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    if (preference?.criteria?.selection?.id)
      getData(preference?.criteria, page, sharedDataPageSize)
        .then(res => {
          const data = res.data.map(row => ({ ...row, content: row[contentMapping.body] }));
          if (res.data) {
            setData(data);
            setTotalItems(res.totalItems);
          }
        });
  }, [getData, preference?.criteria, contentMapping.body, page])

  const clearData = () => {
    setPreference({});
    setData([]);
    setRowsAreSelected(false);
    setContent([]);
    setSelectedReceivers([]);
  };

  const closeModal = () => {
    dispatch(setShowModal(false));
    clearData();
  };

  const changeCriteria = (e) => {
    const { value } = e.target;
    const criteria = sources.find(source => +source.id === +value);
    setPreference(prev => ({ ...prev, criteria }));
    setData([]);
    setContent(prev => ({ ...prev, body: [] }));
  };

  const changeReceivers = (selections) => {
    const selected = selections
      .filter(selection => selection.selected)
      .map(selection => selection.id);
    const recs = selected.map(id => receivers.find(rec => rec.id === id));

    setSelectedReceivers(selected);
    setPreference(prev => ({ ...prev, receivers: recs }));
    setContent(prev => ({ ...prev, receivers: recs }));
  };

  const onSelect = (e) => {
    const { value } = e.target;
    const criterion = preference?.criteria;
    const selection = criterion?.options?.find(option => +option.id === +value);
    setPreference(prev => ({ ...prev, criteria: { ...criterion, selection: selection } }));
    setContent(prev => ({ ...prev, body: [] }));
  };

  const changePage = (page) => setPage(page);

  const handleSubmit = (e) => {
    e.preventDefault();
    postSharing(content).finally(() => closeModal());
  };

  const getMappedHeader = (object, mapping) => {
    return mapping.map(mapped => {
      const key = mapped.split(".")[0];
      const value = getValueByNestedPath(object, mapped)
      return `${key.charAt(0).toUpperCase() + key.slice(1).toLowerCase()}: ${value}`
    }).join(".\n");
  };

  const getMappedBody = (object, mapping) => mapping.map(mapped => getValueByNestedPath(object, mapped)).join(".\n");

  const rowSelection = {
    onChange: (_, selectedRows) => {
      setRowsAreSelected(selectedRows.length ? true : false);
      const content = selectedRows.map(row => {
        const header = getMappedHeader(row, contentMapping.header);
        const body = getMappedBody(row, contentMapping.body);
        return { header, body }
      });
      const receivers = preference?.receivers || [];
      setContent({ content, receivers });
    },
  };

  return (
    <LargeModal
      open={showModal}
      close={closeModal}
      header={{ text: props.title, }}
      bodyStyle={{ overflowY: "" }}
    >
      {sources && (
        <div className="sharing-form">
          <SingleSelect
            label="Criteria of sharing"
            name="criteria"
            onChange={changeCriteria}
            options={sources?.map(source => ({ id: source.id, value: source.id, name: source.name }))}
            value={preference?.criteria?.id}
          />
          {preference?.criteria?.options?.length > 0 && (
            <SingleSelect
              label={preference?.criteria?.name}
              options={preference?.criteria?.options}
              onChange={onSelect}
              value={preference?.criteria?.selection?.id}
            />
          )}
        </div>
      )}
      {data?.length > 0 && (
        <div className="sharing-table">
          <Table
            className="custom-antd-table"
            columns={columns}
            dataSource={data}
            rowKey={(row) => row.id}
            rowSelection={rowSelection}
            pagination={{
              current: page,
              onChange: changePage,
              total: totalItems,
              pageSize: sharedDataPageSize,
            }}
          />
        </div>
      )}
      {receivers && (
        <div className="sharing-table">
          <MultiSelect
            label="Receivers list"
            options={receivers.map(rec => (
              {
                id: rec.id,
                value: rec.name,
                selected: selectedReceivers.indexOf(rec.id) >= 0
              }
            ))}
            handleChange={changeReceivers}
            isMulti
            checkboxes
            placeholder="Select..."
          />
        </div>
      )}
      <Form
        onSubmit={handleSubmit}
        cancel={closeModal}
        formEnabled={rowsAreSelected && preference?.receivers?.length > 0}
      />
    </LargeModal>
  );
};

export default ShareData;


/*** Expected object's structure+data
* function for obtaining data on selected parameters
getData: getSharingGuides 

* defining columns to render the result of getData
columns: [
  {
    title: "Column1",
    dataIndex: "columnKey",
    render: (value) => <div>{value.name}</div>,
  }, ...
]

* keys to create header/body for shared content
contentMapping: { 
  header: ["subject.name", "client.clientName"], 
  body: ["questions"]
}

* receivers list with emails 
receivers: [
    {
        "id": 1,
        "name": "receiver1",
        "email": "receiver1@gmail.com",
    }, ...
]

* list of categories with their various options
sources: [
    {
        "id": 1,
        "name": "Subject",
        "options": [
            {
                "id": 1,
                "name": "Developer"
            }, ...
        ]
    }, ...
]
***/
